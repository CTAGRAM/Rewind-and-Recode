import React from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <>{children}</>;
};

export const DropdownMenuTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
  return <>{children}</>;
};

export const DropdownMenuContent: React.FC<{ children: React.ReactNode; align?: string; className?: string }> = ({ children, className = '' }) => (
  <div className={`z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}>
    {children}
  </div>
);

export const DropdownMenuLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-2 py-1.5 text-sm font-semibold">
    {children}
  </div>
);

export const DropdownMenuSeparator: React.FC = () => (
  <div className="-mx-1 my-1 h-px bg-muted" />
);

export const DropdownMenuItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
  >
    {children}
  </button>
);
