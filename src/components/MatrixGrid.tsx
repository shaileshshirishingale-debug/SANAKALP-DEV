import React, { useState } from 'react';
import { DatabaseSchema, Language, DailyLogEntry } from '../types';
import { t } from '../i18n';

interface MatrixGridProps {
  db: DatabaseSchema;
  lang: Language;
  onExportExcel: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  db,
  lang,
  onExportExcel,
  onShowToast,
}) => {
  const currentDay = db.systems?.find((s) => s.active)?.currentDay || 42;
  const [selectedDayNum, setSelectedDayNum] = useState<number>(currentDay);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedLog: DailyLogEntry = db.dailyLogs[selectedDayNum] || {
    dayNumber: selectedDayNum,
    dateStr: `Day ${selectedDayNum}`,
    completedVowIds: [],
    mindfulnessRating: 0,
    innerState: 'Pending',
    journalNote: `Scheduled practice for Day ${selectedDayNum}.`,
    status: 'Pending',
    excelRowRef: `DailyLogs!A${selectedDayNum + 1}:H${selectedDayNum + 1}`,
    syncedAt: '',
  };

  const completedCount = selectedLog.completedVowIds?.length || 0;
  const totalVowsCount = db.sankalps?.filter((s) => s.active).length || 7;

  // Filter logs for Table View
  const logsList = Object.values(db.dailyLogs || {})
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .filter((log) => {
      if (!searchQuery) return true;
      return (
        String(log.dayNumber).includes(searchQuery) ||
        log.dateStr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.journalNote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.innerState?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Banner & Milestones */}
      <section className="w-full flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#904d00] uppercase tracking-wider">
              <span>Sadhana Path</span>
              <span>/</span>
              <span>100-Day Tapasya Matrix</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#6e3900] font-sans text-[10px]">Cycle 1</span>
            </div>
            <h2 className="font-serif text-2xl text-[#641800] font-bold tracking-tight mt-1">
              100-Day Resolution Journey Grid
              <span className="font-serif text-base text-[#58423b] font-normal block sm:inline sm:ml-2">
                (Interactive Sadhana Matrix)
              </span>
            </h2>
            <p className="text-xs text-[#58423b] mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#003c29]"></span>
              <span>
                Unbroken discipline and self-mastery 100-day journey • Current Day:{' '}
                <strong className="text-[#641800] font-bold">{currentDay} / 100</strong> ({currentDay}% Complete)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="flex items-center bg-[#f6f3ee] p-1 rounded-xl shadow-xs border border-[#dfc0b7]/30">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-[#ffffff] text-[#641800] shadow-xs' : 'text-[#58423b] hover:text-[#1c1c19]'
                }`}
              >
                <span className="material-symbols-outlined text-base">grid_view</span>
                <span>Grid View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-[#ffffff] text-[#641800] shadow-xs' : 'text-[#58423b] hover:text-[#1c1c19]'
                }`}
              >
                <span className="material-symbols-outlined text-base">table_rows</span>
                <span>History Table</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onExportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8b2500] text-white hover:bg-[#641800] shadow-xs transition-all text-xs font-bold"
            >
              <span className="material-symbols-outlined text-base">download_for_offline</span>
              <span>Export Excel Log (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 4 Sacred Milestone Progression Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Phase 1: Day 21 */}
          <div className="bg-[#ffffff] border border-[#dfc0b7]/40 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#97f5cc]/30 flex items-center justify-center text-[#003c29]">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#97f5cc] text-[#002115] font-serif text-[10px] font-bold">
                {currentDay >= 21 ? '✅ UNLOCKED' : '🔒 LOCKED'}
              </span>
            </div>
            <div className="mt-3">
              <span className="font-serif text-[11px] text-[#904d00] font-bold">Phase 1 • Day 21</span>
              <h4 className="font-serif text-sm text-[#1c1c19] font-bold">Habit Formation</h4>
              <p className="text-xs text-[#58423b] mt-0.5">21 days of continuous resolution fulfilled effortlessly.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#dfc0b7]/20 flex justify-between text-[11px] text-[#003c29] font-bold">
              <span>Success Rate: 95.2%</span>
              <span className="text-[#58423b]">{currentDay >= 21 ? 'Day 21 Achieved' : 'In Progress'}</span>
            </div>
          </div>

          {/* Phase 2: Day 51 */}
          <div className="bg-[#ffffff] border-2 border-[#fe932c] p-4 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#ffdcc3] flex items-center justify-center text-[#6e3900]">
                <span className="material-symbols-outlined text-xl">hourglass_top</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#6e3900] font-serif text-[10px] font-bold animate-pulse">
                {currentDay >= 51 ? '✅ UNLOCKED' : `⏳ IN PROGRESS - ${51 - currentDay} DAYS LEFT`}
              </span>
            </div>
            <div className="mt-3">
              <span className="font-serif text-[11px] text-[#904d00] font-bold">Phase 2 • Day 51</span>
              <h4 className="font-serif text-sm text-[#1c1c19] font-bold">Mental Fortitude</h4>
              <p className="text-xs text-[#58423b] mt-0.5">Fortification of sensory restraint and concentration.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#dfc0b7]/20 flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-bold text-[#58423b]">
                <span>Day {currentDay} / 51</span>
                <span className="text-[#fe932c]">{Math.round((currentDay / 51) * 100)}% Progress</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#ebe8e3] overflow-hidden">
                <div className="h-full bg-[#fe932c] rounded-full" style={{ width: `${Math.min(100, (currentDay / 51) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Phase 3: Day 75 */}
          <div className="bg-[#ffffff] border border-[#dfc0b7]/30 p-4 rounded-2xl shadow-xs flex flex-col justify-between opacity-85">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#f6f3ee] flex items-center justify-center text-[#58423b]">
                <span className="material-symbols-outlined text-xl">{currentDay >= 75 ? 'verified' : 'lock'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ebe8e3] text-[#58423b] font-serif text-[10px]">
                {currentDay >= 75 ? '✅ UNLOCKED' : '🔒 LOCKED'}
              </span>
            </div>
            <div className="mt-3">
              <span className="font-serif text-[11px] text-[#58423b] font-bold">Phase 3 • Day 75</span>
              <h4 className="font-serif text-sm text-[#1c1c19] font-bold">Unshakable Will</h4>
              <p className="text-xs text-[#58423b] mt-0.5">Manifestation of austerity and inner radiance.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#dfc0b7]/20 text-[11px] text-[#58423b]">
              <span>Remaining: {Math.max(0, 75 - currentDay)} Days</span>
            </div>
          </div>

          {/* Phase 4: Day 100 */}
          <div className="bg-[#ffffff] border border-[#dfc0b7]/30 p-4 rounded-2xl shadow-xs flex flex-col justify-between opacity-85">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#f6f3ee] flex items-center justify-center text-[#641800]">
                <span className="material-symbols-outlined text-xl">military_tech</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdbd1] text-[#852300] font-serif text-[10px] font-bold">
                👑 MASTERY GOAL
              </span>
            </div>
            <div className="mt-3">
              <span className="font-serif text-[11px] text-[#852300] font-bold">Phase 4 • Day 100</span>
              <h4 className="font-serif text-sm text-[#1c1c19] font-bold">Supreme Siddhi</h4>
              <p className="text-xs text-[#58423b] mt-0.5">Fulfillment of the centennial vow and digital certificate.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#dfc0b7]/20 text-[11px] text-[#852300] font-bold">
              <span>Remaining: {Math.max(0, 100 - currentDay)} Days</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid View or Table View */}
      {viewMode === 'grid' ? (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* 10x10 Matrix Canvas (xl:col-span-8) */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="bg-[#ffffff] border border-[#dfc0b7]/40 p-5 rounded-2xl shadow-xs flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#dfc0b7]/30 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f6f3ee] flex items-center justify-center text-[#641800]">
                    <span className="material-symbols-outlined text-xl">window</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#1c1c19] font-bold">
                      10×10 Grand Grid (100-Day Sadhana Canvas)
                    </h3>
                    <p className="text-xs text-[#58423b]">
                      Each tile symbolizes a full day of tapasya. Click any day to inspect details.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase">Scope:</span>
                  <span className="px-2 py-0.5 rounded bg-[#f6f3ee] text-xs font-semibold text-[#1c1c19]">
                    Day 1 to 100 view
                  </span>
                </div>
              </div>

              {/* 10x10 Grid Container */}
              <div className="w-full overflow-x-auto py-4">
                <div className="min-w-[560px] grid grid-cols-10 gap-2.5 p-1">
                  {Array.from({ length: 100 }, (_, i) => {
                    const dayNum = i + 1;
                    const log = db.dailyLogs[dayNum];
                    const isToday = dayNum === currentDay;
                    const isSelected = selectedDayNum === dayNum;
                    const isMilestone = dayNum === 21 || dayNum === 51 || dayNum === 75 || dayNum === 100;
                    const isFulfilled = log && log.status === 'Fulfilled';
                    const isPartial = log && log.status === 'Partial';

                    let cellStyle = 'bg-[#f6f3ee] text-[#58423b] hover:bg-[#ebe8e3]';

                    if (isToday) {
                      cellStyle = 'bg-[#ffdcc3] text-[#2f1500] ring-4 ring-[#fe932c] shadow-md animate-pulse';
                    } else if (isFulfilled) {
                      cellStyle = 'bg-[#00553c] text-[#ffffff] hover:bg-[#003c29] shadow-xs';
                    } else if (isPartial) {
                      cellStyle = 'bg-[#fe932c] text-[#ffffff] hover:bg-[#904d00] shadow-xs';
                    }

                    if (isSelected) {
                      cellStyle += ' ring-2 ring-[#8b2500] scale-105 z-10';
                    }

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => setSelectedDayNum(dayNum)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all relative ${cellStyle}`}
                      >
                        {isToday ? (
                          <>
                            <span className="font-serif text-[9px] font-black text-[#641800]">TODAY</span>
                            <span className="font-sans text-xs font-bold text-[#641800]">{dayNum}</span>
                          </>
                        ) : isMilestone ? (
                          <>
                            <span className="font-serif text-[9px] font-bold">★ {dayNum}</span>
                            <span className="material-symbols-outlined text-sm">
                              {dayNum === 21 ? 'workspace_premium' : dayNum === 51 ? 'shield' : dayNum === 75 ? 'local_fire_department' : 'military_tech'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-serif text-[9px] opacity-75">D.{dayNum}</span>
                            {isFulfilled ? (
                              <span className="material-symbols-outlined text-xs">check</span>
                            ) : isPartial ? (
                              <span className="text-[9px] font-bold">88%</span>
                            ) : (
                              <span className="material-symbols-outlined text-xs opacity-30">lock</span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend Bar */}
              <div className="mt-4 pt-3 border-t border-[#dfc0b7]/30 flex flex-wrap items-center justify-between gap-3 text-xs text-[#58423b]">
                <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase">Legend:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#00553c]"></span>
                  <span>Fully Fulfilled (90-100%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#fe932c]"></span>
                  <span>Partial (75-89%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#ffdcc3] ring-2 ring-[#fe932c]"></span>
                  <span>Today Active (Day {currentDay})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#f6f3ee]"></span>
                  <span>Upcoming ({currentDay + 1}-100)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#8b2500] text-white flex items-center justify-center text-[8px]">★</span>
                  <span>Key Milestone</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Day Inspector Card & Sutra (xl:col-span-4) */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            {/* Inspector Card */}
            <div className="bg-[#ffffff] border border-[#dfc0b7]/40 p-5 rounded-2xl shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#dfc0b7]/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#ffdbd1] text-[#852300] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-base">verified_user</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase">
                      Daily Sadhana Inspection
                    </span>
                    <h3 className="font-serif text-base text-[#641800] font-bold">
                      Day {selectedDayNum} Inspection
                    </h3>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full font-serif text-[10px] font-bold uppercase ${
                    selectedLog.status === 'Fulfilled'
                      ? 'bg-[#97f5cc] text-[#002115]'
                      : selectedLog.status === 'In Progress' || selectedLog.status === 'Partial'
                      ? 'bg-[#ffdcc3] text-[#6e3900]'
                      : 'bg-[#f6f3ee] text-[#58423b]'
                  }`}
                >
                  {selectedLog.status}
                </span>
              </div>

              {/* Date & Excel Reference */}
              <div className="flex items-center justify-between bg-[#f6f3ee] px-3 py-2 rounded-xl text-xs text-[#58423b]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#fe932c]">event</span>
                  <span className="font-bold text-[#1c1c19]">{selectedLog.dateStr}</span>
                </div>
                <div className="font-mono text-[10px] text-[#003c29] font-bold">
                  {selectedLog.excelRowRef}
                </div>
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f6f3ee] p-3 rounded-xl flex flex-col">
                  <span className="font-serif text-[10px] text-[#58423b] font-bold uppercase">
                    Mindfulness
                  </span>
                  <div className="flex items-center text-[#fe932c] mt-1">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <span
                        key={st}
                        className="material-symbols-outlined text-base"
                        style={{
                          fontVariationSettings: `'FILL' ${st <= Math.floor(selectedLog.mindfulnessRating || 0) ? 1 : 0}`,
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#003c29] font-bold mt-1">
                    {selectedLog.mindfulnessRating || 0}/5 Score
                  </span>
                </div>

                <div className="bg-[#f6f3ee] p-3 rounded-xl flex flex-col">
                  <span className="font-serif text-[10px] text-[#58423b] font-bold uppercase">
                    Inner State
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-base">🧘</span>
                    <span className="text-xs font-bold text-[#1c1c19]">
                      {selectedLog.innerState || 'Pending'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#58423b] mt-1">Sattva Dominant</span>
                </div>
              </div>

              {/* Vow Compliance Checklist */}
              <div className="flex flex-col gap-2">
                <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase">
                  Vow Compliance Status ({completedCount}/{totalVowsCount} Fulfilled)
                </span>
                <div className="flex flex-col gap-1.5 bg-[#f6f3ee] p-3 rounded-xl">
                  {db.sankalps.filter((s) => s.active).map((vow) => {
                    const done = selectedLog.completedVowIds?.includes(vow.id);
                    return (
                      <div key={vow.id} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                          <span
                            className={`material-symbols-outlined text-sm ${
                              done ? 'text-[#003c29]' : 'text-[#58423b]/40'
                            }`}
                          >
                            {done ? 'check_circle' : 'cancel'}
                          </span>
                          <span className={done ? 'text-[#1c1c19]' : 'text-[#58423b]'}>
                            {vow.title}
                          </span>
                        </span>
                        <span
                          className={`font-serif text-[10px] font-bold ${
                            done ? 'text-[#003c29]' : 'text-[#58423b]'
                          }`}
                        >
                          {done ? 'Fulfilled' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Contemplation Reflection */}
              <div className="flex flex-col gap-1.5">
                <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase">
                  Reflection Note
                </span>
                <div className="bg-[#f6f3ee] p-3.5 rounded-xl relative overflow-hidden">
                  <p className="font-serif text-xs text-[#1c1c19] italic leading-relaxed">
                    "{selectedLog.journalNote}"
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Vedic Discipline Sutra Card */}
            <div className="bg-gradient-to-br from-[#f6f3ee] to-[#ffffff] border border-[#dfc0b7]/40 p-4 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fe932c] text-lg">self_improvement</span>
                <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase">
                  Daily Vedic Discipline Sutra
                </span>
              </div>
              <p className="font-serif text-xs text-[#641800] font-semibold leading-relaxed">
                "The mind alone is the cause of bondage and liberation."
              </p>
              <p className="text-[11px] text-[#58423b]">
                Patanjali Yoga Sutra • The 100-day sacred discipline is the art of mastering the mind into an obedient inner instrument.
              </p>
            </div>
          </div>
        </section>
      ) : (
        /* History Table View */
        <section className="w-full bg-[#ffffff] border border-[#dfc0b7]/40 rounded-2xl shadow-xs p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#dfc0b7]/30 gap-3">
            <div>
              <h3 className="font-serif text-lg text-[#1c1c19] font-bold">
                Resolution Log Database (Excel Sync Sheet)
              </h3>
              <p className="text-xs text-[#58423b]">
                Complete logs for all 100 days of the discipline cycle ({logsList.length} Records)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search day or reflections..."
                className="px-3 py-1.5 rounded-xl bg-[#f6f3ee] text-xs text-[#1c1c19] outline-none focus:ring-1 focus:ring-[#fe932c] border border-[#dfc0b7]/30"
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f6f3ee] text-[#58423b] font-serif text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Day</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Compliance</th>
                  <th className="py-3 px-4">Mindfulness</th>
                  <th className="py-3 px-4">Inner State</th>
                  <th className="py-3 px-4">Reflection Note</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Excel Row</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfc0b7]/20">
                {logsList.map((log) => (
                  <tr key={log.dayNumber} className="hover:bg-[#f6f3ee]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#641800]">
                      Day {String(log.dayNumber).padStart(3, '0')}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1c1c19]">{log.dateStr}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-serif text-[10px] font-bold ${
                          log.status === 'Fulfilled'
                            ? 'bg-[#97f5cc] text-[#002115]'
                            : log.status === 'In Progress' || log.status === 'Partial'
                            ? 'bg-[#ffdcc3] text-[#6e3900]'
                            : 'bg-[#ebe8e3] text-[#58423b]'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#904d00]">
                      {log.mindfulnessRating ? `${log.mindfulnessRating} / 5.0` : 'N/A'}
                    </td>
                    <td className="py-3 px-4">{log.innerState}</td>
                    <td className="py-3 px-4 text-[#58423b] truncate max-w-[280px]">
                      {log.journalNote}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-[#003c29] font-bold">
                      {log.excelRowRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
