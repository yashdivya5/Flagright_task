
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useCronJob } from '@/hooks/useTransactions';

const CronJobController = () => {
  const { status, isLoading, isToggling, toggleStatus } = useCronJob();
  
  return (
    <Card className="w-full animate-enter glass border rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          Transaction Generator
          {isLoading ? (
            <RefreshCw className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />
          ) : status === 'running' ? (
            <span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse-soft"></span>
          ) : (
            <span className="ml-2 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </CardTitle>
        <CardDescription>Control the automatic transaction generator</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Status: <span className="font-medium">{status === 'running' ? 'Running' : 'Stopped'}</span></p>
            <p className="text-xs text-muted-foreground mt-1">
              {status === 'running' 
                ? 'Generating one transaction every second'
                : 'The generator is currently inactive'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={toggleStatus} 
          disabled={isToggling || isLoading} 
          variant={status === 'running' ? "destructive" : "default"}
          className="w-full button-press"
        >
          {isToggling ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : status === 'running' ? (
            <Pause className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {status === 'running' ? 'Stop Generator' : 'Start Generator'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CronJobController;
