
import React from 'react';
import Header from '@/components/Header';
import TransactionForm from '@/components/TransactionForm';

const CreateTransaction = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <TransactionForm />
      </main>
    </div>
  );
};

export default CreateTransaction;
