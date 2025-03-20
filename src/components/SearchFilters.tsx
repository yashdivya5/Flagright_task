
import React, { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, Calendar, Search, X, ChevronRight } from 'lucide-react';
import { TransactionQueryParams, TransactionStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SearchFiltersProps {
  onApplyFilters: (filters: TransactionQueryParams) => void;
  initialFilters?: TransactionQueryParams;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onApplyFilters, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<TransactionQueryParams>({
    userId: initialFilters.userId || '',
    description: initialFilters.description || '',
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    tags: initialFilters.tags || [],
    status: initialFilters.status,
    country: initialFilters.country || '',
    minAmount: initialFilters.minAmount || 0,
    maxAmount: initialFilters.maxAmount || 10000,
  });
  
  // Available tags and countries for filters
  const availableTags = ['shopping', 'food', 'travel', 'entertainment', 'subscription', 'utility'];
  const availableCountries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value as TransactionStatus }));
  };
  
  const handleCountryChange = (value: string) => {
    setFilters(prev => ({ ...prev, country: value }));
  };
  
  const handleTagToggle = (tag: string) => {
    setFilters(prev => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      
      return { ...prev, tags: newTags };
    });
  };
  
  const handleAmountChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, minAmount: values[0], maxAmount: values[1] }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      userId: '',
      description: '',
      startDate: '',
      endDate: '',
      tags: [],
      status: undefined,
      country: '',
      minAmount: 0,
      maxAmount: 10000,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };
  
  // Count active filters to display in the button
  const countActiveFilters = () => {
    let count = 0;
    if (filters.userId) count++;
    if (filters.description) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.tags && filters.tags.length) count++;
    if (filters.status) count++;
    if (filters.country) count++;
    if (filters.minAmount && filters.minAmount > 0) count++;
    if (filters.maxAmount && filters.maxAmount < 10000) count++;
    return count;
  };
  
  const activeFiltersCount = countActiveFilters();
  
  return (
    <Card className="w-full shadow-sm overflow-hidden animate-enter">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Filter size={18} className="mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground"
          >
            <ChevronRight 
              size={18} 
              className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  name="userId"
                  placeholder="Filter by user ID"
                  value={filters.userId}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="description"
                    name="description"
                    placeholder="Search in description"
                    value={filters.description}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="flex items-center">
                  <Calendar size={16} className="mr-1.5" /> Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="endDate" className="flex items-center">
                  <Calendar size={16} className="mr-1.5" /> End Date
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label>Amount Range</Label>
              <div className="pt-6 px-2">
                <Slider
                  defaultValue={[filters.minAmount || 0, filters.maxAmount || 10000]}
                  max={10000}
                  step={100}
                  onValueChange={handleAmountChange}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{formatCurrency(filters.minAmount || 0)}</span>
                <span>{formatCurrency(filters.maxAmount || 10000)}</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.map(tag => (
                  <Button
                    key={tag}
                    type="button"
                    variant={filters.tags?.includes(tag) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                    className="capitalize"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={filters.country} 
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Any country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any country</SelectItem>
                    {availableCountries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          disabled={activeFiltersCount === 0}
          className="button-press"
        >
          <X size={16} className="mr-1" /> Clear
        </Button>
        
        <Button
          type="button"
          onClick={handleSubmit}
          size="sm"
          className="button-press"
        >
          <Filter size={16} className="mr-1" /> Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SearchFilters;
