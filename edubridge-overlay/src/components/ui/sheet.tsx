import React, { useState } from 'react';

interface SheetProps {
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ children }) => {
  return <>{children}</>;
};

export const SheetTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
  return <>{children}</>;
};

export const SheetContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`fixed inset-y-0 right-0 z-50 h-full w-3/4 overflow-y-auto bg-background p-6 shadow-lg sm:max-w-sm ${className}`}>
    {children}
  </div>
);

export const SheetHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col space-y-2 text-center sm:text-left">
    {children}
  </div>
);

export const SheetTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold text-foreground">
    {children}
  </h2>
);

export const SheetDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-muted-foreground">
    {children}
  </p>
);
