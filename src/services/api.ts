
import { Transaction, TransactionQueryParams, TransactionResponse, Report, CronJobStatus } from '../types';

// Mock API base URL - In a real app, this would be replaced with the actual API URL
const API_BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  return response.json();
};

// Functions for transaction operations
export const fetchTransactions = async (params: TransactionQueryParams): Promise<TransactionResponse> => {
  // In a real implementation, this would make a real API call
  const queryParams = new URLSearchParams();
  
  // Add all non-undefined params to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(val => queryParams.append(key, val));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  // For demonstration, we'll simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate API response
  // This would be replaced with a real API call in production
  const mockResponse = generateMockTransactions(params);
  return mockResponse;
};

export const fetchTransactionById = async (id: string): Promise<Transaction> => {
  // In a real implementation, this would make a real API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock transaction data
  return {
    id,
    amount: 1000 + Math.random() * 9000,
    description: `Transaction ${id}`,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: ['completed', 'pending', 'failed', 'refunded'][Math.floor(Math.random() * 4)] as any,
    userId: `user_${Math.floor(Math.random() * 100)}`,
    country: ['US', 'UK', 'CA', 'AU', 'DE', 'FR'][Math.floor(Math.random() * 6)],
    tags: ['shopping', 'food', 'travel', 'entertainment'].slice(0, Math.floor(Math.random() * 4) + 1),
    merchantName: `Merchant ${Math.floor(Math.random() * 100)}`,
    currency: ['USD', 'EUR', 'GBP', 'CAD'][Math.floor(Math.random() * 4)],
    paymentMethod: ['credit_card', 'debit_card', 'bank_transfer', 'paypal'][Math.floor(Math.random() * 4)]
  };
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  // In a real implementation, this would make a real API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock create transaction
  return {
    ...transaction,
    id: `txn_${Date.now()}`
  };
};

export const generateReport = async (startDate: string, endDate: string): Promise<Report> => {
  // In a real implementation, this would make a real API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate dates between start and end
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  const transactionsByDay = [];
  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    transactionsByDay.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 100),
      amount: Math.floor(Math.random() * 10000)
    });
  }
  
  // Mock report data
  return {
    startDate,
    endDate,
    totalTransactions: transactionsByDay.reduce((sum, day) => sum + day.count, 0),
    totalAmount: transactionsByDay.reduce((sum, day) => sum + day.amount, 0),
    averageAmount: Math.round(transactionsByDay.reduce((sum, day) => sum + day.amount, 0) / transactionsByDay.reduce((sum, day) => sum + day.count, 0)),
    transactionsByStatus: {
      completed: Math.floor(Math.random() * 1000),
      pending: Math.floor(Math.random() * 100),
      failed: Math.floor(Math.random() * 50),
      refunded: Math.floor(Math.random() * 30)
    },
    transactionsByDay
  };
};

export const getCronJobStatus = async (): Promise<CronJobStatus> => {
  // In a real implementation, this would make a real API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock CRON job status
  return Math.random() > 0.5 ? 'running' : 'stopped';
};

export const toggleCronJob = async (newStatus: CronJobStatus): Promise<CronJobStatus> => {
  // In a real implementation, this would make a real API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the new status (in a real app, this would be the status from the server)
  return newStatus;
};

// Helper to generate mock transaction data
const generateMockTransactions = (params: TransactionQueryParams): TransactionResponse => {
  const { page = 1, limit = 10 } = params;
  
  const totalItems = 243; // Total mock transactions
  const totalPages = Math.ceil(totalItems / limit);
  
  // Generate mock transactions
  const transactions: Transaction[] = [];
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  
  for (let i = startIndex; i < endIndex; i++) {
    const id = `txn_${1000 + i}`;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within the last 30 days
    
    transactions.push({
      id,
      amount: 100 + Math.floor(Math.random() * 9900), // Amount between 100 and 10000
      description: `Transaction for ${['Electronics', 'Groceries', 'Entertainment', 'Travel', 'Dining'][Math.floor(Math.random() * 5)]}`,
      timestamp: date.toISOString(),
      status: ['completed', 'pending', 'failed', 'refunded'][Math.floor(Math.random() * 4)] as any,
      userId: `user_${Math.floor(Math.random() * 20)}`, // 20 random users
      country: ['US', 'UK', 'CA', 'AU', 'DE', 'FR'][Math.floor(Math.random() * 6)],
      tags: ['shopping', 'food', 'travel', 'entertainment', 'subscription', 'utility'].slice(0, Math.floor(Math.random() * 3) + 1),
      merchantName: `Merchant ${Math.floor(Math.random() * 50)}`,
      currency: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'][Math.floor(Math.random() * 5)],
      paymentMethod: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'crypto'][Math.floor(Math.random() * 5)]
    });
  }
  
  // Sort if requested
  if (params.sortBy) {
    const order = params.sortOrder === 'desc' ? -1 : 1;
    transactions.sort((a, b) => {
      if (params.sortBy === 'amount') {
        return (a.amount - b.amount) * order;
      } else if (params.sortBy === 'timestamp') {
        return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * order;
      }
      return 0;
    });
  }
  
  // Filter if requested - in a real app, this would be done on the server
  const filtered = transactions.filter(tx => {
    let match = true;
    
    // Filter by userId
    if (params.userId && tx.userId !== params.userId) {
      match = false;
    }
    
    // Filter by date range
    if (params.startDate && new Date(tx.timestamp) < new Date(params.startDate)) {
      match = false;
    }
    if (params.endDate && new Date(tx.timestamp) > new Date(params.endDate)) {
      match = false;
    }
    
    // Filter by description
    if (params.description && !tx.description.toLowerCase().includes(params.description.toLowerCase())) {
      match = false;
    }
    
    // Filter by tags
    if (params.tags && params.tags.length > 0) {
      if (!params.tags.some(tag => tx.tags.includes(tag))) {
        match = false;
      }
    }
    
    // Filter by status
    if (params.status && tx.status !== params.status) {
      match = false;
    }
    
    // Filter by country
    if (params.country && tx.country !== params.country) {
      match = false;
    }
    
    // Filter by amount range
    if (params.minAmount !== undefined && tx.amount < params.minAmount) {
      match = false;
    }
    if (params.maxAmount !== undefined && tx.amount > params.maxAmount) {
      match = false;
    }
    
    return match;
  });
  
  return {
    data: filtered,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit
    }
  };
};
