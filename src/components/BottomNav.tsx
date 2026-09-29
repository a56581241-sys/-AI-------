import React from "react";
import { ActiveTab } from "./Header";

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingOrdersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingOrdersCount = 0,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: "home", label: "홈", icon: "trending_up" },
    { id: "discovery", label: "탐색", icon: "travel_explore" },
    { id: "watchlist", label: "관심", icon: "bookmark_border" },
    { id: "orders", label: "주문/내역", icon: "pie_chart" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface/92 backdrop-blur-xl shadow-[0_-4px_20px_rgba(17,24,39,0.04)] border-t border-surface-container-high/60">
      <div className="max-w-md mx-auto w-full">
        <div className="flex justify-around items-center h-16 px-gutter">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-1 transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary font-label-md font-bold"
                    : "text-on-surface-variant hover:text-on-surface font-label-md"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={
                    isActive && item.id === "watchlist"
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                <span className="text-label-md whitespace-nowrap">{item.label}</span>
                {item.id === "orders" && pendingOrdersCount > 0 && (
                  <span className="absolute top-1 right-2.5 w-4 h-4 rounded-full bg-on-tertiary-container text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="w-full flex justify-center pb-2 pt-0.5 pointer-events-none">
          <div className="w-32 h-1 bg-on-surface/20 rounded-full" />
        </div>
      </div>
    </nav>
  );
};
