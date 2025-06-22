
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchCallData } from '@/hooks/useFetchCallData';
import { Download, Loader2 } from 'lucide-react';

export const ManualCallDataFetch: React.FC = () => {
  const [callId, setCallId] = useState('');
  const { fetchCallData, isFetching } = useFetchCallData();

  const handleFetchData = () => {
    if (callId.trim()) {
      fetchCallData(callId.trim());
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Fetch Call Data
        </CardTitle>
        <CardDescription>
          Enter a VAPI call ID to manually fetch and analyze call data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter VAPI Call ID"
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
            disabled={isFetching}
          />
        </div>
        <Button 
          onClick={handleFetchData}
          disabled={!callId.trim() || isFetching}
          className="w-full"
        >
          {isFetching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Fetching Data...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Fetch Call Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
