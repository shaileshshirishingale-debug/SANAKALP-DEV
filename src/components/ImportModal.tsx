import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { ImportReport } from '../utils/calculations';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  onShowToast,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [report, setReport] = useState<ImportReport | null>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Day #': 'Day 001',
        'Date': '01 Sep 2024',
        'Mindfulness Rating': 5.0,
        'Inner State': 'Tranquil',
        'Journal Notes': 'Sample contemplative journal observation',
        'Status': 'Fulfilled',
      },
      {
        'Day #': 'Day 002',
        'Date': '02 Sep 2024',
        'Mindfulness Rating': 4.5,
        'Inner State': 'Energized',
        'Journal Notes': 'Maintained deep concentration throughout morning practice',
        'Status': 'Fulfilled',
      },
      {
        'Day #': 'Day 003',
        'Date': '03 Sep 2024',
        'Mindfulness Rating': 4.0,
        'Inner State': 'Single-Pointed Focus',
        'Journal Notes': 'Partial resolution fulfilled during midday reset',
        'Status': 'Partial',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sample_Sankalp_Import');
    XLSX.writeFile(wb, 'sankalp_import_template.xlsx');
    onShowToast('Downloaded sample template: sankalp_import_template.xlsx', 'file_download');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setReport(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json(worksheet);

      const res = await fetch('/api/blob/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawRows }),
      });

      const data = await res.json();
      setIsUploading(false);

      if (data.success && data.report) {
        setReport(data.report);
        onImportSuccess();
        onShowToast(`Imported ${data.report.imported} logs from ${file.name}`, 'cloud_done');
      } else {
        onShowToast(`Import failed: ${data.error || 'Invalid file format'}`, 'error');
      }
    } catch (err: any) {
      setIsUploading(false);
      onShowToast(`Error reading file: ${err.message}`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1c19]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#dfc0b7]/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#dfc0b7]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00553c] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">upload_file</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-serif text-base text-[#1c1c19] font-bold">Import Dataset (.xlsx / .csv)</h3>
              <span className="text-xs text-[#58423b]">Upload external spreadsheet into Vercel Blob DB</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#f6f3ee] flex items-center justify-center text-[#58423b]"
            aria-label="Close Modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between bg-[#f6f3ee] p-3 rounded-xl border border-[#dfc0b7]/30 text-xs">
            <span className="text-[#58423b]">Need formatted sample template?</span>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1 font-bold text-[#641800] hover:text-[#fe932c] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download .xlsx Template</span>
            </button>
          </div>

          <div className="border-2 border-dashed border-[#fe932c]/50 bg-[#f6f3ee] p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-[#ffdcc3]/20 transition-colors relative">
            <input
              type="file"
              accept=".xlsx, .xls, .csv, .json"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Upload Dataset File"
            />
            <span className="material-symbols-outlined text-3xl text-[#904d00]">cloud_upload</span>
            <span className="text-xs font-bold text-[#1c1c19]">
              Click to select or drag & drop Excel / CSV file
            </span>
            <span className="text-[10px] text-[#58423b]">
              Supported columns: Day #, Date, Mindfulness Rating, Inner State, Journal Notes, Status
            </span>
          </div>

          {isUploading && (
            <div className="flex items-center justify-center gap-2 text-xs text-[#641800] font-bold py-2">
              <div className="w-4 h-4 rounded-full border-2 border-[#8b2500] border-t-transparent animate-spin"></div>
              <span>Validating and importing dataset...</span>
            </div>
          )}

          {report && (
            <div className="bg-[#f0ede9] p-4 rounded-xl flex flex-col gap-2 border border-[#dfc0b7]/40 text-xs">
              <span className="font-serif text-[10px] text-[#003c29] uppercase font-bold">
                Import Validation Report
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-[#dfc0b7]/20">
                  <span className="block text-[9px] text-[#58423b]">TOTAL</span>
                  <span className="font-bold text-[#1c1c19] text-sm">{report.totalRows}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#dfc0b7]/20">
                  <span className="block text-[9px] text-[#003c29]">IMPORTED</span>
                  <span className="font-bold text-[#003c29] text-sm">{report.imported}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#dfc0b7]/20">
                  <span className="block text-[9px] text-[#904d00]">REJECTED</span>
                  <span className="font-bold text-[#904d00] text-sm">{report.rejected}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#dfc0b7]/20">
                  <span className="block text-[9px] text-[#fe932c]">DUPLICATES</span>
                  <span className="font-bold text-[#fe932c] text-sm">{report.duplicates}</span>
                </div>
              </div>

              {report.errors.length > 0 && (
                <div className="mt-2 bg-[#ffdad6] p-2 rounded-lg text-[#93000a] text-[11px] max-h-24 overflow-y-auto">
                  <span className="font-bold block mb-1">Errors & Warnings:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {report.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dfc0b7]/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#ebe8e3] text-[#1c1c19] text-xs font-bold hover:bg-[#e5e2dd]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
