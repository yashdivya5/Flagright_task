
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Transaction, Report } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface TransactionChartProps {
  data: Report;
}

const TransactionChart: React.FC<TransactionChartProps> = ({ data }) => {
  // Prepare data for the status pie chart
  const statusData = useMemo(() => {
    return Object.entries(data.transactionsByStatus).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [data.transactionsByStatus]);
  
  // Colors for the status pie chart
  const STATUS_COLORS = {
    completed: '#10B981',  // green
    pending: '#F59E0B',    // amber
    failed: '#EF4444',     // red
    refunded: '#6366F1'    // indigo
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 w-full">
      <Card className="w-full glass animate-enter">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Transaction Volume</CardTitle>
        </CardHeader>
        <CardContent className="pl-0">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.transactionsByDay}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full glass animate-enter">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Transaction Count</CardTitle>
        </CardHeader>
        <CardContent className="pl-0">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.transactionsByDay}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value} transactions`, 'Count']}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full glass animate-enter">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Transaction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full glass animate-enter">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Transactions</div>
                <div className="text-2xl font-semibold mt-1">{data.totalTransactions.toLocaleString()}</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-semibold mt-1">{formatCurrency(data.totalAmount)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Average Amount</div>
                <div className="text-2xl font-semibold mt-1">{formatCurrency(data.averageAmount)}</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Date Range</div>
                <div className="text-sm font-semibold mt-1">
                  {new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="flex space-x-4 mt-2">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-xs capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionChart;
