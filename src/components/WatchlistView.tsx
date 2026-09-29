import React, { useState } from "react";
import { HoldingItem, StockItem } from "../data/mockStocks";

interface WatchlistViewProps {
  totalAssetValue: number;
  stocks: StockItem[];
  holdings: HoldingItem[];
  watchlistGroups: string[];
  onAddWatchlistGroup: (groupName: string) => void;
  onSelectStock: (stockId: string) => void;
  onToggleFavorite: (stockId: string) => void;
  onOpenPortfolioDetail: () => void;
}

type SortBy = "change" | "price" | "volume";

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  totalAssetValue,
  stocks,
  holdings,
  watchlistGroups,
  onAddWatchlistGroup,
  onSelectStock,
  onToggleFavorite,
  onOpenPortfolioDetail,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("기본 그룹");
  const [sortBy, setSortBy] = useState<SortBy>("change");
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAlertConfigModal, setShowAlertConfigModal] = useState(false);
  const [globalAlertOn, setGlobalAlertOn] = useState(true);

  const holdingsMap = React.useMemo(() => {
    const map = new Map<string, HoldingItem>();
    holdings.forEach((h) => map.set(h.stockId, h));
    return map;
  }, [holdings]);

  // Default 4 stocks shown in Watchlist screenshot: SK하이닉스, 삼성전자, 현대차, 에코프로비엠 + any newly favorited
  const groupStocks = React.useMemo(() => {
    let list: StockItem[];
    if (selectedGroup === "기본 그룹") {
      const baseIds = ["000660", "005930", "005380", "247540"];
      const baseItems = baseIds
        .map((id) => stocks.find((s) => s.id === id))
        .filter((s): s is StockItem => Boolean(s));
      const extraFavs = stocks.filter(
        (s) => s.isFavorite && !baseIds.includes(s.id)
      );
      list = [...baseItems, ...extraFavs];
    } else {
      list = stocks.filter(
        (s) => s.watchlistGroups.includes(selectedGroup) || s.isFavorite
      );
    }

    return [...list].sort((a, b) => {
      let diff = 0;
      if (sortBy === "change") {
        diff = b.changePercent - a.changePercent;
      } else if (sortBy === "price") {
        diff = b.price - a.price;
      } else {
        diff = b.volume - a.volume;
      }
      return sortDesc ? diff : -diff;
    });
  }, [stocks, selectedGroup, sortBy, sortDesc]);

  const getGroupCount = (group: string) => {
    if (group === "기본 그룹") return Math.max(6, groupStocks.length);
    if (group === "AI & 반도체") return 4;
    if (group === "배당성장주") return 3;
    return stocks.filter((s) => s.watchlistGroups.includes(group)).length || 2;
  };

  const handleSortClick = (nextSort: SortBy) => {
    if (sortBy === nextSort) {
      setSortDesc((prev) => !prev);
    } else {
      setSortBy(nextSort);
      setSortDesc(true);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onAddWatchlistGroup(newGroupName.trim());
    setSelectedGroup(newGroupName.trim());
    setNewGroupName("");
    setShowAddGroupModal(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Group Selector Bar */}
      <div className="w-full overflow-x-auto no-scrollbar px-gutter py-space-sm flex items-center gap-space-xs bg-surface-container-lowest">
        {watchlistGroups.map((group) => {
          const isSelected = selectedGroup === group;
          return (
            <button
              key={group}
              type="button"
              onClick={() => setSelectedGroup(group)}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shrink-0 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "bg-secondary-container text-on-secondary-fixed shadow-sm font-semibold"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span>{group}</span>
              <span className="opacity-70 font-numeral-md text-[11px] tabular-nums">
                {getGroupCount(group)}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowAddGroupModal(true)}
          className="px-space-sm py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-md text-label-md shrink-0 flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>그룹 추가</span>
        </button>
      </div>

      {/* Main Content Body */}
      <div className="px-gutter py-space-md flex flex-col gap-space-lg">
        {/* Warm Tactile Portfolio Snapshot Card */}
        <div className="w-full bg-secondary-container rounded-xl p-space-lg shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary-fixed opacity-40 blur-xl pointer-events-none" />
          <div className="flex justify-between items-start mb-space-sm relative z-10">
            <div className="flex items-center gap-1 text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined text-[18px]">
                account_balance_wallet
              </span>
              <span className="font-label-sm text-label-sm tracking-wider">
                내 보유 자산 요약
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenPortfolioDetail}
              className="flex items-center text-on-secondary-fixed-variant hover:text-on-secondary-fixed text-label-sm font-label-sm cursor-pointer whitespace-nowrap"
            >
              <span>상세보기</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="relative z-10 flex flex-col mb-space-md">
            <span className="font-body-sm text-body-sm text-on-secondary-container">
              총 평가금액
            </span>
            <div className="flex items-baseline gap-space-xs tabular-nums">
              <span className="font-numeral-lg text-numeral-lg font-bold text-on-secondary-fixed">
                {totalAssetValue.toLocaleString()}
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-secondary-fixed">
                원
              </span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-space-sm pt-space-sm bg-surface-container-lowest/70 backdrop-blur-sm rounded-lg p-space-md">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                누적 수익률
              </span>
              <div className="flex items-center gap-1 mt-0.5 tabular-nums">
                <span className="font-numeral-md text-numeral-md text-on-tertiary-container font-bold">
                  +18.4%
                </span>
                <span className="font-label-sm text-label-sm text-on-tertiary-container">
                  (+542만)
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                실시간 예상 배당금
              </span>
              <div className="flex items-center gap-1 mt-0.5 tabular-nums">
                <span className="font-numeral-md text-numeral-md text-on-surface font-semibold">
                  연 840,000원
                </span>
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  savings
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Header & Quick Sort Controls */}
        <div className="flex items-center justify-between pt-space-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              관심 목록
            </span>
            <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              실시간 체결
            </span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-space-xs text-label-sm font-label-sm text-on-surface-variant">
            <button
              type="button"
              onClick={() => handleSortClick("change")}
              className={`flex items-center cursor-pointer whitespace-nowrap ${
                sortBy === "change" ? "text-on-surface font-semibold" : "hover:text-on-surface"
              }`}
            >
              등락률순
              {sortBy === "change" && (
                <span className="material-symbols-outlined text-[14px]">
                  {sortDesc ? "expand_more" : "expand_less"}
                </span>
              )}
            </button>
            <span className="text-outline-variant">|</span>
            <button
              type="button"
              onClick={() => handleSortClick("price")}
              className={`flex items-center cursor-pointer whitespace-nowrap ${
                sortBy === "price" ? "text-on-surface font-semibold" : "hover:text-on-surface"
              }`}
            >
              현재가순
            </button>
            <span className="text-outline-variant">|</span>
            <button
              type="button"
              onClick={() => handleSortClick("volume")}
              className={`flex items-center cursor-pointer whitespace-nowrap ${
                sortBy === "volume" ? "text-on-surface font-semibold" : "hover:text-on-surface"
              }`}
            >
              거래량순
            </button>
          </div>
        </div>

        {/* Watchlist Rows List */}
        <div className="w-full flex flex-col gap-space-xs">
          {groupStocks.map((stock, idx) => {
            const holding = holdingsMap.get(stock.id);
            const isUp = stock.changePercent >= 0;
            const holdingProfitPct = holding
              ? ((stock.price - holding.avgBuyPrice) / holding.avgBuyPrice) * 100
              : null;
            const gradientId = `sparkGrad-${stock.id}-${idx}`;

            return (
              <div
                key={stock.id}
                onClick={() => onSelectStock(stock.id)}
                className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between hover:bg-surface-container-low active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex flex-col min-w-0 pr-space-sm flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                      {stock.name}
                    </span>
                    {holding && holding.quantity > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-label-sm bg-secondary-container text-on-secondary-fixed whitespace-nowrap">
                        보유 {holding.quantity}주
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm mt-0.5 tabular-nums">
                    <span>{stock.code}</span>
                    {holdingProfitPct !== null && (
                      <span
                        className={`text-[10px] font-semibold ${
                          holdingProfitPct >= 0
                            ? "text-on-tertiary-container"
                            : "text-surface-tint"
                        }`}
                      >
                        내 수익 {holdingProfitPct >= 0 ? "+" : ""}
                        {holdingProfitPct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini Sparkline inline SVG */}
                <div className="w-16 h-8 shrink-0 flex items-center justify-center mr-space-sm">
                  <svg
                    className="w-full h-full overflow-visible"
                    fill="none"
                    viewBox="0 0 60 24"
                  >
                    <path
                      d={stock.sparklinePath}
                      stroke={isUp ? "#f04438" : "#2563eb"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d={stock.sparklineArea}
                      fill={`url(#${gradientId})`}
                      opacity={isUp ? "0.15" : "0.12"}
                    />
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id={gradientId}
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="24"
                      >
                        <stop stopColor={isUp ? "#f04438" : "#2563eb"} />
                        <stop
                          offset="1"
                          stopColor={isUp ? "#f04438" : "#2563eb"}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Price and Delta */}
                <div className="flex flex-col items-end shrink-0 min-w-[76px] tabular-nums">
                  <span className="font-numeral-md text-numeral-md text-on-surface font-bold">
                    {stock.price.toLocaleString()}원
                  </span>
                  <div
                    className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold mt-0.5 ${
                      isUp
                        ? "bg-error-container text-on-tertiary-container"
                        : "bg-surface-container-low text-[#2563eb]"
                    }`}
                  >
                    <span>{isUp ? "▲" : "▼"}</span>
                    <span>{Math.abs(stock.changePercent).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Stock Action Prompt */}
        <button
          type="button"
          onClick={() => setShowAddStockModal(true)}
          className="w-full py-space-md px-space-lg rounded-xl bg-surface-container-lowest hover:bg-secondary-container/40 transition-all flex items-center justify-center gap-space-xs text-on-surface-variant hover:text-on-surface shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary">
            add_circle
          </span>
          <span className="font-label-lg text-label-lg">
            새로운 관심 종목 추가하기
          </span>
        </button>

        {/* Warm Editorial Footer Note */}
        <div className="w-full rounded-xl bg-surface-container-low p-space-md flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-secondary-fixed text-[18px]">
                query_stats
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                {globalAlertOn
                  ? "종목 체결 알림이 켜져있어요"
                  : "종목 체결 알림이 일시 중지됨"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                목표가 도달 시 즉시 푸시를 드립니다
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAlertConfigModal(true)}
            className="font-label-sm text-label-sm text-on-primary-fixed bg-surface-container-lowest px-2.5 py-1.5 rounded-full shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer whitespace-nowrap"
          >
            설정
          </button>
        </div>
      </div>

      {/* Modal: Add Group */}
      {showAddGroupModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowAddGroupModal(false)}
        >
          <form
            onSubmit={handleCreateGroup}
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              새 관심 그룹 추가
            </h3>
            <input
              type="text"
              placeholder="그룹 이름 입력 (예: 미국 빅테크, 반도체 소부장)"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddGroupModal(false)}
                className="flex-1 h-12 rounded-full bg-surface-container-low text-on-surface font-label-lg text-label-lg cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold cursor-pointer"
              >
                추가하기
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Stock to Watchlist */}
      {showAddStockModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowAddStockModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4 max-h-[75vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between shrink-0">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                관심 종목 관리
              </h3>
              <button
                type="button"
                onClick={() => setShowAddStockModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="overflow-y-auto space-y-2 pr-1">
              {stocks.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between"
                >
                  <div>
                    <div className="font-label-lg text-label-lg font-bold text-on-surface">
                      {s.name}{" "}
                      <span className="font-label-sm text-label-sm text-outline">
                        {s.code}
                      </span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">
                      {s.price.toLocaleString()}원 ({s.changePercent >= 0 ? "+" : ""}
                      {s.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(s.id)}
                    className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm font-bold transition-colors cursor-pointer ${
                      s.isFavorite
                        ? "bg-secondary-container text-on-secondary-fixed"
                        : "bg-surface-container-lowest text-on-surface"
                    }`}
                  >
                    {s.isFavorite ? "관심 등록됨" : "+ 관심 추가"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Alert Settings */}
      {showAlertConfigModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowAlertConfigModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              실시간 시세 및 체결 알림 설정
            </h3>
            <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div>
                <div className="font-label-lg text-label-lg font-bold text-on-surface">
                  목표가 및 주문 체결 푸시 알림
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  관심 종목 급등락(±5%) 및 지정가 체결 시 알림
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGlobalAlertOn((prev) => !prev)}
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  globalAlertOn ? "bg-on-tertiary-container" : "bg-outline-variant"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    globalAlertOn ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowAlertConfigModal(false)}
              className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold cursor-pointer"
            >
              저장 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
