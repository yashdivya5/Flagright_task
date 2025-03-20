
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateReport } from '@/services/api';
import { Report } from '@/types';
import { FileDown, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import TransactionChart from '@/components/TransactionChart';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to 30 days ago
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0]; // Default to today
  });
  
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const data = await generateReport(startDate, endDate);
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast({
        title: "Error generating report",
        description: "Failed to generate the transaction report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load report on initial render
  useEffect(() => {
    fetchReport();
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };
  
  // Mock function for CSV export
  const handleExportCSV = () => {
    // In a real app, this would trigger an API call to generate a CSV
    toast({
      title: "Report Downloaded",
      description: "In a real application, this would download a CSV report.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card className="animate-enter glass">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Transaction Reports</CardTitle>
              <CardDescription>
                Generate and analyze transaction reports for specific date ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleExportCSV}
                    disabled={isLoading || !report}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                  <Button type="submit" disabled={isLoading} className="button-press">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Report'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Generating report...</span>
            </div>
          ) : report ? (
            <TransactionChart data={report} />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Reports;
