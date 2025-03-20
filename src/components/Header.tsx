
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileBarChart, PlusCircle, Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b glass sticky top-0 z-50 w-full backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-semibold tracking-tight transition-colors">
              Transactor
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "secondary" : "ghost"} 
                className="group flex items-center gap-2"
              >
                <LayoutDashboard size={18} /> 
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/reports">
              <Button 
                variant={isActive('/reports') ? "secondary" : "ghost"} 
                className="group flex items-center gap-2"
              >
                <FileBarChart size={18} /> 
                <span>Reports</span>
              </Button>
            </Link>
            
            <Link to="/create-transaction">
              <Button className="ml-2 group flex items-center gap-2">
                <PlusCircle size={18} /> 
                <span>New Transaction</span>
              </Button>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="animate-fade-in md:hidden">
          <nav className="flex flex-col space-y-3 p-4 pb-6 bg-background glass">
            <Link 
              to="/" 
              className={`px-4 py-2 ${isActive('/') ? 'bg-secondary' : ''} rounded-md flex items-center gap-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={18} /> 
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/reports" 
              className={`px-4 py-2 ${isActive('/reports') ? 'bg-secondary' : ''} rounded-md flex items-center gap-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FileBarChart size={18} /> 
              <span>Reports</span>
            </Link>
            
            <Link 
              to="/create-transaction" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <PlusCircle size={18} /> 
              <span>New Transaction</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
