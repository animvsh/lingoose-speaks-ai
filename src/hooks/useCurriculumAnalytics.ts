
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { subDays, isAfter, startOfWeek, endOfWeek } from "date-fns";

export const useCurriculumAnalytics = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['curriculum-analytics', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('No user found');
      }

      // Fetch VAPI call analysis data
      const { data: callAnalysis, error: callError } = await supabase
        .from('vapi_call_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (callError) {
        console.error('Error fetching call analysis:', callError);
      }

      // Fetch user activity ratings as fallback
      const { data: activityRatings, error: ratingsError } = await supabase
        .from('user_activity_ratings')
        .select(`
          *,
          activities (
            name,
            description
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (ratingsError) {
        console.error('Error fetching activity ratings:', ratingsError);
      }

      // Combine and analyze the data
      const allCallData = callAnalysis || [];
      const allRatings = activityRatings || [];

      // Calculate analytics
      const totalCalls = allCallData.length + allRatings.length;
      
      // Calculate total talk time from both sources
      const callAnalysisDuration = allCallData.reduce((sum, call) => 
        sum + (call.call_duration || 0), 0
      );
      const ratingsDuration = allRatings.reduce((sum, rating) => 
        sum + (rating.duration_seconds || 0), 0
      );
      const totalDurationSeconds = callAnalysisDuration + ratingsDuration;
      const totalDurationMinutes = Math.round(totalDurationSeconds / 60);
      
      const talkTime = totalDurationMinutes >= 60 
        ? `${Math.floor(totalDurationMinutes / 60)}.${Math.round((totalDurationMinutes % 60) / 6)}h`
        : `${totalDurationMinutes}min`;

      // Calculate fluency score from sentiment analysis and ratings
      let fluencyScore = 0;
      let avgRating = 0;
      
      if (allCallData.length > 0) {
        const positiveCallsCount = allCallData.filter(call => 
          call.sentiment_analysis?.overall_sentiment === 'positive'
        ).length;
        fluencyScore = Math.round((positiveCallsCount / allCallData.length) * 100);
      }
      
      if (allRatings.length > 0) {
        avgRating = Math.round(
          allRatings.reduce((sum, rating) => sum + rating.rating, 0) / allRatings.length
        );
        // If we have ratings, use them to adjust fluency score
        const ratingsBasedScore = Math.round((avgRating / 5) * 100);
        fluencyScore = fluencyScore > 0 ? Math.round((fluencyScore + ratingsBasedScore) / 2) : ratingsBasedScore;
      }

      // Calculate current streak
      const allDates = [
        ...allCallData.map(call => call.created_at),
        ...allRatings.map(rating => rating.completed_at)
      ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < allDates.length; i++) {
        const activityDate = new Date(allDates[i]);
        activityDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else if (daysDiff > streak) {
          break;
        }
      }

      // This week's activity
      const oneWeekAgo = subDays(new Date(), 7);
      const thisWeekCalls = allDates.filter(date => 
        isAfter(new Date(date), oneWeekAgo)
      ).length;

      // Recent improvements analysis
      const recentCallAnalysis = allCallData.slice(0, 5);
      const recentImprovements = [];
      const strugglingAreas = [];

      // Analyze sentiment trends
      if (recentCallAnalysis.length >= 2) {
        const recentPositive = recentCallAnalysis.filter(call => 
          call.sentiment_analysis?.overall_sentiment === 'positive'
        ).length;
        const recentNegative = recentCallAnalysis.filter(call => 
          call.sentiment_analysis?.overall_sentiment === 'negative'
        ).length;

        if (recentPositive > recentNegative) {
          recentImprovements.push({
            area: 'Conversation Confidence',
            improvement: recentPositive,
            attempts: recentCallAnalysis.length,
            source: 'call_analysis'
          });
        } else if (recentNegative > recentPositive) {
          strugglingAreas.push({
            area: 'Conversation Flow',
            avgPerformance: Math.round((recentNegative / recentCallAnalysis.length) * 100),
            attempts: recentCallAnalysis.length,
            source: 'call_analysis'
          });
        }
      }

      // Add activity rating insights
      const recentRatings = allRatings.slice(0, 5);
      if (recentRatings.length >= 2) {
        const avgRecentRating = recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length;
        
        if (avgRecentRating >= 4) {
          recentImprovements.push({
            area: 'Skill Practice',
            improvement: Math.round(avgRecentRating),
            attempts: recentRatings.length,
            source: 'ratings'
          });
        } else if (avgRecentRating < 3) {
          strugglingAreas.push({
            area: 'Practice Activities',
            avgPerformance: Math.round(avgRecentRating * 20), // Convert to percentage
            attempts: recentRatings.length,
            source: 'ratings'
          });
        }
      }

      return {
        totalCalls,
        talkTime,
        fluencyScore,
        currentStreak: streak,
        thisWeekCalls,
        avgRating,
        recentImprovements: recentImprovements.slice(0, 3),
        strugglingAreas: strugglingAreas.slice(0, 3),
        callAnalysisCount: allCallData.length,
        activityRatingsCount: allRatings.length,
        lastActivity: allDates[0] ? new Date(allDates[0]) : null
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds to catch new data
  });
};
