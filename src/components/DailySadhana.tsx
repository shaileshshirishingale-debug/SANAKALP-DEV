import React, { useState, useEffect } from 'react';
import { DatabaseSchema, Language } from '../types';
import { t } from '../i18n';
import { calculateStreak, calculateCompletionMetrics } from '../utils/calculations';

interface DailySadhanaProps {
  db: DatabaseSchema;
  lang: Language;
  onToggleVow: (dayNumber: number, vowId: string) => void;
  onSaveJournal: (rating: number, mood: string, note: string) => void;
  onExportExcel: () => void;
  onOpenNewModal: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  onResetDatabase?: () => void;
}

export const DailySadhana: React.FC<DailySadhanaProps> = ({
  db,
  lang,
  onToggleVow,
  onSaveJournal,
  onExportExcel,
  onOpenNewModal,
  onShowToast,
  onResetDatabase,
}) => {
  const currentDay = db.systems?.find((s) => s.active)?.currentDay || 42;
  const todayLog = db.dailyLogs[currentDay] || {
    completedVowIds: [],
    mindfulnessRating: 4.5,
    innerState: 'Tranquil',
    journalNote: '',
  };

  const [selectedSlot, setSelectedSlot] = useState<string>('all');
  const [activeMood, setActiveMood] = useState<string>(todayLog.innerState || 'Tranquil');
  const [mindfulnessRating, setMindfulnessRating] = useState<number>(todayLog.mindfulnessRating || 4.5);
  const [journalNote, setJournalNote] = useState<string>(
    todayLog.journalNote || 'Mid-day stillness maintained. Recharged energy with 5 minutes of contemplation after noon.'
  );

  useEffect(() => {
    if (db.dailyLogs[currentDay]) {
      const log = db.dailyLogs[currentDay];
      if (log.innerState) setActiveMood(log.innerState);
      if (log.mindfulnessRating !== undefined) setMindfulnessRating(log.mindfulnessRating);
      if (log.journalNote !== undefined) setJournalNote(log.journalNote);
    }
  }, [db, currentDay]);

  const activeVows = db.sankalps ? db.sankalps.filter((s) => s.active) : [];
  const totalVows = activeVows.length;
  const completedTodayCount = todayLog.completedVowIds ? todayLog.completedVowIds.length : 0;
  const completionPercent = totalVows > 0 ? Math.round((completedTodayCount / totalVows) * 100) : 0;

  const currentStreak = calculateStreak(db.dailyLogs, currentDay);
  const totalMetrics = calculateCompletionMetrics(db.dailyLogs, totalVows, currentDay);

  const moods = [
    { label: '🧘 Tranquil', val: 'Tranquil' },
    { label: '⚡ Energized', val: 'Energized' },
    { label: '🙏 Grateful', val: 'Grateful' },
    { label: '🎯 Single-Pointed Focus', val: 'Single-Pointed Focus' },
    { label: '👁️ Mindful Witness', val: 'Mindful Witness' },
    { label: '🍃 Detached Clarity', val: 'Detached Clarity' },
  ];

  const filteredVows = activeVows.filter((vow) => {
    if (selectedSlot === 'all') return true;
    return vow.timeSlot === selectedSlot;
  });

  const handleMoodSelect = (val: string) => {
    setActiveMood(val);
    onSaveJournal(mindfulnessRating, val, journalNote);
    onShowToast(`State of mind logged: ${val}`, 'psychology');
  };

  const handleRatingClick = (r: number) => {
    setMindfulnessRating(r);
    onSaveJournal(r, activeMood, journalNote);
    onShowToast(`Mindfulness rating updated: ${r}/5`, 'star');
  };

  const handleJournalBlur = () => {
    onSaveJournal(mindfulnessRating, activeMood, journalNote);
    onShowToast('Micro-journal entry saved to Vercel Blob DB!', 'save');
  };

  // Calculate SVG stroke offset for Willpower Gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (completionPercent / 100) * circumference;

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Epigraph & Active Ledger Header Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Epigraph & Progress (8 Cols) */}
        <div className="lg:col-span-8 bg-[#f6f3ee] border border-[#dfc0b7]/40 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#58423b]">
              <div className="flex items-center gap-2 font-medium">
                <span className="font-bold text-[#641800]">Phase IV</span>
                <span aria-hidden="true">•</span>
                <span>Day {currentDay} / 100</span>
                <span aria-hidden="true">•</span>
                <span>{todayLog.dateStr || '18 October 2024'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#003c29] uppercase tracking-wider">
                  VERCEL BLOB JSON SYNCED
                </span>
                {onResetDatabase && (
                  <button
                    type="button"
                    onClick={onResetDatabase}
                    className="px-2.5 py-1 rounded-lg bg-[#ebe8e3] hover:bg-[#e5e2dd] text-[#641800] text-[11px] font-semibold transition-colors"
                  >
                    Reset Baseline
                  </button>
                )}
              </div>
            </div>

            <div className="mt-1">
              <h2 className="font-serif text-2xl text-[#641800] font-bold italic leading-relaxed">
                {t(lang, 'epigraph')}
              </h2>
              <p className="text-xs text-[#58423b] mt-1">
                {t(lang, 'epigraphSub')}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-3 border-t border-[#dfc0b7]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xs text-[#58423b] font-bold">
                  {t(lang, 'completionToday')}
                </span>
                <span className="font-sans text-base text-[#641800] font-bold">
                  {completedTodayCount} / {totalVows} Fulfilled ({completionPercent}%)
                </span>
              </div>
              <div className="w-32 h-2.5 rounded-full bg-[#e5e2dd] overflow-hidden">
                <div
                  className="h-full bg-[#fe932c] rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onExportExcel}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#fcf9f4] hover:bg-[#ebe8e3] text-[#641800] text-xs font-bold shadow-xs border border-[#dfc0b7]/40 transition-all"
              >
                <span className="material-symbols-outlined text-base text-[#904d00]">file_download</span>
                <span>{t(lang, 'exportXlsx')}</span>
              </button>
              <button
                type="button"
                onClick={onOpenNewModal}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#8b2500] text-[#ffffff] hover:bg-[#641800] text-xs font-bold shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>{t(lang, 'addResolution')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Ledger Architecture Card (4 Cols) */}
        <div className="lg:col-span-4 bg-[#f0ede9] border border-[#dfc0b7]/40 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#904d00] text-xl">database</span>
              <span className="font-sans text-xs text-[#1c1c19] font-bold">Active Ledger Architecture</span>
            </div>
            <span className="text-[10px] font-bold text-[#003c29] uppercase">
              JSON Blob Storage
            </span>
          </div>

          <div className="my-3 bg-[#ffffff] rounded-xl p-3 flex flex-col gap-2 border border-[#dfc0b7]/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#58423b] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">folder_open</span>
                Storage:
              </span>
              <span className="font-mono text-[11px] text-[#641800] font-bold">
                data/sankalp_database.json
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-[#f6f3ee] rounded-lg p-2">
                <span className="block font-serif text-[9px] text-[#58423b] uppercase font-bold">SYSTEMS</span>
                <span className="text-sm text-[#1c1c19] font-bold">{db.systems?.length || 2} Active</span>
              </div>
              <div className="bg-[#f6f3ee] rounded-lg p-2">
                <span className="block font-serif text-[9px] text-[#58423b] uppercase font-bold">RESOLUTIONS</span>
                <span className="text-sm text-[#904d00] font-bold">{totalVows} Listed</span>
              </div>
              <div className="bg-[#f6f3ee] rounded-lg p-2">
                <span className="block font-serif text-[9px] text-[#58423b] uppercase font-bold">RECORDS</span>
                <span className="text-sm text-[#003c29] font-bold">{Object.keys(db.dailyLogs || {}).length} Logs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#58423b]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#003c29]">check_circle</span>
              Lock-Free Multi-Stream Sync
            </span>
            <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase">AUTO-SAVED REALTIME</span>
          </div>
        </div>
      </section>

      {/* Daily State of Mind Section */}
      <section className="bg-[#ffffff] border border-[#dfc0b7]/40 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-serif text-[11px] text-[#904d00] uppercase font-bold tracking-wider">
              Mindfulness & Inner State
            </span>
            <h3 className="font-serif text-lg text-[#1c1c19] font-bold">
              {t(lang, 'mindfulnessTitle')}
            </h3>
          </div>

          {/* 5-Star Rating */}
          <div className="flex items-center gap-2 bg-[#f6f3ee] px-3.5 py-1.5 rounded-xl border border-[#dfc0b7]/30">
            <div className="flex items-center text-[#fe932c] cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="hover:scale-110 transition-transform p-0.5"
                  aria-label={`Set mindfulness rating to ${star} stars`}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{
                      fontVariationSettings: `'FILL' ${star <= Math.floor(mindfulnessRating) ? 1 : 0}`,
                    }}
                  >
                    {star <= Math.floor(mindfulnessRating) ? 'star' : star - 0.5 <= mindfulnessRating ? 'star_half' : 'star'}
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-[#1c1c19]">{mindfulnessRating} / 5</span>
          </div>
        </div>

        {/* Mood Selectors */}
        <div className="flex flex-col gap-2">
          <span className="font-serif text-[11px] text-[#58423b] uppercase font-bold">
            {t(lang, 'bhavaLabel')}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {moods.map((m) => (
              <button
                key={m.val}
                type="button"
                onClick={() => handleMoodSelect(m.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  activeMood === m.val
                    ? 'bg-[#ffdcc3] text-[#2f1500] border-[#fe932c]'
                    : 'bg-[#f0ede9] text-[#1c1c19] hover:bg-[#ebe8e3] border-transparent'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Journal Note */}
        <div className="bg-[#f6f3ee] rounded-xl p-3 flex flex-col gap-1.5 border border-[#dfc0b7]/30">
          <label htmlFor="microJournalInput" className="font-serif text-[10px] text-[#58423b] uppercase font-bold flex items-center justify-between">
            <span>Micro-Journal Entry (Reflective Observation)</span>
            <span className="text-[#904d00] font-mono">Autosaved to Vercel Blob</span>
          </label>
          <input
            id="microJournalInput"
            type="text"
            value={journalNote}
            onChange={(e) => setJournalNote(e.target.value)}
            onBlur={handleJournalBlur}
            className="bg-[#ffffff] text-xs text-[#1c1c19] px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#fe932c] border border-[#dfc0b7]/30"
            placeholder="Record your daily contemplative observations..."
          />
        </div>
      </section>

      {/* Main Resolutions Checklist + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cards & Time Filters (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Time Slot Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f6f3ee] p-2 rounded-2xl border border-[#dfc0b7]/40 shadow-xs">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { key: 'all', label: `All (${totalVows})` },
                { key: 'brahma', label: t(lang, 'brahmaSlot') },
                { key: 'pratah', label: t(lang, 'pratahSlot') },
                { key: 'madhyahna', label: t(lang, 'madhyahnaSlot') },
                { key: 'sayam', label: t(lang, 'sayamSlot') },
                { key: 'ratri', label: t(lang, 'ratriSlot') },
              ].map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setSelectedSlot(filter.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedSlot === filter.key
                      ? 'bg-[#8b2500] text-white shadow-xs'
                      : 'bg-[#f0ede9] text-[#58423b] hover:bg-[#ebe8e3]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center pr-2">
              <span className="font-serif text-[10px] text-[#58423b] uppercase font-bold">Sorted:</span>
              <span className="text-xs text-[#641800] font-bold">Chronological</span>
            </div>
          </div>

          {/* Resolutions Checklist Cards */}
          <div className="flex flex-col gap-3">
            {filteredVows.map((vow) => {
              const isCompleted = todayLog.completedVowIds ? todayLog.completedVowIds.includes(vow.id) : false;

              return (
                <div
                  key={vow.id}
                  className={`group bg-[#ffffff] hover:bg-[#f6f3ee]/60 transition-all duration-200 rounded-2xl p-4 border border-[#dfc0b7]/40 shadow-xs flex flex-col gap-3 ${
                    isCompleted ? 'border-[#00553c]/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleVow(currentDay, vow.id)}
                        className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all shadow-xs ${
                          isCompleted
                            ? 'bg-[#003c29] text-white'
                            : 'bg-[#ebe8e3] hover:bg-[#ffdcc3] text-[#1c1c19]'
                        }`}
                        aria-label={isCompleted ? `Mark ${vow.title} as pending` : `Mark ${vow.title} as completed`}
                      >
                        <span className={`material-symbols-outlined text-base ${isCompleted ? '' : 'opacity-30 group-hover:opacity-100'}`}>
                          check
                        </span>
                      </button>

                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#58423b] font-medium">
                          <span className="font-bold text-[#641800]">{vow.category}</span>
                          <span aria-hidden="true">•</span>
                          <span>{vow.timeLabel}</span>
                          <span aria-hidden="true">•</span>
                          <span className="text-[#003c29] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#fe932c]">local_fire_department</span>
                            {vow.streakDays}-Day Streak
                          </span>
                        </div>

                        <h4
                          className={`font-serif text-base text-[#1c1c19] font-bold mt-1 ${
                            isCompleted ? 'line-through decoration-[#003c29]/60 opacity-80' : ''
                          }`}
                        >
                          {vow.title}
                        </h4>

                        <p className="text-xs text-[#58423b] mt-0.5">{vow.tip}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className={`text-[11px] font-bold uppercase ${isCompleted ? 'text-[#003c29]' : 'text-[#6e3900]'}`}>
                        {isCompleted ? 'Completed' : 'Active'}
                      </span>
                      <span className="font-mono text-[11px] text-[#58423b] mt-1">
                        {isCompleted ? 'Logged' : `Due: ${vow.reminderTime}`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#f6f3ee] px-3 py-2 rounded-xl flex items-center justify-between text-xs text-[#58423b]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#fe932c] text-base">lightbulb</span>
                      <span className="italic">"{vow.tip}"</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleVow(currentDay, vow.id)}
                      className="font-bold text-[#641800] hover:text-[#fe932c] transition-colors"
                    >
                      {isCompleted ? 'Mark Pending' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Willpower Gauge, Sheets Monitor, Milestones (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          {/* Active Resolution Switcher */}
          <div className="bg-[#ffffff] border border-[#dfc0b7]/40 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-[11px] text-[#904d00] uppercase font-bold">
                {t(lang, 'activeSystem')}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#003c29]"></span>
            </div>

            <div className="bg-[#f6f3ee] p-3 rounded-xl flex items-center justify-between border border-[#dfc0b7]/30">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#8b2500] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  108
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-[#1c1c19] font-bold truncate">
                    100-Day Supreme Mindful Discipline
                  </span>
                  <span className="text-[11px] text-[#58423b]">Vow Cycle #1 (Started Sep 07)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Willpower Radial Gauge */}
          <div className="bg-[#ffffff] border border-[#dfc0b7]/40 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center gap-3 relative overflow-hidden">
            <div className="w-full flex items-center justify-between">
              <span className="font-serif text-[11px] text-[#904d00] uppercase font-bold">
                {t(lang, 'willpowerGauge')}
              </span>
              <span className="text-xs text-[#003c29] font-bold">Today {completionPercent}%</span>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center my-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle className="text-[#ebe8e3]" cx="60" cy="60" fill="none" r="50" stroke="currentColor" strokeWidth="10" />
                <circle
                  className="text-[#fe932c]"
                  cx="60"
                  cy="60"
                  fill="none"
                  r="50"
                  stroke="currentColor"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  strokeWidth="10"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-3xl text-[#641800] font-bold leading-none">{completionPercent}%</span>
                <span className="font-serif text-[9px] text-[#58423b] uppercase mt-1">Tapas Level</span>
                <span className="text-[11px] text-[#003c29] font-bold">
                  {completionPercent >= 80 ? 'High Flow' : completionPercent >= 50 ? 'Steady Focus' : 'In Progress'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#58423b] leading-relaxed">
              With an unbroken {currentStreak}-day streak over {currentDay} days, your willpower cadence remains optimal.
            </p>

            <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-[#dfc0b7]/30">
              <div className="bg-[#f6f3ee] p-2 rounded-xl flex flex-col items-center">
                <span className="font-serif text-[9px] text-[#58423b] uppercase">STREAK</span>
                <span className="text-sm text-[#641800] font-bold">{currentStreak} Days</span>
              </div>
              <div className="bg-[#f6f3ee] p-2 rounded-xl flex flex-col items-center">
                <span className="font-serif text-[9px] text-[#58423b] uppercase">DONE</span>
                <span className="text-sm text-[#904d00] font-bold">
                  {totalMetrics.completedCount}/{totalMetrics.totalPossible}
                </span>
              </div>
              <div className="bg-[#f6f3ee] p-2 rounded-xl flex flex-col items-center">
                <span className="font-serif text-[9px] text-[#58423b] uppercase">RECOVERY</span>
                <span className="text-sm text-[#003c29] font-bold">0 Breaks</span>
              </div>
            </div>
          </div>

          {/* Live Vercel / Excel Sheets Monitor */}
          <div className="bg-[#ffffff] border border-[#dfc0b7]/40 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#904d00] text-lg">table_view</span>
                <span className="font-sans text-xs text-[#1c1c19] font-bold">{t(lang, 'sheetsMonitor')}</span>
              </div>
              <span className="text-[10px] font-bold text-[#003c29] uppercase">ONLINE SYNC</span>
            </div>

            <div className="flex flex-col gap-2 font-mono text-[11px]">
              <div className="bg-[#f6f3ee] p-2 rounded-lg flex items-center justify-between">
                <span className="text-[#1c1c19] font-bold">Sheet: Resolution_Systems</span>
                <span className="text-[#58423b]">{db.systems?.length || 2} rows</span>
              </div>
              <div className="bg-[#f6f3ee] p-2 rounded-lg flex items-center justify-between">
                <span className="text-[#1c1c19] font-bold">Sheet: Sankalp_Registry</span>
                <span className="text-[#904d00] font-bold">{totalVows} active vows</span>
              </div>
              <div className="bg-[#f6f3ee] p-2 rounded-lg flex items-center justify-between">
                <span className="text-[#1c1c19] font-bold">Sheet: Daily_Logs_2024</span>
                <span className="text-[#003c29] font-bold">{Object.keys(db.dailyLogs || {}).length} telemetry rows</span>
              </div>
            </div>
          </div>

          {/* Upcoming Milestone */}
          <div className="bg-gradient-to-br from-[#ffdcc3]/40 to-[#ffffff] border border-[#dfc0b7]/50 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-[11px] text-[#904d00] uppercase font-bold">
                {t(lang, 'upcomingMilestone')}
              </span>
              <span className="px-2 py-0.5 rounded bg-white text-xs font-bold text-[#641800]">
                Day 51
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffffff] flex items-center justify-center text-[#904d00] shadow-xs shrink-0">
                <span className="material-symbols-outlined text-2xl">military_tech</span>
              </div>
              <div className="flex flex-col">
                <h5 className="font-serif text-sm text-[#641800] font-bold">{t(lang, 'day51Title')}</h5>
                <span className="text-xs text-[#58423b]">{51 - currentDay} Days Remaining</span>
              </div>
            </div>

            <div className="w-full bg-[#ebe8e3] rounded-full h-2 overflow-hidden mt-1">
              <div
                className="bg-[#fe932c] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((currentDay / 51) * 100))}%` }}
              ></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
