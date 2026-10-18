import React, { useState } from 'react';
import { DatabaseSchema, Language } from '../types';
import { t } from '../i18n';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenNewModal: () => void;
  dbSynced: boolean;
  dbSizeKb: number;
  db?: DatabaseSchema | null;
  onSwitchSystem?: (sysId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenNewModal,
  dbSynced,
  dbSizeKb,
  db,
  onSwitchSystem,
}) => {
  const [isSystemDropdownOpen, setIsSystemDropdownOpen] = useState(false);

  const activeSys = db?.systems?.find((s) => s.active) || {
    id: 'sys-108',
    title: t(lang, 'sysName'),
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fcf9f4]/95 backdrop-blur-md border-b border-[#dfc0b7]/40 shadow-xs">
      <div className="h-16 w-full px-4 md:px-8 flex items-center justify-between gap-8 max-w-[1400px] mx-auto">
        {/* Zone 1: Brand Title (Single line, single element) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('daily-tracker')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-[#8b2500]"
            aria-label="My Sankalp 108 Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#8b2500] text-[#ffdcc3] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              ॐ
            </div>
            <span className="font-serif text-xl font-bold text-[#641800] tracking-tight whitespace-nowrap">
              My Sankalp 108
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line text links with subtle hover states) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#f6f3ee] p-1 rounded-xl border border-[#dfc0b7]/30">
          <button
            type="button"
            onClick={() => setActiveTab('daily-tracker')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'daily-tracker'
                ? 'bg-[#8b2500] text-white shadow-xs'
                : 'text-[#58423b] hover:text-[#1c1c19] hover:bg-[#ebe8e3]'
            }`}
          >
            {t(lang, 'tabDailyTracker')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('100-day-matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === '100-day-matrix'
                ? 'bg-[#8b2500] text-white shadow-xs'
                : 'text-[#58423b] hover:text-[#1c1c19] hover:bg-[#ebe8e3]'
            }`}
          >
            {t(lang, 'tabMatrix')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'analytics'
                ? 'bg-[#8b2500] text-white shadow-xs'
                : 'text-[#58423b] hover:text-[#1c1c19] hover:bg-[#ebe8e3]'
            }`}
          >
            {t(lang, 'tabAnalytics')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('siddhi-certificate')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'siddhi-certificate'
                ? 'bg-[#8b2500] text-white shadow-xs'
                : 'text-[#58423b] hover:text-[#1c1c19] hover:bg-[#ebe8e3]'
            }`}
          >
            {t(lang, 'tabCertificate')}
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active System Switcher Dropdown */}
          <div className="relative hidden xl:block">
            <button
              type="button"
              onClick={() => setIsSystemDropdownOpen(!isSystemDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f6f3ee] hover:bg-[#ebe8e3] text-xs font-medium border border-[#dfc0b7]/30 transition-colors"
              aria-expanded={isSystemDropdownOpen}
              aria-label="Switch Active Resolution System"
            >
              <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase tracking-wider">
                System:
              </span>
              <span className="font-bold text-[#1c1c19] max-w-[160px] truncate">
                {activeSys.title}
              </span>
              <span className="material-symbols-outlined text-sm text-[#904d00]">
                {isSystemDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isSystemDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#ffffff] border border-[#dfc0b7]/50 rounded-2xl p-2 shadow-xl z-50 flex flex-col gap-1">
                <span className="px-3 py-1 text-[10px] font-serif font-bold text-[#904d00] uppercase">
                  Select Resolution System
                </span>
                {db?.systems?.map((sys) => (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => {
                      if (onSwitchSystem) onSwitchSystem(sys.id);
                      setIsSystemDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      sys.active
                        ? 'bg-[#ffdcc3]/50 text-[#641800] font-bold'
                        : 'hover:bg-[#f6f3ee] text-[#1c1c19]'
                    }`}
                  >
                    <span className="truncate">{sys.title}</span>
                    {sys.active && (
                      <span className="material-symbols-outlined text-sm text-[#003c29]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Vow Button */}
          <button
            type="button"
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8b2500] hover:bg-[#641800] text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span className="whitespace-nowrap">{t(lang, 'newVow')}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-[#f6f3ee] p-0.5 rounded-xl border border-[#dfc0b7]/30">
            <button
              type="button"
              onClick={() => setLang('HI')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'HI' ? 'bg-[#ffffff] text-[#641800] shadow-xs' : 'text-[#58423b] hover:text-[#1c1c19]'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLang('EN')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'EN' ? 'bg-[#ffffff] text-[#641800] shadow-xs' : 'text-[#58423b] hover:text-[#1c1c19]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 bg-[#f6f3ee] border-t border-[#dfc0b7]/30 gap-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('daily-tracker')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === 'daily-tracker' ? 'bg-[#8b2500] text-white' : 'text-[#58423b]'
          }`}
        >
          {t(lang, 'tabDailyTracker')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('100-day-matrix')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === '100-day-matrix' ? 'bg-[#8b2500] text-white' : 'text-[#58423b]'
          }`}
        >
          {t(lang, 'tabMatrix')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-[#8b2500] text-white' : 'text-[#58423b]'
          }`}
        >
          {t(lang, 'tabAnalytics')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('siddhi-certificate')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === 'siddhi-certificate' ? 'bg-[#8b2500] text-white' : 'text-[#58423b]'
          }`}
        >
          {t(lang, 'tabCertificate')}
        </button>
      </div>
    </header>
  );
};
