import React, { useState } from 'react';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ children, value, onValueChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { value, onValueChange }) : child
      )}
    </div>
  );
};

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <button className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
    {children}
  </button>
);

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <span className="text-muted-foreground">{placeholder}</span>
);

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
    <div className="p-1">
      {children}
    </div>
  </div>
);

export const SelectItem: React.FC<{ children: React.ReactNode; value: string }> = ({ children, value }) => (
  <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
    {children}
  </div>
);
