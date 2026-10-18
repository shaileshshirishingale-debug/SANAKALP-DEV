import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DailySadhana } from './components/DailySadhana';
import { MatrixGrid } from './components/MatrixGrid';
import { AnalyticsInsights } from './components/AnalyticsInsights';
import { SiddhiCertificate } from './components/SiddhiCertificate';
import { NewSankalpModal } from './components/NewSankalpModal';
import { ImportModal } from './components/ImportModal';
import { Toast } from './components/Toast';
import { DatabaseSchema, Language, TimeSlotKey } from './types';

import { triggerCelebration, playCompletionChime } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('daily-tracker');
  const [lang, setLang] = useState<Language>('EN');
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; icon?: string } | null>(null);

  const [db, setDb] = useState<DatabaseSchema | null>(null);

  const showToast = useCallback((message: string, icon = 'check_circle') => {
    setToast({ message, icon });
  }, []);

  // Fetch Database from Express / Vercel Blob JSON backend
  const fetchDatabase = useCallback(async () => {
    try {
      const res = await fetch('/api/blob/db');
      const data = await res.json();
      if (data.success && data.db) {
        setDb(data.db);
      }
    } catch (err) {
      console.error('Error fetching database:', err);
    }
  }, []);

  useEffect(() => {
    fetchDatabase();
  }, [fetchDatabase]);

  const handleToggleVow = async (dayNumber: number, vowId: string) => {
    try {
      const res = await fetch('/api/blob/sankalp/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber, vowId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDatabase();
        if (data.isCompleted) {
          triggerCelebration();
          playCompletionChime();
          showToast('🎉 Resolution Fulfilled! Victory sound & confetti!', 'celebration');
        } else {
          showToast('Resolution marked pending', 'info');
        }
      }
    } catch (err) {
      console.error('Error toggling vow:', err);
    }
  };

  const handleCreateVow = async (vowData: {
    title: string;
    category: string;
    timeSlot: TimeSlotKey;
    reminderTime: string;
    durationMins: number;
    tip: string;
  }) => {
    try {
      const res = await fetch('/api/blob/sankalp/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vowData),
      });
      const data = await res.json();
      if (data.success) {
        fetchDatabase();
        showToast(`New resolution "${vowData.title}" written to Vercel Blob JSON!`, 'cloud_done');
      }
    } catch (err) {
      console.error('Error creating vow:', err);
    }
  };

  const handleSaveJournal = async (rating: number, mood: string, note: string) => {
    try {
      const currentDay = db?.systems?.find((s) => s.active)?.currentDay || 42;
      await fetch('/api/blob/journal/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: currentDay,
          mindfulnessRating: rating,
          innerState: mood,
          journalNote: note,
        }),
      });
      fetchDatabase();
    } catch (err) {
      console.error('Error saving journal:', err);
    }
  };

  const handleSwitchSystem = async (systemId: string) => {
    try {
      const res = await fetch('/api/blob/system/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDatabase();
        showToast('Switched resolution system!', 'swap_horiz');
      }
    } catch (err) {
      console.error('Error switching system:', err);
    }
  };

  const handleUpdateSeekerName = async (newName: string) => {
    try {
      const res = await fetch('/api/blob/seeker/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seekerName: newName }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDatabase();
        showToast(`Seeker name updated to ${data.seekerName}`, 'badge');
      }
    } catch (err) {
      console.error('Error updating seeker name:', err);
    }
  };

  const handleResetDatabase = async () => {
    try {
      const res = await fetch('/api/blob/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchDatabase();
        showToast('Database reset to baseline state.', 'restart_alt');
      }
    } catch (err) {
      console.error('Error resetting database:', err);
    }
  };

  const handleExportExcel = () => {
    window.location.href = '/api/blob/export/excel';
    showToast('Exporting sankalp_database.xlsx...', 'download_done');
  };

  if (!db) {
    return (
      <div className="min-h-screen bg-[#fcf9f4] flex flex-col items-center justify-center text-[#641800] gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-[#8b2500] border-t-transparent animate-spin"></div>
        <span className="font-serif text-sm font-bold">Syncing Vercel Blob JSON Database...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f4] text-[#1c1c19] min-h-screen flex flex-col selection:bg-[#ffdcc3] selection:text-[#6e3900]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        dbSynced={true}
        dbSizeKb={db.blobSizeKb || 12.4}
        db={db}
        onSwitchSystem={handleSwitchSystem}
      />

      {/* Main Content Area */}
      <main className="w-full pt-28 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto flex-1">
        {activeTab === 'daily-tracker' && (
          <DailySadhana
            db={db}
            lang={lang}
            onToggleVow={handleToggleVow}
            onSaveJournal={handleSaveJournal}
            onExportExcel={handleExportExcel}
            onOpenNewModal={() => setIsNewModalOpen(true)}
            onShowToast={showToast}
            onResetDatabase={handleResetDatabase}
          />
        )}

        {activeTab === '100-day-matrix' && (
          <MatrixGrid
            db={db}
            lang={lang}
            onExportExcel={handleExportExcel}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsInsights
            db={db}
            lang={lang}
            onExportExcel={handleExportExcel}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'siddhi-certificate' && (
          <SiddhiCertificate
            db={db}
            lang={lang}
            onExportExcel={handleExportExcel}
            onShowToast={showToast}
            onUpdateSeekerName={handleUpdateSeekerName}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f6f3ee] border-t border-[#dfc0b7]/40 py-8 mt-12">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[#58423b] text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8b2500] text-white flex items-center justify-center font-serif font-bold text-sm">
              ॐ
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm text-[#641800]">My Sankalp 108</span>
              <span className="font-serif italic text-[11px] text-[#58423b]">
                "Patience, forgiveness, self-restraint, honesty, purity, and sensory discipline — firmness in resolve, peace within."
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <button type="button" onClick={() => setActiveTab('daily-tracker')} className="hover:text-[#641800]">
              Daily Sadhana
            </button>
            <button type="button" onClick={() => setActiveTab('100-day-matrix')} className="hover:text-[#641800]">
              100-Day Matrix
            </button>
            <button type="button" onClick={() => setActiveTab('analytics')} className="hover:text-[#641800]">
              Analytics & Insights
            </button>
            <button type="button" onClick={() => setActiveTab('siddhi-certificate')} className="hover:text-[#641800]">
              Siddhi Certificate
            </button>
          </div>

          <div className="text-right">
            <p className="font-serif font-bold text-[#904d00] uppercase">Sacred Cadence © 2025</p>
            <p className="text-[11px] text-[#58423b]">Self-Discipline Engine • Vercel Blob JSON Synced</p>
          </div>
        </div>
      </footer>

      {/* Modals & Toast */}
      <NewSankalpModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateVow}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={fetchDatabase}
        onShowToast={showToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          icon={toast.icon}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
