import React, { useState } from "react";
import { HOTLINK_IMAGES } from "../data/mockStocks";

export type ActiveTab = "home" | "discovery" | "watchlist" | "orders";

interface HeaderProps {
  mode: "tab" | "detail";
  onBack?: () => void;
  onShare?: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadNotifications: number;
  profileAvatar: string;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onBack,
  onShare,
  onOpenNotifications,
  onOpenProfile,
  unreadNotifications,
  profileAvatar,
  onLogoClick,
}) => {
  const [logoError, setLogoError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto w-full">
        {/* Mobile Status Bar */}
        <div className="w-full flex items-center justify-between px-6 pt-2 pb-0.5 text-on-surface font-semibold text-[13px] leading-none select-none">
          <span className="font-semibold tracking-tight tabular-nums">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            <span className="material-symbols-outlined text-[18px]">battery_full</span>
          </div>
        </div>

        {/* App Bar Row */}
        {mode === "detail" ? (
          <div className="h-14 px-gutter flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                aria-label="뒤로 가기"
                onClick={onBack}
                className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
              </button>
              {!logoError ? (
                <img
                  alt="StockApp Logo"
                  className="h-8 w-8 rounded-lg object-contain"
                  src={HOTLINK_IMAGES.logo}
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">
                    trending_up
                  </span>
                </div>
              )}
              <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold ml-1 whitespace-nowrap">
                Stock Detail
              </h1>
            </div>

            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                aria-label="공유"
                onClick={onShare}
                className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">share</span>
              </button>
              <button
                type="button"
                aria-label="마이페이지"
                onClick={onOpenProfile}
                className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer"
              >
                {!avatarError ? (
                  <img
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-outline-variant/30"
                    src={profileAvatar}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-fixed font-bold text-xs flex items-center justify-center">
                    SN
                  </div>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-14 px-gutter flex items-center justify-between">
            <button
              type="button"
              onClick={onLogoClick}
              className="flex items-center gap-space-sm text-left cursor-pointer focus:outline-none"
            >
              {!logoError ? (
                <img
                  alt="StockApp Logo"
                  className="h-8 w-8 rounded-lg object-contain"
                  src={HOTLINK_IMAGES.logo}
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">
                    trending_up
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-bold leading-none">
                  스톡나우
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium leading-none mt-0.5">
                  StockNow
                </span>
              </div>
            </button>

            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                aria-label="알림"
                onClick={onOpenNotifications}
                className="relative w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                {unreadNotifications > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-on-tertiary-container ring-2 ring-surface" />
                )}
              </button>
              <button
                type="button"
                aria-label="마이페이지"
                onClick={onOpenProfile}
                className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer"
              >
                {!avatarError ? (
                  <img
                    alt="프로필"
                    className="w-8 h-8 rounded-full object-cover border border-outline-variant/30"
                    src={profileAvatar}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-fixed font-bold text-xs flex items-center justify-center">
                    SN
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
