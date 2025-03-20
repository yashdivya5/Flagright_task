
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import TransactionDetails from '@/components/TransactionDetails';
import { useTransactionDetails } from '@/hooks/useTransactions';
import { Loader2 } from 'lucide-react';

const TransactionView = () => {
  const { id } = useParams<{ id: string }>();
  const { transaction, isLoading, isError } = useTransactionDetails(id || '');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-lg font-medium">Error loading transaction</h2>
              <p className="text-muted-foreground">Unable to load transaction details</p>
            </div>
          </div>
        ) : transaction ? (
          <TransactionDetails transaction={transaction} />
        ) : null}
      </main>
    </div>
  );
};

export default TransactionView;
