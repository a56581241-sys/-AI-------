import React, { useState } from "react";
import { HoldingItem, OrderRecord, StockItem } from "../data/mockStocks";

interface OrdersViewProps {
  availableCash: number;
  stocks: StockItem[];
  holdings: HoldingItem[];
  orders: OrderRecord[];
  onSelectStock: (stockId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onOpenDepositModal: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  availableCash,
  stocks,
  holdings,
  orders,
  onSelectStock,
  onCancelOrder,
  onOpenDepositModal,
}) => {
  const [subTab, setSubTab] = useState<"orders" | "holdings">("orders");

  const holdingsWithDetails = React.useMemo(() => {
    return holdings
      .filter((h) => h.quantity > 0)
      .map((h) => {
        const stock = stocks.find((s) => s.id === h.stockId);
        const currentPrice = stock ? stock.price : h.avgBuyPrice;
        const evalValue = currentPrice * h.quantity;
        const costValue = h.avgBuyPrice * h.quantity;
        const profitAmount = evalValue - costValue;
        const profitPct = costValue > 0 ? (profitAmount / costValue) * 100 : 0;
        return {
          ...h,
          stock,
          currentPrice,
          evalValue,
          profitAmount,
          profitPct,
        };
      });
  }, [holdings, stocks]);

  const totalEvalHoldings = holdingsWithDetails.reduce(
    (sum, item) => sum + item.evalValue,
    0
  );

  return (
    <div className="flex flex-col w-full px-gutter py-space-md gap-space-lg">
      {/* Cash & Order Summary Card */}
      <div className="bg-secondary-container rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-on-secondary-fixed-variant">
            <span className="material-symbols-outlined text-[18px]">
              account_balance_wallet
            </span>
            <span className="font-label-md text-label-md font-semibold">
              주문 가능 예수금
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenDepositModal}
            className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-bold shadow-xs cursor-pointer"
          >
            + 즉시 충전
          </button>
        </div>

        <div className="flex items-baseline justify-between tabular-nums">
          <div>
            <span className="font-display-lg text-display-lg font-bold text-on-secondary-fixed">
              ₩{availableCash.toLocaleString()}
            </span>
            <p className="font-body-sm text-body-sm text-on-secondary-container mt-0.5">
              국내/해외 통합 증거금 100% · 수수료 무료 혜택 적용 중
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-space-sm bg-surface-container-lowest/75 rounded-xl p-space-md tabular-nums">
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              주식 평가금액
            </span>
            <div className="font-numeral-md text-numeral-md font-bold text-on-surface mt-0.5">
              {totalEvalHoldings.toLocaleString()}원
            </div>
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              당일 주문 건수
            </span>
            <div className="font-numeral-md text-numeral-md font-bold text-on-surface mt-0.5">
              {orders.length}건
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation Switcher */}
      <div className="flex bg-surface-container-low p-1 rounded-full">
        <button
          type="button"
          onClick={() => setSubTab("orders")}
          className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
            subTab === "orders"
              ? "bg-surface-container-lowest text-on-surface font-bold shadow-sm"
              : "text-on-surface-variant"
          }`}
        >
          주문/체결 내역 ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("holdings")}
          className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
            subTab === "holdings"
              ? "bg-surface-container-lowest text-on-surface font-bold shadow-sm"
              : "text-on-surface-variant"
          }`}
        >
          보유 잔고 ({holdingsWithDetails.length})
        </button>
      </div>

      {subTab === "orders" ? (
        <div className="flex flex-col gap-space-sm pb-6">
          {orders.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center text-on-surface-variant">
              최근 주문 내역이 없습니다.
            </div>
          ) : (
            orders.map((order) => {
              const isBuy = order.type === "buy";
              return (
                <div
                  key={order.id}
                  onClick={() => onSelectStock(order.stockId)}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-2.5 hover:bg-surface-container-low/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                          isBuy
                            ? "bg-error-container text-on-tertiary-container"
                            : "bg-surface-container-high text-[#2563eb]"
                        }`}
                      >
                        {isBuy ? "매수" : "매도"} · {order.orderType}
                      </span>
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">
                        {order.stockName}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        {order.stockCode}
                      </span>
                    </div>
                    <span
                      className={`font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded ${
                        order.status === "체결완료"
                          ? "bg-secondary-container text-on-secondary-fixed"
                          : order.status === "미체결"
                          ? "bg-surface-container-low text-on-tertiary-container"
                          : "bg-surface-container-low text-outline"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant tabular-nums">
                    <span>
                      주문단가 {order.price.toLocaleString()}원 · 수량 {order.quantity}주
                    </span>
                    <span className="font-numeral-md text-numeral-md font-bold text-on-surface">
                      ₩{order.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-surface-container-low">
                    <span className="font-label-sm text-label-sm text-outline">
                      {order.timestamp} · {order.id}
                    </span>
                    {order.status === "미체결" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelOrder(order.id);
                        }}
                        className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-error-container hover:text-on-tertiary-container font-label-sm text-label-sm text-on-surface-variant transition-colors cursor-pointer"
                      >
                        주문 취소
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm pb-6">
          {holdingsWithDetails.map((item) => {
            const isUp = item.profitPct >= 0;
            return (
              <div
                key={item.stockId}
                onClick={() => onSelectStock(item.stockId)}
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {item.stock?.name || item.stockId}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-label-sm text-[10px]">
                      {item.quantity}주 보유
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">
                    평단가 {Math.round(item.avgBuyPrice).toLocaleString()}원
                  </span>
                </div>

                <div className="text-right tabular-nums">
                  <div className="font-numeral-md text-numeral-md font-bold text-on-surface">
                    {item.evalValue.toLocaleString()}원
                  </div>
                  <div
                    className={`font-label-sm text-label-sm font-semibold ${
                      isUp ? "text-on-tertiary-container" : "text-[#2563eb]"
                    }`}
                  >
                    {isUp ? "+" : ""}
                    {Math.round(item.profitAmount).toLocaleString()}원 ({isUp ? "+" : ""}
                    {item.profitPct.toFixed(2)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
