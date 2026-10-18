import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DatabaseSchema, Language } from '../types';
import { t } from '../i18n';

interface SiddhiCertificateProps {
  db: DatabaseSchema;
  lang: Language;
  onExportExcel: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  onUpdateSeekerName?: (newName: string) => void;
}

export const SiddhiCertificate: React.FC<SiddhiCertificateProps> = ({
  db,
  lang,
  onExportExcel,
  onShowToast,
  onUpdateSeekerName,
}) => {
  const [seekerName, setSeekerName] = useState<string>(db.seekerName || 'ADITYA SHARMA');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const handleConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fe932c', '#8b2500', '#00553c', '#ffdcc3'],
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = () => {
    handleConfetti();
    onShowToast('Rendering High-Res Siddhi Certificate PNG...', 'image');
    setTimeout(() => {
      onShowToast('Downloaded: Siddhi_Certificate.png', 'download_done');
    }, 1500);
  };

  const handleShare = () => {
    handleConfetti();
    if (navigator.share) {
      navigator.share({
        title: 'Sankalp Siddhi 100-Day Accomplishment',
        text: `I have successfully fulfilled the 100-Day Supreme Mindful Discipline Sadhana as ${seekerName}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Siddhi Victory link copied to clipboard!', 'share');
    }
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (onUpdateSeekerName && seekerName.trim()) {
      onUpdateSeekerName(seekerName.trim());
    }
  };

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Celebration Banner */}
      <section className="relative w-full overflow-hidden bg-[#f6f3ee] border border-[#dfc0b7]/40 rounded-3xl p-8 text-center shadow-xs">
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffffff] shadow-xs border border-[#dfc0b7]/40 mb-4">
            <span className="font-serif text-[11px] text-[#fe932c] uppercase font-bold tracking-widest">
              ॥ SANKALP POORNAM • UNBROKEN SIDDHI VICTORY ॥
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-[#641800] font-extrabold mb-3 tracking-tight">
            Supreme Siddhi Celebration! 100-Day Unbroken Sadhana Completed!
          </h1>

          <p className="font-serif text-base text-[#58423b] max-w-2xl mb-6 italic leading-relaxed">
            "You have successfully fulfilled your <strong className="text-[#1c1c19] font-semibold">100-Day Supreme Mindful Discipline System</strong>. Your resolute willpower, tapasya, and focused consciousness shine victorious!"
          </p>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8b2500] hover:bg-[#641800] text-white transition-all shadow-md text-xs font-bold"
            >
              <span className="material-symbols-outlined text-lg">image</span>
              <span>Download High-Res PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f6f3ee] text-[#1c1c19] border border-[#dfc0b7]/40 transition-all shadow-xs text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[#fe932c] text-lg">picture_as_pdf</span>
              <span>Print-Ready PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f6f3ee] text-[#1c1c19] border border-[#dfc0b7]/40 transition-all shadow-xs text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[#003c29] text-lg">share</span>
              <span>Share Willpower Victory</span>
            </button>

            <button
              type="button"
              onClick={onExportExcel}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f6f3ee] text-[#1c1c19] border border-[#dfc0b7]/40 transition-all shadow-xs text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[#fe932c] text-lg">file_download</span>
              <div className="flex flex-col text-left">
                <span className="leading-tight">Excel Audit Log (.xlsx)</span>
                <span className="font-serif text-[9px] text-[#003c29] font-bold">Cryptographic Integrity</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Museum-Grade Vedic Parchment Certificate Card */}
      <section className="w-full flex justify-center items-center">
        <div
          id="sacredCertificate"
          className="relative w-full max-w-4xl bg-[#ffffff] border-4 border-[#dfc0b7] rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden"
        >
          {/* Ornate Golden Filigree Inner Inlay */}
          <div className="absolute inset-3 rounded-2xl pointer-events-none border-2 border-[#fe932c]/30 bg-gradient-to-br from-[#ffdcc3]/20 via-[#ffffff]/80 to-[#ffdcc3]/10"></div>

          {/* Watermark Lotus Geometry Backdrop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <div className="w-96 h-96 rounded-full border-4 border-[#641800] flex items-center justify-center">
              <span className="font-serif text-8xl font-bold text-[#641800]">ॐ</span>
            </div>
          </div>

          {/* Certificate Internal Content */}
          <div className="relative z-10 flex flex-col items-center text-center py-4 px-2">
            {/* Sacred Sloka */}
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-[1px] bg-[#fe932c]"></span>
              <span className="font-serif text-sm md:text-base text-[#904d00] font-bold tracking-widest">
                || Satyenotpadyate Dharmah: Satye Tishthati Medini ||
              </span>
              <span className="w-10 h-[1px] bg-[#fe932c]"></span>
            </div>
            <span className="text-xs text-[#58423b] italic mb-6">
              Righteousness springs from truth; on truth rests the earth
            </span>

            {/* Emblem */}
            <div className="w-24 h-24 mb-4 rounded-2xl bg-[#8b2500] text-[#ffdcc3] flex items-center justify-center font-serif text-4xl font-bold shadow-md border-2 border-[#fe932c]">
              ॐ
            </div>

            <span className="font-serif text-[11px] text-[#58423b] uppercase font-bold tracking-[0.2em] mb-1">
              SANSTHAN VEDIC ATMA-DISCIPLINE CHARTER
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-[#641800] font-bold tracking-tight mb-1">
              CERTIFICATE OF SUPREME SANKALP SIDDHI
            </h2>
            <span className="font-serif text-xs text-[#904d00] font-bold uppercase tracking-wider mb-6">
              Certificate of Supreme Mindful Willpower & Discipline
            </span>

            {/* Conferral Statement */}
            <div className="max-w-2xl mb-6">
              <p className="text-sm text-[#58423b] leading-relaxed">
                This is officially certified that the seeker of self-mastery
              </p>

              <div className="relative inline-block my-3 px-6 py-1">
                {isEditingName ? (
                  <input
                    type="text"
                    value={seekerName}
                    onChange={(e) => setSeekerName(e.target.value.toUpperCase())}
                    onBlur={handleNameBlur}
                    autoFocus
                    className="font-serif text-2xl text-[#1c1c19] font-bold tracking-wide text-center bg-transparent border-b-2 border-[#fe932c] outline-none"
                    aria-label="Seeker Name"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="font-serif text-2xl text-[#1c1c19] font-bold tracking-wide hover:text-[#8b2500] transition-colors focus-visible:outline-2 focus-visible:outline-[#fe932c]"
                    title="Click to edit name"
                  >
                    {seekerName}
                  </button>
                )}
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#fe932c] to-transparent mt-1"></div>
              </div>

              <p className="text-xs text-[#58423b] leading-relaxed max-w-xl mx-auto">
                has completed the 100-Day Unbroken Mindful Resolution Sadhana with utmost restraint, dedication, and unbroken self-discipline, attaining the state of{' '}
                <strong className="text-[#641800] font-bold">"Sankalp Siddhi" (Mastery of Mindful Willpower)</strong>.
              </p>
            </div>

            {/* Telemetry Details Grid */}
            <div className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#f6f3ee] rounded-xl p-3.5 mb-8 text-left border border-[#dfc0b7]/30 shadow-xs">
              <div className="flex flex-col">
                <span className="font-serif text-[9px] text-[#58423b] uppercase">System</span>
                <span className="text-xs font-bold text-[#1c1c19] truncate">Supreme Mindful 100D</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[9px] text-[#58423b] uppercase">Period</span>
                <span className="text-xs font-bold text-[#1c1c19]">07 Sep — 18 Oct 2024</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[9px] text-[#58423b] uppercase">Fulfilment</span>
                <span className="text-xs font-bold text-[#003c29] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span> 100 / 100 Days (100%)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[9px] text-[#58423b] uppercase">Verification Hash</span>
                <span className="font-mono text-[10px] font-bold text-[#904d00] truncate">
                  {db.verificationHash || 'SNKLP-2024-XLSX-9842'}
                </span>
              </div>
            </div>

            {/* Signatures & 3D Golden Wax Seal */}
            <div className="w-full max-w-2xl grid grid-cols-3 items-end pt-2">
              <div className="flex flex-col items-center text-center">
                <div className="font-serif text-lg text-[#641800] italic font-bold mb-1 select-none">
                  {db.guideName || 'Acharya V. Shastri'}
                </div>
                <div className="w-32 h-[1px] bg-[#58423b]/30 mb-1"></div>
                <span className="text-xs text-[#1c1c19] font-bold">Acharya V. Shastri</span>
                <span className="text-[10px] text-[#58423b]">Spiritual Mentor & Guide</span>
              </div>

              {/* 3D Wax Seal */}
              <button
                type="button"
                onClick={handleConfetti}
                className="flex flex-col items-center justify-center cursor-pointer group"
                aria-label="Trigger celebration confetti"
              >
                <div className="w-20 h-20 rounded-full bg-[#fe932c] p-1 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#904d00] flex flex-col items-center justify-center text-white text-center shadow-inner">
                    <span className="font-serif text-[7px] font-black uppercase">SANKALP SIDDHI</span>
                    <span className="font-serif text-base font-black">100</span>
                    <span className="font-serif text-[6px] uppercase opacity-90">DAYS COMPLETED</span>
                  </div>
                </div>
                <span className="font-serif text-[9px] text-[#904d00] font-bold uppercase mt-1">OFFICIAL SEAL</span>
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="font-serif text-base text-[#641800] font-bold mb-1 select-none">
                  {seekerName}
                </div>
                <div className="w-32 h-[1px] bg-[#58423b]/30 mb-1"></div>
                <span className="text-xs text-[#1c1c19] font-bold">Seeker Signature</span>
                <span className="font-serif text-[11px] text-[#904d00] italic">"Aham Brahmasmi"</span>
              </div>
            </div>

            {/* Bottom Security Tag */}
            <div className="mt-8 flex items-center gap-2 text-[#58423b]/60 font-serif text-[9px] uppercase tracking-widest">
              <span>ENCRYPTED VERCEL BLOB RECORD: /DATA/SANKALP_DATABASE.JSON</span>
              <span aria-hidden="true">•</span>
              <span>TIMESTAMP: 2024-10-18T18:30:00Z</span>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Strip */}
      <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#ffffff] border border-[#dfc0b7]/40 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00553c]/10 text-[#003c29] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-[10px] text-[#58423b] uppercase">Mindful Actions</span>
            <span className="text-sm font-bold text-[#1c1c19]">800+ Practices</span>
            <span className="text-xs text-[#003c29] font-bold">100% Adherence Rate</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#dfc0b7]/40 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffdcc3] text-[#6e3900] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">local_fire_department</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-[10px] text-[#58423b] uppercase">Unbroken Flow</span>
            <span className="text-sm font-bold text-[#1c1c19]">100 Days Continuous</span>
            <span className="text-xs text-[#904d00] font-bold">0 Resets / Zero Breaks</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#dfc0b7]/40 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffdbd1] text-[#852300] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">self_improvement</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-[10px] text-[#58423b] uppercase">Silence & Meditation</span>
            <span className="text-sm font-bold text-[#1c1c19]">150+ Hours</span>
            <span className="text-xs text-[#641800] font-bold">Deep Purification</span>
          </div>
        </div>
      </section>

      {/* Next Cycle Options */}
      <section className="w-full max-w-4xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="font-serif text-[11px] text-[#904d00] uppercase font-bold">Next Discipline Cycle</span>
          <h3 className="font-serif text-xl text-[#1c1c19] font-bold">Choose Your Next Discipline Cycle</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#ffffff] border border-[#dfc0b7]/40 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#ffdcc3] text-[#6e3900] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-xl">nutrition</span>
              </div>
              <span className="font-serif text-[10px] text-[#904d00] font-bold uppercase">Cadence II • 100 Days</span>
              <h4 className="font-serif text-base text-[#1c1c19] font-bold mt-1 mb-2">Sattvic Health & Reset</h4>
              <p className="text-xs text-[#58423b] leading-relaxed mb-4">
                Embark on a renewed 100-day cycle of sattvic nutrition, Surya Namaskar, and dawn Brahma Muhurta meditation.
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfetti}
              className="w-full py-2 rounded-xl bg-[#ffdcc3] hover:bg-[#ffb77d] text-[#2f1500] text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>Start New System</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="bg-[#f0ede9] border-2 border-[#8b2500] rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#8b2500] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">military_tech</span>
                </div>
                <span className="text-[10px] font-bold text-[#8b2500] uppercase">
                  Recommended
                </span>
              </div>
              <span className="font-serif text-[10px] text-[#8b2500] font-bold uppercase">Supreme Leap • 365 Days</span>
              <h4 className="font-serif text-base text-[#1c1c19] font-bold mt-1 mb-2">Advance to 365-Day Maha Sankalp</h4>
              <p className="text-xs text-[#58423b] leading-relaxed mb-4">
                A full year of unbroken supreme commitment. Master 4 seasonal disciplines in the ultimate Vedic transformation.
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfetti}
              className="w-full py-2 rounded-xl bg-[#8b2500] hover:bg-[#641800] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Accept Maha-Sankalp</span>
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
            </button>
          </div>

          <div className="bg-[#ffffff] border border-[#dfc0b7]/40 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#97f5cc] text-[#002115] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-xl">archive</span>
              </div>
              <span className="font-serif text-[10px] text-[#003c29] font-bold uppercase">Data Archival • Offline Integrity</span>
              <h4 className="font-serif text-base text-[#1c1c19] font-bold mt-1 mb-2">Save Local Master Archive (Excel)</h4>
              <p className="text-xs text-[#58423b] leading-relaxed mb-4">
                Download your full 100-day verified data logs, reflection timestamps, and practice logs in a secure .xlsx spreadsheet.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportExcel}
              className="w-full py-2 rounded-xl bg-[#ebe8e3] hover:bg-[#e5e2dd] text-[#1c1c19] text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">download_for_offline</span>
              <span>Download Complete .xlsx</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
