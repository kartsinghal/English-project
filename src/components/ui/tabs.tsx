// src/components/ui/tabs.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextType = {
  activeTab?: string;
  setActiveTab: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className, ...props }) => {
  const [activeTab, setActiveTab] = React.useState<string | undefined>(defaultValue);

  // If defaultValue changes, update active tab
  React.useEffect(() => {
    if (defaultValue !== undefined) setActiveTab(defaultValue);
  }, [defaultValue]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};
Tabs.displayName = "Tabs";

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div role="tablist" className={cn("flex w-full gap-2 rounded-lg bg-gray-100 p-1", className)} {...props}>
      {children}
    </div>
  );
};
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className, ...props }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used inside a Tabs component");

  const isActive = ctx.activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
        isActive ? "bg-white text-purple-600 shadow" : "hover:bg-gray-200 text-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className, ...props }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used inside a Tabs component");
  if (ctx.activeTab !== value) return null;

  return (
    <div role="tabpanel" className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
};
TabsContent.displayName = "TabsContent";
