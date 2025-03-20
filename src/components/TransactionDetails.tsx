
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Calendar, CreditCard, Map, Tag, User } from 'lucide-react';

interface TransactionDetailsProps {
  transaction: Transaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto animate-enter glass">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          <CardTitle className="text-2xl font-semibold">Transaction Details</CardTitle>
        </div>
        <Badge className={`text-sm py-1 px-3 ${getStatusColor(transaction.status)}`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center py-4">
          <div className="text-3xl font-bold">{formatCurrency(transaction.amount)}</div>
          <div className="text-muted-foreground text-sm">{transaction.currency}</div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Calendar size={14} className="mr-1.5" /> Date & Time
              </div>
              <div className="font-medium">
                {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm">
                {new Date(transaction.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <User size={14} className="mr-1.5" /> User ID
              </div>
              <div className="font-medium">{transaction.userId}</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="font-medium">{transaction.description}</div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Map size={14} className="mr-1.5" /> Country
              </div>
              <div className="font-medium">{transaction.country}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <CreditCard size={14} className="mr-1.5" /> Payment Method
              </div>
              <div className="font-medium capitalize">
                {transaction.paymentMethod?.replace('_', ' ') || 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center">
              <Tag size={14} className="mr-1.5" /> Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {transaction.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
              {transaction.tags.length === 0 && <span className="text-muted-foreground">No tags</span>}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Transaction ID: {transaction.id}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionDetails;
