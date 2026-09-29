/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { ActiveTab, Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { HomeView } from "./components/HomeView";
import { DiscoveryView } from "./components/DiscoveryView";
import { WatchlistView } from "./components/WatchlistView";
import { OrdersView } from "./components/OrdersView";
import { StockDetailView } from "./components/StockDetailView";
import {
  HOTLINK_IMAGES,
  HoldingItem,
  INITIAL_HOLDINGS,
  INITIAL_INSIGHTS,
  INITIAL_MARKET_INDICES,
  INITIAL_ORDERS,
  INITIAL_STOCKS,
  InsightItem,
  OrderRecord,
  StockItem,
} from "./data/mockStocks";

const STORAGE_KEYS = {
  CASH: "stocknow_cash_v1",
  HOLDINGS: "stocknow_holdings_v1",
  ORDERS: "stocknow_orders_v1",
  GROUPS: "stocknow_groups_v1",
  AVATAR: "stocknow_avatar_v1",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [discoveryInitialCat, setDiscoveryInitialCat] = useState<string>("전체");

  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [indices] = useState(INITIAL_MARKET_INDICES);
  const [insights, setInsights] = useState<InsightItem[]>(INITIAL_INSIGHTS);

  const [availableCash, setAvailableCash] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CASH);
      return saved ? Number(saved) : 4520000;
    } catch {
      return 4520000;
    }
  });

  const [holdings, setHoldings] = useState<HoldingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOLDINGS);
      return saved ? JSON.parse(saved) : INITIAL_HOLDINGS;
    } catch {
      return INITIAL_HOLDINGS;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [watchlistGroups, setWatchlistGroups] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
      return saved
        ? JSON.parse(saved)
        : ["기본 그룹", "AI & 반도체", "배당성장주"];
    } catch {
      return ["기본 그룹", "AI & 반도체", "배당성장주"];
    }
  });

  const [profileAvatar, setProfileAvatar] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AVATAR) || HOTLINK_IMAGES.profile1;
    } catch {
      return HOTLINK_IMAGES.profile1;
    }
  });

  // Modals & Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [depositAmountInput, setDepositAmountInput] = useState("1000000");
  const [transferAmountInput, setTransferAmountInput] = useState("500000");
  const [transferRecipient, setTransferRecipient] = useState("내 신한은행 주계좌");

  // Persist user portfolio state in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CASH, String(availableCash));
      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdings));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(watchlistGroups));
      localStorage.setItem(STORAGE_KEYS.AVATAR, profileAvatar);
    } catch {
      // Ignore storage quota errors in restricted frames
    }
  }, [availableCash, holdings, orders, watchlistGroups, profileAvatar]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  // Total asset value = base 34,850,000 adjusted by cash/holdings changes
  const totalAssetValue = useMemo(() => {
    const initialHoldingsValue = INITIAL_HOLDINGS.reduce((sum, h) => {
      const s = INITIAL_STOCKS.find((st) => st.id === h.stockId);
      return sum + (s ? s.price * h.quantity : 0);
    }, 0);
    const currentHoldingsValue = holdings.reduce((sum, h) => {
      const s = stocks.find((st) => st.id === h.stockId);
      return sum + (s ? s.price * h.quantity : 0);
    }, 0);
    const deltaHoldings = currentHoldingsValue - initialHoldingsValue;
    const deltaCash = availableCash - 4520000;
    return 34850000 + deltaHoldings + deltaCash;
  }, [holdings, stocks, availableCash]);

  const selectedStock = useMemo(
    () => stocks.find((s) => s.id === selectedStockId) || null,
    [stocks, selectedStockId]
  );

  const handleToggleFavorite = (stockId: string) => {
    setStocks((prev) =>
      prev.map((s) => {
        if (s.id !== stockId) return s;
        const nextFav = !s.isFavorite;
        showToast(
          nextFav
            ? `${s.name} 종목이 관심 목록에 추가되었습니다.`
            : `${s.name} 종목이 관심 목록에서 해제되었습니다.`
        );
        return { ...s, isFavorite: nextFav };
      })
    );
  };

  const handleToggleAlert = (stockId: string) => {
    setStocks((prev) =>
      prev.map((s) => {
        if (s.id !== stockId) return s;
        const nextAlert = !s.alertEnabled;
        showToast(
          nextAlert
            ? `${s.name} 실시간 목표가 알림이 켜졌습니다.`
            : `${s.name} 실시간 알림이 해제되었습니다.`
        );
        return { ...s, alertEnabled: nextAlert };
      })
    );
  };

  const handleToggleInsightBookmark = (insightId: string) => {
    setInsights((prev) =>
      prev.map((ins) => {
        if (ins.id !== insightId) return ins;
        const next = !ins.bookmarked;
        showToast(next ? "마켓 인사이트가 북마크되었습니다." : "북마크가 해제되었습니다.");
        return { ...ins, bookmarked: next };
      })
    );
  };

  const handleSubmitOrder = ({
    stockId,
    type,
    orderType,
    price,
    quantity,
  }: {
    stockId: string;
    type: "buy" | "sell";
    orderType: "지정가" | "시장가";
    price: number;
    quantity: number;
  }) => {
    const stock = stocks.find((s) => s.id === stockId);
    if (!stock) return;

    const totalAmount = price * quantity;

    if (type === "buy") {
      if (totalAmount > availableCash) {
        showToast("주문 가능 예수금이 부족합니다. 간편 충전을 이용해 주세요.");
        setShowDepositModal(true);
        return;
      }
      setAvailableCash((prev) => prev - totalAmount);
      setHoldings((prev) => {
        const existing = prev.find((h) => h.stockId === stockId);
        if (existing) {
          const newQty = existing.quantity + quantity;
          const newAvg =
            (existing.avgBuyPrice * existing.quantity + totalAmount) / newQty;
          return prev.map((h) =>
            h.stockId === stockId
              ? { ...h, quantity: newQty, avgBuyPrice: newAvg }
              : h
          );
        }
        return [...prev, { stockId, quantity, avgBuyPrice: price }];
      });
    } else {
      const existing = holdings.find((h) => h.stockId === stockId);
      if (!existing || existing.quantity < quantity) {
        showToast(`보유 수량(${existing?.quantity ?? 0}주)이 부족합니다.`);
        return;
      }
      setAvailableCash((prev) => prev + totalAmount);
      setHoldings((prev) =>
        prev
          .map((h) =>
            h.stockId === stockId
              ? { ...h, quantity: h.quantity - quantity }
              : h
          )
          .filter((h) => h.quantity > 0)
      );
    }

    const now = new Date();
    const timeStr = `오늘 ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const newOrder: OrderRecord = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      stockId: stock.id,
      stockName: stock.name,
      stockCode: stock.code,
      type,
      orderType,
      price,
      quantity,
      totalAmount,
      status: "체결완료",
      timestamp: timeStr,
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(
      `${stock.name} ${quantity}주 (${totalAmount.toLocaleString()}원) ${
        type === "buy" ? "매수" : "매도"
      } 주문이 체결되었습니다.`
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "취소됨" } : o))
    );
    showToast("미체결 주문이 정상적으로 취소되었습니다.");
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmountInput.replace(/[^0-9]/g, ""));
    if (!amount || amount <= 0) return;
    setAvailableCash((prev) => prev + amount);
    setShowDepositModal(false);
    showToast(`₩${amount.toLocaleString()} 간편 충전이 완료되었습니다.`);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(transferAmountInput.replace(/[^0-9]/g, ""));
    if (!amount || amount <= 0) return;
    if (amount > availableCash) {
      showToast("출금 가능 예수금이 부족합니다.");
      return;
    }
    setAvailableCash((prev) => prev - amount);
    setShowTransferModal(false);
    showToast(`${transferRecipient}로 ₩${amount.toLocaleString()} 이체되었습니다.`);
  };

  const handleShareStock = () => {
    if (!selectedStock) return;
    const shareText = `[스톡나우] ${selectedStock.name}(${selectedStock.code}) 현재가 ${selectedStock.price.toLocaleString()}원 (${
      selectedStock.changePercent >= 0 ? "+" : ""
    }${selectedStock.changePercent.toFixed(2)}%)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
    showToast(`${selectedStock.name} 시세 정보가 클립보드에 복사되었습니다.`);
  };

  const pendingOrdersCount = orders.filter((o) => o.status === "미체결").length;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center">
      {/* Header */}
      <Header
        mode={selectedStock ? "detail" : "tab"}
        onBack={() => setSelectedStockId(null)}
        onShare={handleShareStock}
        onOpenNotifications={() => {
          setUnreadNotifications(0);
          setShowNotificationsModal(true);
        }}
        onOpenProfile={() => setShowProfileModal(true)}
        unreadNotifications={unreadNotifications}
        profileAvatar={profileAvatar}
        onLogoClick={() => {
          setSelectedStockId(null);
          setActiveTab("home");
        }}
      />

      {/* Main Mobile Container */}
      <main className="w-full max-w-md flex flex-col relative pt-[76px] pb-24 bg-surface min-h-screen">
        {selectedStock ? (
          <StockDetailView
            stock={selectedStock}
            availableCash={availableCash}
            holding={holdings.find((h) => h.stockId === selectedStock.id)}
            onToggleFavorite={handleToggleFavorite}
            onToggleAlert={handleToggleAlert}
            onSubmitOrder={handleSubmitOrder}
          />
        ) : activeTab === "home" ? (
          <HomeView
            totalAssetValue={totalAssetValue}
            dailyGainAmount={1240000}
            dailyGainPercent={3.68}
            indices={indices}
            stocks={stocks}
            insights={insights}
            onSelectStock={(id) => {
              setSelectedStockId(id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenDepositModal={() => setShowDepositModal(true)}
            onOpenTransferModal={() => setShowTransferModal(true)}
            onToggleInsightBookmark={handleToggleInsightBookmark}
            onNavigateToTheme={(theme) => {
              setDiscoveryInitialCat("급상승 🔥");
              setActiveTab("discovery");
              showToast(`#${theme} 관련 핵심 종목을 탐색합니다.`);
            }}
          />
        ) : activeTab === "discovery" ? (
          <DiscoveryView
            stocks={stocks}
            initialCategory={discoveryInitialCat}
            onSelectStock={(id) => {
              setSelectedStockId(id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : activeTab === "watchlist" ? (
          <WatchlistView
            totalAssetValue={totalAssetValue}
            stocks={stocks}
            holdings={holdings}
            watchlistGroups={watchlistGroups}
            onAddWatchlistGroup={(name) => {
              if (!watchlistGroups.includes(name)) {
                setWatchlistGroups((prev) => [...prev, name]);
                showToast(`'${name}' 그룹이 생성되었습니다.`);
              }
            }}
            onSelectStock={(id) => {
              setSelectedStockId(id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onToggleFavorite={handleToggleFavorite}
            onOpenPortfolioDetail={() => setActiveTab("orders")}
          />
        ) : (
          <OrdersView
            availableCash={availableCash}
            stocks={stocks}
            holdings={holdings}
            orders={orders}
            onSelectStock={(id) => {
              setSelectedStockId(id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onCancelOrder={handleCancelOrder}
            onOpenDepositModal={() => setShowDepositModal(true)}
          />
        )}
      </main>

      {/* Bottom Tab Navigation (hidden when inside Stock Detail stack screen) */}
      {!selectedStock && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setSelectedStockId(null);
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          pendingOrdersCount={pendingOrdersCount}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-primary-container text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 animate-fade-in">
          <span className="material-symbols-outlined text-[18px] text-secondary-container">
            check_circle
          </span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Quick Deposit Modal (간편 충전) */}
      {showDepositModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowDepositModal(false)}
        >
          <form
            onSubmit={handleDepositSubmit}
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                간편 예수금 충전
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant tabular-nums">
                현재 잔액 ₩{availableCash.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                충전 금액 (원)
              </label>
              <input
                type="number"
                value={depositAmountInput}
                onChange={(e) => setDepositAmountInput(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low font-numeral-md text-numeral-md font-bold text-on-surface outline-none tabular-nums"
              />
              <div className="flex gap-1.5">
                {[500000, 1000000, 3000000, 5000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmountInput(String(amt))}
                    className="flex-1 py-1.5 rounded-lg bg-surface-container-low hover:bg-secondary-container font-label-sm text-label-sm text-on-surface cursor-pointer"
                  >
                    +{amt / 10000}만
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="flex-1 h-12 rounded-full bg-surface-container-low text-on-surface font-label-lg text-label-lg cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold cursor-pointer"
              >
                즉시 충전하기
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Account Transfer Modal (계좌 이체) */}
      {showTransferModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowTransferModal(false)}
        >
          <form
            onSubmit={handleTransferSubmit}
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                수수료 무료 계좌 이체
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant tabular-nums">
                출금 가능 ₩{availableCash.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                받는 계좌
              </label>
              <input
                type="text"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface outline-none"
              />
              <label className="font-label-sm text-label-sm text-on-surface-variant block pt-1">
                이체 금액 (원)
              </label>
              <input
                type="number"
                value={transferAmountInput}
                onChange={(e) => setTransferAmountInput(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low font-numeral-md text-numeral-md font-bold text-on-surface outline-none tabular-nums"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="flex-1 h-12 rounded-full bg-surface-container-low text-on-surface font-label-lg text-label-lg cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold cursor-pointer"
              >
                이체 실행
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotificationsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowNotificationsModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                실시간 알림 센터
              </h3>
              <button
                type="button"
                onClick={() => setShowNotificationsModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <div
                onClick={() => {
                  setShowNotificationsModal(false);
                  setSelectedStockId("005930");
                }}
                className="p-3.5 rounded-xl bg-secondary-container/60 flex items-start gap-3 cursor-pointer"
              >
                <span className="material-symbols-outlined text-on-tertiary-container mt-0.5">
                  trending_up
                </span>
                <div>
                  <div className="font-label-md text-label-md font-bold text-on-surface">
                    삼성전자(005930) +2.87% 상승 돌파
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    외국인·기관 수급 유입과 함께 78,900원에 도달했습니다.
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  setShowNotificationsModal(false);
                  setSelectedStockId("000660");
                }}
                className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3 cursor-pointer"
              >
                <span className="material-symbols-outlined text-secondary mt-0.5">
                  notifications_active
                </span>
                <div>
                  <div className="font-label-md text-label-md font-bold text-on-surface">
                    SK하이닉스 HBM3E 리포트 도착
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    신한투자증권 AI 브리핑 리포트가 업데이트되었습니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Switcher Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 pb-8 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-outline-variant/50 rounded-full mx-auto" />
            <div className="flex items-center gap-3">
              <img
                src={profileAvatar}
                alt="프로필"
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover border-2 border-secondary-container"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    김스톡 (Dada) 님
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                    VIP 우대
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  계좌번호 110-482-992014 · 국내/해외 수수료 무료
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                프로필 아바타 선택 (HTML 핫링크 이미지)
              </span>
              <div className="flex items-center gap-3">
                {[
                  { label: "기본 프로필", url: HOTLINK_IMAGES.profile1 },
                  { label: "에디토리얼", url: HOTLINK_IMAGES.profile2 },
                  { label: "스톡나우 엠블럼", url: HOTLINK_IMAGES.profile3 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setProfileAvatar(item.url);
                      showToast(`${item.label} 아바타가 적용되었습니다.`);
                    }}
                    className={`flex-1 p-2 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      profileAvatar === item.url
                        ? "border-primary bg-secondary-container/40 font-bold"
                        : "border-surface-container-high bg-surface-container-low"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-label-sm text-[11px] text-on-surface">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
