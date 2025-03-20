
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  ArrowUpDown, 
  ArrowDown, 
  ArrowUp, 
  Loader2, 
  Download, 
  FileDown, 
  RefreshCw,
  Link as LinkIcon
} from 'lucide-react';
import { Transaction, PaginationInfo, TransactionQueryParams } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  pagination: PaginationInfo | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: 'amount' | 'timestamp', sortOrder: 'asc' | 'desc') => void;
  currentSort: { sortBy?: 'amount' | 'timestamp', sortOrder?: 'asc' | 'desc' };
  onRefresh: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  pagination,
  isLoading,
  onPageChange,
  onSortChange,
  currentSort,
  onRefresh
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  const handleSortClick = (field: 'amount' | 'timestamp') => {
    let newOrder: 'asc' | 'desc' = 'asc';
    
    if (currentSort.sortBy === field) {
      newOrder = currentSort.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      newOrder = 'asc';
    }
    
    onSortChange(field, newOrder);
  };
  
  const getSortIcon = (field: 'amount' | 'timestamp') => {
    if (currentSort.sortBy !== field) {
      return <ArrowUpDown size={16} />;
    }
    
    return currentSort.sortOrder === 'asc' 
      ? <ArrowUp size={16} /> 
      : <ArrowDown size={16} />;
  };
  
  const renderPagination = () => {
    if (!pagination) return null;
    
    const { currentPage, totalPages } = pagination;
    
    // Create visible page links
    const pageItems = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <span className="flex items-center justify-center h-10 w-10">...</span>
                </PaginationItem>
              )}
            </>
          )}
          
          {pageItems}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <span className="flex items-center justify-center h-10 w-10">...</span>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  // Mock function for CSV export
  const handleExportCSV = () => {
    // In a real app, this would trigger an API call to generate a CSV
    alert('This would download a CSV of the current transaction set in a real app');
  };
  
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <Card className="w-full animate-enter glass">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <div>
            <CardTitle className="text-lg font-medium">Transactions</CardTitle>
            <CardDescription>
              {!isLoading && pagination && (
                <>
                  Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}{' '}
                  of {pagination.totalItems} transactions
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportCSV}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium flex items-center p-0 h-auto"
                    onClick={() => handleSortClick('amount')}
                  >
                    Amount
                    <span className="ml-1">{getSortIcon('amount')}</span>
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium flex items-center p-0 h-auto"
                    onClick={() => handleSortClick('timestamp')}
                  >
                    Date
                    <span className="ml-1">{getSortIcon('timestamp')}</span>
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                      <span>Loading transactions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">
                      {truncateText(transaction.id, 10)}
                    </TableCell>
                    <TableCell>{truncateText(transaction.description, 30)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {truncateText(transaction.userId, 10)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/transaction/${transaction.id}`}>
                        <Button variant="ghost" size="sm">
                          <LinkIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <span className="text-sm text-muted-foreground">Items per page</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              const newLimit = parseInt(value);
              setItemsPerPage(newLimit);
              onPageChange(1); // Reset to first page when changing items per page
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={String(itemsPerPage)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {renderPagination()}
      </CardFooter>
    </Card>
  );
};

export default TransactionTable;
