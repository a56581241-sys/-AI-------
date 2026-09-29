import React, { useEffect, useState } from "react";
import { ChartPeriod, HoldingItem, StockItem } from "../data/mockStocks";

interface StockDetailViewProps {
  stock: StockItem;
  availableCash: number;
  holding?: HoldingItem;
  onToggleFavorite: (stockId: string) => void;
  onToggleAlert: (stockId: string) => void;
  onSubmitOrder: (params: {
    stockId: string;
    type: "buy" | "sell";
    orderType: "지정가" | "시장가";
    price: number;
    quantity: number;
  }) => void;
}

const CHART_PERIODS: ChartPeriod[] = ["1일", "1주", "1개월", "3개월", "1년", "전체"];

export const StockDetailView: React.FC<StockDetailViewProps> = ({
  stock,
  availableCash,
  holding,
  onToggleFavorite,
  onToggleAlert,
  onSubmitOrder,
}) => {
  const [period, setPeriod] = useState<ChartPeriod>("1개월");
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"지정가" | "시장가">("지정가");
  const [orderPrice, setOrderPrice] = useState<number>(stock.price);
  const [qty, setQty] = useState<number>(10);

  useEffect(() => {
    setOrderPrice(stock.price);
    setQty(10);
  }, [stock.id, stock.price]);

  const activeChart = stock.charts[period] || stock.charts["1개월"];
  const isUp = stock.changePercent >= 0;

  const maxBuyQty = Math.max(1, Math.floor(availableCash / Math.max(1, orderPrice)));
  const maxSellQty = holding?.quantity ?? 0;
  const maxQty = orderSide === "buy" ? maxBuyQty : Math.max(1, maxSellQty);

  const totalOrderAmount = orderPrice * qty;

  const handleChipClick = (chipVal: number | "max") => {
    if (chipVal === "max") {
      setQty(maxQty);
    } else {
      setQty((prev) => Math.min(9999, prev + chipVal));
    }
  };

  const handleOrderExecute = () => {
    onSubmitOrder({
      stockId: stock.id,
      type: orderSide,
      orderType,
      price: orderPrice,
      quantity: qty,
    });
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Stock Identity & Live Price Header */}
      <div className="px-gutter pt-space-md flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-headline-sm text-headline-sm text-primary">
              <span className="material-symbols-outlined text-[24px]">apartment</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {stock.name}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                  {stock.code}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {stock.sector}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="알림 설정"
            onClick={() => onToggleAlert(stock.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
              stock.alertEnabled
                ? "bg-secondary-container text-on-secondary-fixed"
                : "bg-surface-container-low text-on-surface"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={
                stock.alertEnabled ? { fontVariationSettings: "'FILL' 1" } : undefined
              }
            >
              notifications
            </span>
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-space-xs">
          {stock.tags.map((tag, idx) => (
            <span
              key={tag}
              className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full ${
                idx === 0
                  ? "bg-secondary-container text-on-secondary-fixed font-medium"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price & Volume */}
        <div className="mt-space-sm flex items-baseline justify-between tabular-nums">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
                {stock.price.toLocaleString()}
              </span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                원
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div
                className={`flex items-center font-label-lg text-label-lg font-bold ${
                  isUp ? "text-on-tertiary-container" : "text-[#2563eb]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] leading-none">
                  {isUp ? "arrow_drop_up" : "arrow_drop_down"}
                </span>
                <span>
                  {Math.abs(stock.changeAmount).toLocaleString()}원 ({isUp ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                실시간
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              거래량
            </span>
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">
              {stock.volume.toLocaleString()}주
            </span>
          </div>
        </div>
      </div>

      {/* Period Selector & Main Chart */}
      <div className="mt-space-lg px-gutter">
        <div className="flex items-center justify-between bg-surface-container-low p-1 rounded-full">
          {CHART_PERIODS.map((item) => {
            const isActive = period === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`flex-1 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-fixed font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-space-md bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-space-sm text-on-surface-variant tabular-nums">
            <div className="flex items-center gap-1">
              <span className="font-label-sm text-label-sm">최고</span>
              <span className="font-label-md text-label-md text-on-tertiary-container font-semibold">
                {activeChart.high.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-label-sm text-label-sm">최저</span>
              <span className="font-label-md text-label-md text-on-primary-container font-semibold">
                {activeChart.low.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="w-full h-44 relative">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 320 140"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isUp ? "#f04438" : "#2563eb"}
                    stopOpacity="0.28"
                  />
                  <stop
                    offset="100%"
                    stopColor={isUp ? "#f04438" : "#2563eb"}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>
              <path d={activeChart.areaPath} fill="url(#chartGradient)" />
              <path
                d={activeChart.linePath}
                fill="none"
                stroke={isUp ? "#f04438" : "#2563eb"}
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <circle
                cx="320"
                cy={activeChart.endY}
                fill={isUp ? "#f04438" : "#2563eb"}
                r="4.5"
              />
              <circle
                cx="320"
                cy={activeChart.endY}
                fill={isUp ? "#f04438" : "#2563eb"}
                opacity="0.3"
                r="8"
              />
            </svg>
          </div>

          {/* Volume Bars */}
          <div className="w-full h-10 mt-2 flex items-end justify-between gap-1">
            {activeChart.volumes.map((v, i) => {
              const isSecondLast = i === activeChart.volumes.length - 2;
              const isLast = i === activeChart.volumes.length - 1;
              return (
                <div
                  key={i}
                  style={{ height: `${v}%` }}
                  className={`w-full rounded-t-sm transition-all ${
                    isLast
                      ? "bg-on-tertiary-container"
                      : isSecondLast
                      ? "bg-on-tertiary-container/30"
                      : "bg-surface-container-high"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-1 tabular-nums">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {activeChart.timeLabels[0]}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {activeChart.timeLabels[1]}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {activeChart.timeLabels[2]}
            </span>
          </div>
        </div>
      </div>

      {/* Key Investment Indicators */}
      <div className="mt-space-xl px-gutter">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-sm">
          핵심 투자 지표
        </h2>
        <div className="grid grid-cols-2 gap-space-sm tabular-nums">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              시가총액
            </span>
            <span className="font-label-lg text-label-lg text-on-surface font-bold mt-1">
              {stock.marketCap}
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              52주 최고/최저
            </span>
            <span className="font-label-md text-label-md text-on-surface font-bold mt-1">
              {stock.week52HighLow}
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              PER / PBR
            </span>
            <span className="font-label-lg text-label-lg text-on-surface font-bold mt-1">
              {stock.per}{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                | {stock.pbr}
              </span>
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              외국인 소진율
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">
                {stock.foreignOwnership}
              </span>
              <span
                className={`font-label-sm text-label-sm font-semibold ${
                  stock.foreignOwnershipDelta.startsWith("+")
                    ? "text-on-tertiary-container"
                    : "text-[#2563eb]"
                }`}
              >
                {stock.foreignOwnershipDelta}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Execution Box */}
      <div className="mt-space-xl px-gutter mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex bg-surface-container-low p-1 rounded-full w-48">
              <button
                type="button"
                id="tab-buy"
                onClick={() => setOrderSide("buy")}
                className={`flex-1 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                  orderSide === "buy"
                    ? "bg-on-tertiary-container text-on-tertiary font-bold shadow-sm"
                    : "text-on-surface-variant"
                }`}
              >
                매수
              </button>
              <button
                type="button"
                id="tab-sell"
                onClick={() => setOrderSide("sell")}
                className={`flex-1 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                  orderSide === "sell"
                    ? "bg-primary text-on-primary font-bold shadow-sm"
                    : "text-on-surface-variant"
                }`}
              >
                매도
              </button>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant tabular-nums">
              <span className="material-symbols-outlined text-[18px]">
                account_balance_wallet
              </span>
              <span className="font-label-sm text-label-sm">
                {orderSide === "buy"
                  ? `가능 ${availableCash.toLocaleString()}원`
                  : `보유 ${maxSellQty}주`}
              </span>
            </div>
          </div>

          {/* Order Price */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              주문 가격
            </span>
            <div className="flex items-center justify-between bg-surface-container-low px-space-md py-2.5 rounded-xl tabular-nums">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="단가 낮추기"
                  onClick={() =>
                    setOrderPrice((p) => Math.max(100, p - (p >= 50000 ? 100 : 50)))
                  }
                  className="w-6 h-6 rounded bg-surface-container-lowest text-on-surface-variant flex items-center justify-center text-xs cursor-pointer"
                >
                  -
                </button>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  {orderPrice.toLocaleString()}원
                </span>
                <button
                  type="button"
                  aria-label="단가 높이기"
                  onClick={() =>
                    setOrderPrice((p) => p + (p >= 50000 ? 100 : 50))
                  }
                  className="w-6 h-6 rounded bg-surface-container-lowest text-on-surface-variant flex items-center justify-center text-xs cursor-pointer"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  setOrderType((prev) => (prev === "지정가" ? "시장가" : "지정가"))
                }
                className="flex items-center gap-space-xs cursor-pointer"
              >
                <span className="font-label-sm text-label-sm text-on-tertiary-container font-bold bg-secondary-container px-2 py-0.5 rounded">
                  {orderType}
                </span>
              </button>
            </div>
          </div>

          {/* Order Quantity */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between tabular-nums">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                주문 수량
              </span>
              <span
                className="font-label-sm text-label-sm text-on-surface-variant"
                id="max-qty-label"
              >
                최대 {maxQty}주
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface-container-low p-1.5 rounded-xl tabular-nums">
              <button
                type="button"
                id="btn-dec"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface active:scale-95 shadow-xs transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <div className="flex items-center gap-1">
                <span
                  className="font-headline-sm text-headline-sm text-on-surface font-bold"
                  id="qty-text"
                >
                  {qty}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  주
                </span>
              </div>
              <button
                type="button"
                id="btn-inc"
                onClick={() => setQty((prev) => Math.min(9999, prev + 1))}
                className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface active:scale-95 shadow-xs transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => handleChipClick(10)}
                className="flex-1 py-1 bg-surface-container-low text-on-surface rounded-md font-label-sm text-label-sm font-medium hover:bg-secondary-container transition-colors cursor-pointer"
              >
                +10주
              </button>
              <button
                type="button"
                onClick={() => handleChipClick(20)}
                className="flex-1 py-1 bg-surface-container-low text-on-surface rounded-md font-label-sm text-label-sm font-medium hover:bg-secondary-container transition-colors cursor-pointer"
              >
                +20주
              </button>
              <button
                type="button"
                onClick={() => handleChipClick(50)}
                className="flex-1 py-1 bg-surface-container-low text-on-surface rounded-md font-label-sm text-label-sm font-medium hover:bg-secondary-container transition-colors cursor-pointer"
              >
                +50주
              </button>
              <button
                type="button"
                onClick={() => handleChipClick("max")}
                className="flex-1 py-1 bg-secondary-container text-on-secondary-fixed font-bold rounded-md font-label-sm text-label-sm transition-colors cursor-pointer"
              >
                최대
              </button>
            </div>
          </div>

          {/* Total Expected Order Amount */}
          <div className="bg-secondary-container rounded-xl p-space-md flex items-center justify-between tabular-nums">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant">
                총 예상 주문금액
              </span>
              <span className="font-label-sm text-label-sm text-on-secondary-fixed">
                수수료 무료 혜택 적용
              </span>
            </div>
            <div className="text-right">
              <span
                className="font-numeral-lg text-numeral-lg text-on-secondary-fixed font-bold"
                id="total-price"
              >
                ₩{totalOrderAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-gutter py-3 shadow-[0_-4px_20px_rgba(17,24,39,0.05)]">
        <div className="flex items-center gap-space-sm max-w-md mx-auto">
          <button
            type="button"
            aria-label="관심 종목 저장"
            id="btn-favorite"
            onClick={() => onToggleFavorite(stock.id)}
            className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[24px] ${
                stock.isFavorite ? "text-on-tertiary-container" : ""
              }`}
              id="fav-icon"
              style={
                stock.isFavorite
                  ? { fontVariationSettings: "'FILL' 1" }
                  : { fontVariationSettings: "'FILL' 0" }
              }
            >
              favorite
            </span>
          </button>

          <button
            type="button"
            id="btn-order-submit"
            onClick={handleOrderExecute}
            className={`flex-1 h-12 rounded-full font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:scale-[0.98] shadow-md transition-all cursor-pointer tabular-nums ${
              orderSide === "buy"
                ? "bg-on-tertiary-container text-on-tertiary"
                : "bg-primary text-on-primary"
            }`}
          >
            <span id="btn-order-text">
              {totalOrderAmount.toLocaleString()}원{" "}
              {orderSide === "buy" ? "매수하기" : "매도하기"}
            </span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
        <div className="w-full flex justify-center pt-2 pb-1">
          <div className="w-32 h-1 bg-on-surface/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
