
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTransactions, 
  fetchTransactionById, 
  createTransaction,
  getCronJobStatus,
  toggleCronJob 
} from '../services/api';
import { Transaction, TransactionQueryParams, CronJobStatus } from '../types';
import { useToast } from './use-toast';

// Hook for transaction listing with pagination, sorting, and filtering
export function useTransactionList(initialParams: TransactionQueryParams = { page: 1, limit: 10 }) {
  const [queryParams, setQueryParams] = useState<TransactionQueryParams>(initialParams);
  const { toast } = useToast();
  
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['transactions', queryParams],
    queryFn: () => fetchTransactions(queryParams),
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Update query parameters and refetch
  const updateParams = useCallback((newParams: TransactionQueryParams) => {
    setQueryParams(prev => ({ ...prev, ...newParams }));
  }, []);
  
  // Handle pagination
  const goToPage = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);
  
  // Handle errors
  if (isError && error instanceof Error) {
    toast({
      title: "Error loading transactions",
      description: error.message,
      variant: "destructive"
    });
  }
  
  return {
    transactions: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError,
    refetch,
    updateParams,
    queryParams,
    goToPage
  };
}

// Hook for individual transaction details
export function useTransactionDetails(id: string) {
  const { toast } = useToast();
  
  const { 
    data: transaction, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => fetchTransactionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Handle errors
  if (isError && error instanceof Error) {
    toast({
      title: "Error loading transaction details",
      description: error.message,
      variant: "destructive"
    });
  }
  
  return {
    transaction,
    isLoading,
    isError
  };
}

// Hook for creating a new transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: (newTransaction: Omit<Transaction, 'id'>) => 
      createTransaction(newTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaction created",
        description: "The transaction has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating transaction",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  return mutation;
}

// Hook for managing the CRON job
export function useCronJob() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    data: status, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['cronJobStatus'],
    queryFn: getCronJobStatus,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
  
  const mutation = useMutation({
    mutationFn: (newStatus: CronJobStatus) => toggleCronJob(newStatus),
    onSuccess: (newStatus) => {
      queryClient.setQueryData(['cronJobStatus'], newStatus);
      toast({
        title: `CRON job ${newStatus}`,
        description: `The transaction generator has been ${newStatus}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error toggling CRON job",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const toggleStatus = useCallback(() => {
    if (status) {
      mutation.mutate(status === 'running' ? 'stopped' : 'running');
    }
  }, [status, mutation]);
  
  return {
    status: status || 'stopped',
    isLoading,
    isError,
    toggleStatus,
    isToggling: mutation.isPending
  };
}
