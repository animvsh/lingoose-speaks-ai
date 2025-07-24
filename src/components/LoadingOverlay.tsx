import { ReactNode } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  variant?: 'default' | 'skeleton' | 'gentle';
}

const LoadingOverlay = ({ 
  isLoading, 
  children, 
  variant = 'default' 
}: LoadingOverlayProps) => {
  if (variant === 'skeleton' && isLoading) {
    return (
      <div className="w-full space-y-4 p-4 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    );
  }

  if (variant === 'gentle' && isLoading) {
    return (
      <div className="min-h-screen w-full hindi-bg flex items-center justify-center font-nunito">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-3xl border-2 border-handdrawn bg-white flex items-center justify-center mx-auto mb-4 animate-gentle-float shadow-lg">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="w-24 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-primary/40 to-primary animate-pulse rounded-full"></div>
            </div>
            <p className="text-brown-700 font-medium text-sm animate-pulse">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card rounded-lg p-6 shadow-lg animate-scale-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingOverlay;