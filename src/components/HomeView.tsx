import React, { useState } from "react";
import {
  InsightItem,
  MarketIndex,
  StockItem,
} from "../data/mockStocks";

interface HomeViewProps {
  totalAssetValue: number;
  dailyGainAmount: number;
  dailyGainPercent: number;
  indices: MarketIndex[];
  stocks: StockItem[];
  insights: InsightItem[];
  onSelectStock: (stockId: string) => void;
  onOpenDepositModal: () => void;
  onOpenTransferModal: () => void;
  onToggleInsightBookmark: (insightId: string) => void;
  onNavigateToTheme: (themeName: string) => void;
}

const HOT_THEMES = ["온디바이스AI", "2차전지", "휴머노이드 로봇", "차세대 SMR"];

export const HomeView: React.FC<HomeViewProps> = ({
  totalAssetValue,
  dailyGainAmount,
  dailyGainPercent,
  indices,
  stocks,
  insights,
  onSelectStock,
  onOpenDepositModal,
  onOpenTransferModal,
  onToggleInsightBookmark,
  onNavigateToTheme,
}) => {
  const [hideBalance, setHideBalance] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("온디바이스AI");
  const [selectedIndexModal, setSelectedIndexModal] = useState<MarketIndex | null>(null);
  const [showAllIndicesModal, setShowAllIndicesModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<InsightItem | null>(null);
  const [insightFilterBookmarkOnly, setInsightFilterBookmarkOnly] = useState(false);

  // Filter top movers by selected theme or default top 3 (알테오젠, SK하이닉스, 삼성전자)
  const themeFilteredStocks = React.useMemo(() => {
    if (selectedTheme === "온디바이스AI") {
      const ids = ["196170", "000660", "005930"];
      return ids
        .map((id) => stocks.find((s) => s.id === id))
        .filter((s): s is StockItem => Boolean(s));
    }
    const matches = stocks.filter((s) => s.themes.includes(selectedTheme));
    return matches.length > 0 ? matches.slice(0, 3) : stocks.slice(0, 3);
  }, [stocks, selectedTheme]);

  const visibleInsights = insightFilterBookmarkOnly
    ? insights.filter((item) => item.bookmarked)
    : insights;

  return (
    <div className="flex flex-col w-full">
      {/* Asset Summary Highlight Card */}
      <section className="px-gutter pt-space-md">
        <div className="bg-secondary-container text-on-secondary-fixed rounded-2xl p-space-lg shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-surface-container-lowest/40 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-label-md text-on-secondary-fixed-variant">
                내 투자 자산
              </span>
              <button
                type="button"
                aria-label={hideBalance ? "자산 금액 보이기" : "자산 금액 숨기기"}
                onClick={() => setHideBalance((prev) => !prev)}
                className="p-1 -m-1 flex items-center justify-center text-on-secondary-fixed-variant hover:text-on-secondary-fixed cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {hideBalance ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-lowest/70 text-on-surface font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
              실시간 장중
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between relative z-10">
            <div>
              <div className="font-display-lg text-display-lg font-bold tracking-tight text-on-secondary-fixed tabular-nums">
                {hideBalance ? "₩ ••••••••" : `₩${totalAssetValue.toLocaleString()}`}
              </div>
              <div className="flex items-center gap-1.5 mt-1 font-label-lg text-label-lg text-on-tertiary-container font-semibold tabular-nums">
                <span
                  className="material-symbols-outlined text-[18px] leading-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trending_up
                </span>
                <span>
                  {hideBalance ? "+₩••••••" : `+₩${dailyGainAmount.toLocaleString()}`}
                </span>
                <span className="text-on-tertiary-container font-medium">
                  (+{dailyGainPercent.toFixed(2)}%) 오늘
                </span>
              </div>
            </div>

            {/* Mini Sparkline for Total PnL */}
            <div className="flex flex-col items-end">
              <svg
                className="overflow-visible"
                fill="none"
                height="34"
                viewBox="0 0 76 34"
                width="76"
              >
                <path
                  d="M2 28 C 16 26, 22 18, 36 20 C 50 22, 58 8, 74 4"
                  stroke="#f04438"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <circle cx="74" cy="4" fill="#f04438" r="3.5" />
              </svg>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-4 pt-3.5 flex items-center gap-2.5 relative z-10">
            <button
              type="button"
              onClick={onOpenDepositModal}
              className="flex-1 py-2.5 px-3 rounded-full bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-semibold shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                add_card
              </span>
              간편 충전
            </button>
            <button
              type="button"
              onClick={onOpenTransferModal}
              className="flex-1 py-2.5 px-3 rounded-full bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-semibold shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                send_money
              </span>
              계좌 이체
            </button>
          </div>
        </div>
      </section>

      {/* Market Indices Section (Horizontal Scrollable) */}
      <section className="mt-space-lg">
        <div className="px-gutter flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              실시간 주요 지수
            </h2>
            <span className="text-on-surface-variant font-label-sm text-label-sm">
              15:30 기준
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAllIndicesModal(true)}
            className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center cursor-pointer whitespace-nowrap"
          >
            더보기
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Scroll track */}
        <div className="flex gap-space-sm overflow-x-auto px-gutter no-scrollbar pb-1">
          {indices.map((idx) => (
            <button
              key={idx.id}
              type="button"
              onClick={() => setSelectedIndexModal(idx)}
              className="flex-shrink-0 w-44 p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between text-left hover:bg-surface-container-low/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between w-full">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {idx.name}
                  </span>
                  <div className="font-numeral-md text-numeral-md font-bold text-on-surface mt-0.5 tabular-nums">
                    {idx.value}
                  </div>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold flex items-center whitespace-nowrap ${
                    idx.isUp
                      ? "bg-error-container text-on-tertiary-container"
                      : "bg-surface-container-low text-[#2563eb]"
                  }`}
                >
                  {idx.isUp ? "▲" : "▼"} {idx.changePercent}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between w-full">
                <svg fill="none" height="20" viewBox="0 0 68 20" width="68">
                  <path
                    d={idx.svgPath}
                    stroke={idx.isUp ? "#f04438" : "#2563eb"}
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">
                  {idx.changePoints}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Realtime Trending Themes & Top Movers */}
      <section className="mt-space-lg px-gutter">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              실시간 급상승 종목
            </h2>
            <span className="w-2 h-2 rounded-full bg-on-tertiary-container" />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            거래대금순
          </span>
        </div>

        {/* Hot Themes Chip Feed */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-3">
          {HOT_THEMES.map((theme) => {
            const isSelected = selectedTheme === theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-secondary-container text-on-secondary-fixed font-semibold shadow-sm"
                    : "bg-surface-container-low text-on-surface font-medium hover:bg-secondary-container/60"
                }`}
              >
                <span
                  className={
                    isSelected ? "text-on-secondary-container" : "text-on-surface-variant"
                  }
                >
                  #
                </span>{" "}
                {theme}
              </button>
            );
          })}
        </div>

        {/* Stock List Card Stack */}
        <div className="bg-surface-container-lowest rounded-2xl p-2 shadow-sm space-y-1">
          {themeFilteredStocks.map((stock, idx) => {
            const isUp = stock.changePercent >= 0;
            return (
              <div
                key={stock.id}
                onClick={() => onSelectStock(stock.id)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low/60 active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      idx === 0
                        ? "bg-secondary-container/80 text-on-secondary-fixed"
                        : "bg-surface-container-high text-on-surface"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                        {stock.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
                        {stock.code}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                      {stock.summaryLine}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 ml-2 tabular-nums">
                  <span className="font-numeral-md text-numeral-md font-bold text-on-surface">
                    {stock.price.toLocaleString()}원
                  </span>
                  <span
                    className={`font-label-sm text-label-sm font-semibold flex items-center ${
                      isUp ? "text-on-tertiary-container" : "text-[#2563eb]"
                    }`}
                  >
                    {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Market Insights & Curated News Section */}
      <section className="mt-space-lg px-gutter mb-space-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            실시간 마켓 인사이트
          </h2>
          <button
            type="button"
            aria-label="북마크 필터 토글"
            onClick={() => setInsightFilterBookmarkOnly((prev) => !prev)}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer ${
              insightFilterBookmarkOnly
                ? "bg-secondary-container text-on-secondary-fixed font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            {insightFilterBookmarkOnly ? "북마크만" : ""}
          </button>
        </div>

        <div className="space-y-3">
          {visibleInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={() => setSelectedInsight(insight)}
                  className="space-y-1.5 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold whitespace-nowrap">
                      {insight.badge}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {insight.timeAndSource}
                    </span>
                  </div>
                  <h3 className="font-label-lg text-label-lg font-bold text-on-surface leading-snug line-clamp-2">
                    {insight.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {insight.summary}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="북마크 저장"
                  onClick={() => onToggleInsightBookmark(insight.id)}
                  className={`p-1.5 rounded-full flex-shrink-0 transition-colors cursor-pointer ${
                    insight.bookmarked
                      ? "bg-secondary-container text-on-secondary-fixed"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={
                      insight.bookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined
                    }
                  >
                    bookmark
                  </span>
                </button>
              </div>

              {/* Attached Stock Quick Bar */}
              <button
                type="button"
                onClick={() => onNavigateToTheme(insight.relatedThemeFilter)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high/70 transition-colors flex items-center justify-between cursor-pointer text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[18px] shrink-0">
                    bolt
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface whitespace-nowrap">
                    {insight.relatedThemeTitle}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {insight.relatedStocksText}
                  </span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">
                  arrow_forward
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Subtle Micro Footer */}
      <div className="px-gutter pb-6 pt-2 flex flex-col items-center justify-center text-center gap-1 opacity-75">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[16px] text-secondary">
            verified_user
          </span>
          스톡나우 금융보안원 검증 시스템 가동 중
        </div>
        <span className="text-[11px] text-on-surface-variant/80">
          투자판단의 최종 책임은 본인에게 있으며 자산 가치는 변동될 수 있습니다.
        </span>
      </div>

      {/* Modal: Index Detail */}
      {selectedIndexModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setSelectedIndexModal(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  주요 지수 브리핑
                </span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  {selectedIndexModal.name}
                </h3>
              </div>
              <div className="text-right tabular-nums">
                <div className="font-headline-md text-headline-md font-bold text-on-surface">
                  {selectedIndexModal.value}
                </div>
                <span
                  className={`font-label-sm text-label-sm font-semibold ${
                    selectedIndexModal.isUp
                      ? "text-on-tertiary-container"
                      : "text-[#2563eb]"
                  }`}
                >
                  {selectedIndexModal.isUp ? "▲" : "▼"}{" "}
                  {selectedIndexModal.changePercent} ({selectedIndexModal.changePoints})
                </span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant bg-surface-container-low p-3.5 rounded-xl">
              {selectedIndexModal.description}
            </p>
            <button
              type="button"
              onClick={() => setSelectedIndexModal(null)}
              className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Modal: All Indices */}
      {showAllIndicesModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowAllIndicesModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                글로벌 및 국내 주요 지수
              </h3>
              <button
                type="button"
                onClick={() => setShowAllIndicesModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-2">
              {indices.map((idx) => (
                <div
                  key={idx.id}
                  className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between"
                >
                  <div>
                    <div className="font-label-lg text-label-lg font-bold text-on-surface">
                      {idx.name}
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      {idx.description}
                    </div>
                  </div>
                  <div className="text-right tabular-nums ml-3 shrink-0">
                    <div className="font-numeral-md text-numeral-md font-bold text-on-surface">
                      {idx.value}
                    </div>
                    <div
                      className={`font-label-sm text-label-sm font-semibold ${
                        idx.isUp ? "text-on-tertiary-container" : "text-[#2563eb]"
                      }`}
                    >
                      {idx.isUp ? "▲" : "▼"} {idx.changePercent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Insight Detail */}
      {selectedInsight && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setSelectedInsight(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                {selectedInsight.badge}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {selectedInsight.timeAndSource}
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug">
              {selectedInsight.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-xl">
              {selectedInsight.fullContent}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const theme = selectedInsight.relatedThemeFilter;
                  setSelectedInsight(null);
                  onNavigateToTheme(theme);
                }}
                className="flex-1 h-12 rounded-full bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold cursor-pointer"
              >
                관련 테마주 보기
              </button>
              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                className="flex-1 h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
