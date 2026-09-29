import React, { useState } from "react";
import { SEARCH_RANKING_ITEMS, StockItem } from "../data/mockStocks";

interface DiscoveryViewProps {
  stocks: StockItem[];
  onSelectStock: (stockId: string) => void;
  onToggleFavorite: (stockId: string) => void;
  initialCategory?: string;
}

const FILTER_CATEGORIES = [
  "전체",
  "인기 검색",
  "급상승 🔥",
  "거래대금 TOP",
  "고배당주",
  "52주 신고가",
];

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  stocks,
  onSelectStock,
  onToggleFavorite,
  initialCategory = "전체",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showAllStocks, setShowAllStocks] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [bannerDetailOpen, setBannerDetailOpen] = useState(false);

  const filteredStocks = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return stocks.filter((stock) => {
      const matchesSearch =
        !q ||
        stock.name.toLowerCase().includes(q) ||
        stock.code.toLowerCase().includes(q) ||
        stock.themes.some((t) => t.toLowerCase().includes(q)) ||
        stock.sector.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "전체" ||
        stock.discoveryCategories.includes(selectedCategory);

      return matchesSearch && matchesCat;
    });
  }, [stocks, searchQuery, selectedCategory]);

  // Default 4 stocks shown in screenshot: 삼성전자, SK하이닉스, 카카오, 셀트리온
  const displayedStocks = React.useMemo(() => {
    if (searchQuery.trim().length > 0 || selectedCategory !== "전체" || showAllStocks) {
      return filteredStocks;
    }
    const defaultIds = ["005930", "000660", "035720", "068270"];
    return defaultIds
      .map((id) => stocks.find((s) => s.id === id))
      .filter((s): s is StockItem => Boolean(s));
  }, [filteredStocks, searchQuery, selectedCategory, showAllStocks, stocks]);

  const handleVoiceSearch = () => {
    setVoiceActive(true);
    setTimeout(() => {
      setSearchQuery("삼성전자");
      setVoiceActive(false);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Search Header & Bar Section */}
      <div className="px-gutter pt-space-md pb-space-sm flex flex-col gap-space-md">
        <div className="relative w-full flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="w-full h-12 pl-10 pr-20 bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md rounded-xl outline-none transition-all focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 focus:shadow-sm"
            id="stockSearchInput"
            placeholder="종목명, 코드(005930), 테마 검색..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-2.5 flex items-center gap-1">
            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={() => setSearchQuery("")}
                className="w-7 h-7 flex items-center justify-center text-outline hover:text-on-surface rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
            <button
              type="button"
              aria-label="음성 검색"
              onClick={handleVoiceSearch}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                voiceActive
                  ? "bg-on-tertiary-container text-white animate-pulse"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>
        </div>

        {/* Quick Insights Spark Banner */}
        <button
          type="button"
          onClick={() => setBannerDetailOpen(true)}
          className="w-full bg-secondary-container rounded-xl p-space-md flex items-center justify-between shadow-sm text-left hover:brightness-[0.98] active:scale-[0.99] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm shrink-0">
              <span
                className="material-symbols-outlined text-secondary text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                insights
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-secondary-fixed font-bold truncate">
                반도체 섹터에 수급 집중 중
              </span>
              <span className="font-body-sm text-body-sm text-on-secondary-fixed-variant truncate">
                외국인 기관 동반 순매수 3거래일 지속
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-secondary-fixed-variant text-[20px] shrink-0">
            arrow_forward_ios
          </span>
        </button>
      </div>

      {/* Horizontal Filter Chips */}
      <div className="w-full overflow-x-auto no-scrollbar px-gutter py-space-xs">
        <div className="flex items-center gap-2 shrink-0">
          {FILTER_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-secondary-container text-on-secondary-fixed font-bold shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[14px]">done</span>
                )}
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Realtime Trending Keywords Bento Grid */}
      <section className="mt-space-lg px-gutter flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              실시간 검색 랭킹
            </span>
            <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
          </div>
          <span className="font-label-sm text-label-sm text-outline">14:32 기준</span>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-space-sm rounded-xl">
          {SEARCH_RANKING_ITEMS.map((item) => (
            <button
              key={item.rank}
              type="button"
              onClick={() => onSelectStock(item.stockId)}
              className="flex items-center justify-between bg-surface-container-lowest p-2.5 rounded-lg shadow-sm hover:bg-secondary-container/30 active:scale-[0.98] transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-5 h-5 rounded-full font-label-sm text-label-sm font-bold flex items-center justify-center shrink-0 ${
                    item.rank <= 3
                      ? "bg-secondary-container text-on-secondary-fixed"
                      : "bg-surface-container text-on-surface"
                  }`}
                >
                  {item.rank}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                    {item.name}
                  </span>
                  <span className="font-body-sm text-body-sm text-outline truncate">
                    {item.code}
                  </span>
                </div>
              </div>
              <span
                className={`font-label-sm text-label-sm font-bold shrink-0 ${
                  item.isUp ? "text-on-tertiary-container" : "text-secondary"
                }`}
              >
                {item.isUp ? "▲" : "▼"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Curated Market Opportunity Banner */}
      <section className="mt-space-lg px-gutter">
        <button
          type="button"
          onClick={() => setSelectedCategory("거래대금 TOP")}
          className="w-full relative overflow-hidden rounded-xl bg-surface-container-low p-space-md flex items-center justify-between shadow-sm text-left hover:bg-surface-container transition-colors cursor-pointer"
        >
          <div className="flex flex-col gap-1 z-10">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-fixed font-bold">
                인사이트 PICK
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                AI 알고리즘 분석
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              기관 수급 급증 TOP 5
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              오늘 장 마감 전 주목할 핵심 모멘텀
            </span>
          </div>
          <div className="w-14 h-14 rounded-full bg-secondary-container/60 flex items-center justify-center shrink-0 z-10">
            <span
              className="material-symbols-outlined text-secondary text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-secondary-container opacity-50 blur-xl pointer-events-none" />
        </button>
      </section>

      {/* Top Trading Volume & Potential Stocks Section */}
      <section className="mt-space-lg px-gutter flex flex-col gap-space-sm pb-space-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              거래대금 상위 &amp; 유망 종목
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              시장 에너지가 가장 강하게 집중된 핵심주
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAllStocks((prev) => !prev)}
            className="font-label-md text-label-md text-outline hover:text-on-surface flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
          >
            {showAllStocks ? "접기" : "전체보기"}
            <span className="material-symbols-outlined text-[16px]">
              {showAllStocks ? "expand_less" : "chevron_right"}
            </span>
          </button>
        </div>

        {/* Stock Cards Stack */}
        {displayedStocks.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center text-on-surface-variant">
            검색 조건에 맞는 종목이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 mt-1">
            {displayedStocks.map((stock) => {
              const isUp = stock.changePercent >= 0;
              return (
                <div
                  key={stock.id}
                  onClick={() => onSelectStock(stock.id)}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-headline-sm text-headline-sm text-on-surface font-bold shrink-0">
                      {stock.shortLabel}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                          {stock.name}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">
                          {stock.code}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {stock.tradingValueText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-md shrink-0">
                    <div className="flex flex-col items-end tabular-nums">
                      <span className="font-numeral-md text-numeral-md text-on-surface font-bold">
                        {stock.price.toLocaleString()}원
                      </span>
                      <div
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
                          isUp
                            ? "bg-error-container text-on-tertiary-container"
                            : "bg-surface-container text-secondary"
                        }`}
                      >
                        <span className="font-label-sm text-label-sm font-bold">
                          {isUp ? "▲" : "▼"} {Math.abs(stock.changePercent).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="관심 종목 추가"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(stock.id);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        stock.isFavorite
                          ? "bg-secondary-container text-on-secondary-fixed"
                          : "bg-surface-container-low hover:bg-secondary-container text-on-surface"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={
                          stock.isFavorite
                            ? { fontVariationSettings: "'FILL' 1" }
                            : undefined
                        }
                      >
                        {stock.isFavorite ? "bookmark" : "bookmark_add"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Banner Detail Modal */}
      {bannerDetailOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setBannerDetailOpen(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                수급 포착
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                실시간 외국인·기관 수급 트래커
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              반도체 섹터 3거래일 연속 동반 순매수 유입
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-xl">
              삼성전자(+3,420억), SK하이닉스(+2,890억), 한미반도체(+940억)를 중심으로 외국인 및 연기금의 강한 순매수가 유입되고 있습니다.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setBannerDetailOpen(false);
                  onSelectStock("005930");
                }}
                className="flex-1 h-12 rounded-full bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold cursor-pointer"
              >
                삼성전자 상세보기
              </button>
              <button
                type="button"
                onClick={() => setBannerDetailOpen(false)}
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
