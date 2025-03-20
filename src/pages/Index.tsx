
import React, { useState, useCallback } from 'react';
import { useTransactionList } from '@/hooks/useTransactions';
import Header from '@/components/Header';
import TransactionTable from '@/components/TransactionTable';
import SearchFilters from '@/components/SearchFilters';
import CronJobController from '@/components/CronJobController';
import { TransactionQueryParams } from '@/types';

const Index = () => {
  const [queryParams, setQueryParams] = useState<TransactionQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });
  
  const {
    transactions,
    pagination,
    isLoading,
    refetch,
    updateParams
  } = useTransactionList(queryParams);
  
  const handlePageChange = useCallback((page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
    updateParams({ page });
  }, [updateParams]);
  
  const handleSortChange = useCallback((sortBy: 'amount' | 'timestamp', sortOrder: 'asc' | 'desc') => {
    setQueryParams(prev => ({ ...prev, sortBy, sortOrder }));
    updateParams({ sortBy, sortOrder });
  }, [updateParams]);
  
  const handleFilterChange = useCallback((filters: TransactionQueryParams) => {
    // Reset to first page when filters change
    const newParams = { ...filters, page: 1 };
    setQueryParams(prev => ({ ...prev, ...newParams }));
    updateParams(newParams);
  }, [updateParams]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <SearchFilters 
              onApplyFilters={handleFilterChange}
              initialFilters={queryParams}
            />
            
            <TransactionTable
              transactions={transactions}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              currentSort={{
                sortBy: queryParams.sortBy,
                sortOrder: queryParams.sortOrder
              }}
              onRefresh={refetch}
            />
          </div>
          
          <div className="space-y-6">
            <CronJobController />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
