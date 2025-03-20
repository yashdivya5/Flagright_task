
// Transaction types
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: string;
  status: TransactionStatus;
  userId: string;
  country: string;
  tags: string[];
  merchantName?: string;
  currency: string;
  paymentMethod?: string;
}

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'amount' | 'timestamp';
  sortOrder?: 'asc' | 'desc';
  userId?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  tags?: string[];
  status?: TransactionStatus;
  country?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionResponse {
  data: Transaction[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface Report {
  startDate: string;
  endDate: string;
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  transactionsByStatus: Record<TransactionStatus, number>;
  transactionsByDay: Array<{date: string, count: number, amount: number}>;
}

// CRON job status
export type CronJobStatus = 'running' | 'stopped';
