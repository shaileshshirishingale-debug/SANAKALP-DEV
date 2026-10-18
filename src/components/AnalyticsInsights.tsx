import React, { useState } from 'react';
import { DatabaseSchema, Language } from '../types';
import { t } from '../i18n';
import {
  calculateStreak,
  calculateCompletionMetrics,
  calculateMindfulnessIndex,
  calculateCategoryDistribution,
  calculateSlotEfficacy,
} from '../utils/calculations';

interface AnalyticsInsightsProps {
  db: DatabaseSchema;
  lang: Language;
  onExportExcel: () => void;
  onOpenImportModal: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({
  db,
  lang,
  onExportExcel,
  onOpenImportModal,
  onShowToast,
}) => {
  const [rangeMode, setRangeMode] = useState<'current' | 'full'>('current');
  const [activeSheet, setActiveSheet] = useState<'DailyLogs' | 'Sankalps' | 'Systems'>('DailyLogs');

  const activeVows = db.sankalps ? db.sankalps.filter((s) => s.active) : [];
  const totalVows = activeVows.length;
  const currentDay = db.systems?.find((s) => s.active)?.currentDay || 42;

  // Dynamic calculations
  const currentStreak = calculateStreak(db.dailyLogs, currentDay);
  const completionMetrics = calculateCompletionMetrics(db.dailyLogs, totalVows, currentDay);
  const mindfulness = calculateMindfulnessIndex(db.dailyLogs, currentDay);
  const categoryDist = calculateCategoryDistribution(db.sankalps);
  const slotEfficacy = calculateSlotEfficacy(db.dailyLogs, db.sankalps, currentDay);

  const logsList = Object.values(db.dailyLogs || {}).slice(0, currentDay);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Telemetry & Controls Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fe932c]"></span>
            <span className="font-serif text-xs text-[#904d00] uppercase font-bold tracking-wider">
              Telemetry & Insights
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#ebe8e3] text-[#58423b] font-serif text-[10px] font-bold">
              VERCEL BLOB REAL-TIME SYNC
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <h1 className="font-serif text-2xl text-[#641800] font-bold tracking-tight">
              Analytics & Insights
            </h1>
            <span className="font-serif text-base text-[#58423b] font-normal">
              | Tapasya Analytics
            </span>
          </div>
          <p className="text-xs text-[#58423b] mt-0.5">
            Scientific and spiritual progress report for 100-day discipline | Validated via automated Vercel Blob Excel Database.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#f6f3ee] p-1 rounded-xl border border-[#dfc0b7]/30 shadow-xs">
            <button
              type="button"
              onClick={() => setRangeMode('current')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rangeMode === 'current'
                  ? 'bg-[#ffffff] text-[#641800] shadow-xs'
                  : 'text-[#58423b] hover:text-[#1c1c19]'
              }`}
            >
              Days 1–{currentDay} (Current)
            </button>
            <button
              type="button"
              onClick={() => setRangeMode('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rangeMode === 'full'
                  ? 'bg-[#ffffff] text-[#641800] shadow-xs'
                  : 'text-[#58423b] hover:text-[#1c1c19]'
              }`}
            >
              Full 100 Days
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00553c] text-white hover:bg-[#003c29] text-xs font-bold shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-base">file_upload</span>
            <span>Import Dataset (.xlsx / .csv)</span>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8b2500] text-white hover:bg-[#641800] text-xs font-bold shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Export Excel DB (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Streak */}
        <div className="relative bg-[#ffffff] border border-[#dfc0b7]/40 p-5 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#ffdcc3]/40 blur-2xl pointer-events-none"></div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-serif text-[10px] text-[#904d00] uppercase font-bold">
                Current Streak
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-sans text-3xl font-extrabold text-[#641800]">{currentStreak}</span>
                <span className="font-serif text-sm text-[#1c1c19]">Days</span>
                <span className="text-lg">🔥</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ffdcc3] flex items-center justify-center text-[#2f1500]">
              <span className="material-symbols-outlined text-xl">local_fire_department</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#dfc0b7]/20 flex items-center justify-between text-xs text-[#58423b]">
            <span className="flex items-center gap-1 text-[#003c29] font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              Unbroken Flow
            </span>
            <span className="font-serif text-[10px] uppercase font-bold">Target: 100</span>
          </div>
        </div>

        {/* Card 2: Total Resolutions */}
        <div className="relative bg-[#ffffff] border border-[#dfc0b7]/40 p-5 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-serif text-[10px] text-[#904d00] uppercase font-bold">
                Total Resolutions Completed
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-sans text-3xl font-extrabold text-[#003c29]">
                  {completionMetrics.completedCount}
                </span>
                <span className="text-xs text-[#58423b] font-medium">/ {completionMetrics.totalPossible}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#00553c] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">task_alt</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#dfc0b7]/20 flex items-center justify-between text-xs">
            <div className="w-full bg-[#ebe8e3] rounded-full h-1.5 overflow-hidden mr-3">
              <div
                className="bg-[#003c29] h-full rounded-full transition-all duration-300"
                style={{ width: `${completionMetrics.percent}%` }}
              ></div>
            </div>
            <span className="font-bold text-[#003c29]">{completionMetrics.percent}%</span>
          </div>
        </div>

        {/* Card 3: Mindfulness Index */}
        <div className="relative bg-[#ffffff] border border-[#dfc0b7]/40 p-5 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-serif text-[10px] text-[#904d00] uppercase font-bold">
                Mindfulness Index
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-sans text-3xl font-extrabold text-[#641800]">{mindfulness.formatted}</span>
                <span className="text-xs text-[#58423b]">/ 5.0</span>
                <span className="text-[#fe932c]">★</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ebe8e3] flex items-center justify-center text-[#904d00]">
              <span className="material-symbols-outlined text-xl">self_improvement</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#dfc0b7]/20 flex items-center justify-between text-xs text-[#58423b]">
            <span className="px-2 py-0.5 rounded bg-[#ffdcc3] text-[#6e3900] font-serif text-[10px] font-bold">
              {mindfulness.average >= 4.0 ? 'High Flow State' : 'Steady Focus'}
            </span>
            <span className="font-medium">{mindfulness.count} Entries Logged</span>
          </div>
        </div>

        {/* Card 4: Excel DB Health */}
        <div className="relative bg-[#ffffff] border border-[#dfc0b7]/40 p-5 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-serif text-[10px] text-[#904d00] uppercase font-bold">
                Excel DB Health
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-[#1c1c19] font-bold truncate max-w-[150px]">
                  sankalp_db.xlsx
                </span>
                <span className="w-2 h-2 rounded-full bg-[#003c29]"></span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ebe8e3] flex items-center justify-center text-[#641800]">
              <span className="material-symbols-outlined text-xl">table_chart</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#dfc0b7]/20 flex items-center justify-between text-xs text-[#58423b]">
            <span className="text-[11px]">{db.blobSizeKb || 12.4} KB • 4 Sheets</span>
            <span className="font-serif text-[10px] text-[#003c29] font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">sync_saved_locally</span>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Data Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 100-Day Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[#ffffff] border border-[#dfc0b7]/40 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#904d00] text-xl">show_chart</span>
                <h2 className="font-serif text-lg text-[#1c1c19] font-bold">
                  100-Day Siddhi Rate & Cadence Trend (Completion Trend)
                </h2>
              </div>
              <p className="text-xs text-[#58423b] mt-0.5">
                Daily stability and discipline trajectory from Day 1 to {currentDay} (Milestones at Day 21 & Day {currentDay})
              </p>
            </div>
          </div>

          {/* SVG Area Line Chart */}
          <div className="relative w-full h-[260px] mt-2 flex flex-col justify-end">
            <svg className="w-full h-[220px] overflow-visible pl-10 z-10" preserveAspectRatio="none" viewBox="0 0 700 240">
              <defs>
                <linearGradient id="saffronGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fe932c" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#904d00" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#fcf9f4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#641800" />
                  <stop offset="50%" stopColor="#904d00" />
                  <stop offset="100%" stopColor="#fe932c" />
                </linearGradient>
              </defs>

              {/* Shaded future guide */}
              <rect x="294" y="0" width="406" height="240" fill="#ebe8e3" opacity="0.3" />
              <line x1="294" y1="0" x2="294" y2="240" stroke="#8b716a" strokeDasharray="4 4" opacity="0.5" />

              {/* Area Path */}
              <path
                d="M 0 170 C 30 160, 50 140, 70 130 C 90 120, 110 90, 147 60 C 180 80, 210 50, 240 40 C 265 35, 280 30, 294 24 L 294 240 L 0 240 Z"
                fill="url(#saffronGrad)"
              />

              {/* Main Line */}
              <path
                d="M 0 170 C 30 160, 50 140, 70 130 C 90 120, 110 90, 147 60 C 180 80, 210 50, 240 40 C 265 35, 280 30, 294 24"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Milestone 21 Marker */}
              <g transform="translate(147, 60)">
                <circle r="6" fill="#00553c" />
                <line x1="0" y1="8" x2="0" y2="180" stroke="#00553c" strokeDasharray="3 3" strokeWidth="1.5" />
              </g>

              {/* Milestone Current Day Marker */}
              <g transform="translate(294, 24)">
                <circle r="7" fill="#fe932c" />
                <line x1="0" y1="8" x2="0" y2="216" stroke="#904d00" strokeDasharray="3 3" strokeWidth="1.5" />
              </g>

              {/* Projected Future */}
              <path d="M 294 24 C 360 20, 480 18, 700 12" fill="none" stroke="#8b716a" strokeDasharray="6 6" strokeWidth="2" />
            </svg>

            {/* X-Axis Labels */}
            <div className="w-full flex justify-between pl-10 text-[11px] text-[#58423b] font-medium mt-2">
              <span>Day 1 (Initiation)</span>
              <span className="text-[#003c29] font-bold">Day 21 (Habit)</span>
              <span className="text-[#904d00] font-bold">Day {currentDay} (Today)</span>
              <span>Day 60</span>
              <span>Day 80</span>
              <span className="text-[#641800] font-bold">Day 100 (Siddhi)</span>
            </div>
          </div>
        </div>

        {/* Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-[#ffffff] border border-[#dfc0b7]/40 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#904d00] text-xl">pie_chart</span>
                <h2 className="font-serif text-base text-[#1c1c19] font-bold">Resolution Breakdown</h2>
              </div>
              <p className="text-xs text-[#58423b]">Category Distribution</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#f6f3ee] text-[#641800] font-serif text-[10px] font-bold">
              {totalVows} VOWS
            </span>
          </div>

          {/* Donut Chart SVG */}
          <div className="relative w-full flex items-center justify-center my-3">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f0ede9" strokeWidth="14" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#641800" strokeWidth="14" strokeDasharray="71.6 238.8" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#00553c" strokeWidth="14" strokeDasharray="59.7 238.8" strokeDashoffset="-71.6" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#fe932c" strokeWidth="14" strokeDasharray="47.7 238.8" strokeDashoffset="-131.3" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#904d00" strokeWidth="14" strokeDasharray="35.8 238.8" strokeDashoffset="-179" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#dfc0b7" strokeWidth="14" strokeDasharray="23.9 238.8" strokeDashoffset="-214.8" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-serif text-2xl font-bold text-[#641800]">100%</span>
              <span className="font-serif text-[9px] text-[#58423b] uppercase">Holistic Balance</span>
            </div>
          </div>

          {/* Dynamic Category Legend */}
          <div className="flex flex-col gap-1.5 pt-2 text-xs">
            {categoryDist.map((cat, idx) => {
              const colors = ['bg-[#641800]', 'bg-[#00553c]', 'bg-[#fe932c]', 'bg-[#904d00]', 'bg-[#dfc0b7]'];
              return (
                <div key={cat.category} className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`}></span>
                    <span>{cat.category}</span>
                  </span>
                  <span className="font-bold text-[#1c1c19]">{cat.percentage}% ({cat.count})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vertical Time-Slot Efficacy Chart */}
      <div className="bg-[#ffffff] border border-[#dfc0b7]/40 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#904d00] text-xl">schedule</span>
              <h2 className="font-serif text-base text-[#1c1c19] font-bold">Time-Slot Efficacy Rate</h2>
            </div>
            <span className="font-serif text-[11px] text-[#003c29] font-bold">Active Cadence</span>
          </div>
          <p className="text-xs text-[#58423b] mb-6">
            Comparative success rate of resolutions across distinct periods of the day
          </p>
        </div>

        <div className="grid grid-cols-5 gap-3 items-end h-48 pb-2">
          {slotEfficacy.map((bar, idx) => {
            const barColors = ['bg-[#00553c]', 'bg-[#fe932c]', 'bg-[#ebe8e3]', 'bg-[#8b2500]', 'bg-[#e5e2dd]'];
            return (
              <div key={bar.slot} className="flex flex-col items-center h-full justify-end group">
                <span className="text-xs font-bold text-[#1c1c19] mb-1">{bar.percentage}%</span>
                <div className="w-full bg-[#f6f3ee] rounded-t-xl h-full flex items-end overflow-hidden p-1">
                  <div
                    className={`w-full ${barColors[idx % barColors.length]} rounded-lg transition-all`}
                    style={{ height: `${Math.max(10, bar.percentage)}%` }}
                  ></div>
                </div>
                <span className="font-serif text-[10px] text-center font-bold text-[#1c1c19] mt-2 leading-tight">
                  {bar.label}<br />
                  <span className="text-[#58423b] font-normal">{bar.time}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Excel Database Explorer (.xlsx preview) */}
      <section className="bg-[#ffffff] border border-[#dfc0b7]/40 rounded-2xl shadow-xs p-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#dfc0b7]/30 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#904d00] text-xl">dataset</span>
              <h2 className="font-serif text-lg text-[#1c1c19] font-bold">
                Excel Database Explorer (data/sankalp_database.xlsx)
              </h2>
            </div>
            <p className="text-xs text-[#58423b]">
              Live preview of Vercel Blob JSON backed Excel spreadsheet | {logsList.length} Entries Compiled
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#f6f3ee] p-1 rounded-xl border border-[#dfc0b7]/30">
              {(['DailyLogs', 'Sankalps', 'Systems'] as const).map((sheet) => (
                <button
                  key={sheet}
                  type="button"
                  onClick={() => setActiveSheet(sheet)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeSheet === sheet ? 'bg-[#ffffff] text-[#641800] shadow-xs' : 'text-[#58423b]'
                  }`}
                >
                  {sheet}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8b2500] text-white hover:bg-[#641800] text-xs font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-base">file_download</span>
              <span>.xlsx Download</span>
            </button>
          </div>
        </div>

        {/* Table Preview */}
        <div className="w-full overflow-x-auto rounded-xl bg-[#f6f3ee]/50 border border-[#dfc0b7]/30">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#ebe8e3] text-[#1c1c19] font-serif text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Day #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vows Count</th>
                <th className="py-3 px-4">Mindfulness</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfc0b7]/20">
              {logsList.slice(0, 10).map((log) => (
                <tr key={log.dayNumber} className="hover:bg-[#ffffff] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#641800]">
                    Day {String(log.dayNumber).padStart(3, '0')}
                  </td>
                  <td className="py-3 px-4 text-[#1c1c19]">{log.dateStr}</td>
                  <td className="py-3 px-4 text-[#003c29] font-bold">
                    {log.completedVowIds?.length || 0} / {totalVows}
                  </td>
                  <td className="py-3 px-4 text-[#fe932c] font-bold">
                    {log.mindfulnessRating ? `${log.mindfulnessRating} / 5.0 ⭐` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">{log.innerState}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full font-serif text-[10px] font-bold uppercase ${
                        log.status === 'Fulfilled' ? 'bg-[#97f5cc] text-[#002115]' : 'bg-[#ffdcc3] text-[#6e3900]'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
