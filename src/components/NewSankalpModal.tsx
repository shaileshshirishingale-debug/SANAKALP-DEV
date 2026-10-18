import React, { useState } from 'react';
import { TimeSlotKey } from '../types';

interface NewSankalpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (vowData: {
    title: string;
    category: string;
    timeSlot: TimeSlotKey;
    reminderTime: string;
    durationMins: number;
    tip: string;
  }) => void;
}

export const NewSankalpModal: React.FC<NewSankalpModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Spiritual');
  const [timeSlot, setTimeSlot] = useState<TimeSlotKey>('brahma');
  const [reminderTime, setReminderTime] = useState('06:00');
  const [durationMins, setDurationMins] = useState(30);
  const [tip, setTip] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      category,
      timeSlot,
      reminderTime,
      durationMins: Number(durationMins) || 30,
      tip: tip.trim() || 'Maintain calm breathing and steady resolve.',
    });
    setTitle('');
    setTip('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1c19]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#dfc0b7]/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#dfc0b7]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8b2500] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">add</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-serif text-base text-[#641800] font-bold">New Resolution Commitment</h3>
              <span className="text-xs text-[#58423b]">Append Vow to Vercel Blob JSON Ledger</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#f6f3ee] flex items-center justify-center text-[#58423b]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-serif text-[10px] text-[#58423b] uppercase font-bold">
              Resolution Title (Vow Name / Affirmation)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 30 Minutes Evening Pranayama & Silence"
              className="bg-[#f6f3ee] px-3 py-2 rounded-xl text-xs text-[#1c1c19] outline-none focus:ring-2 focus:ring-[#fe932c] border border-[#dfc0b7]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-serif text-[10px] text-[#58423b] uppercase font-bold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#f6f3ee] px-3 py-2 rounded-xl text-xs text-[#1c1c19] outline-none focus:ring-2 focus:ring-[#fe932c] border border-[#dfc0b7]/30"
              >
                <option value="Spiritual">Spiritual Sadhana</option>
                <option value="Health">Body & Health</option>
                <option value="Mind">Mind & Focus</option>
                <option value="Discipline">Discipline & Purity</option>
                <option value="Relationships">Relationships & Prema</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-serif text-[10px] text-[#58423b] uppercase font-bold">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value as TimeSlotKey)}
                className="bg-[#f6f3ee] px-3 py-2 rounded-xl text-xs text-[#1c1c19] outline-none focus:ring-2 focus:ring-[#fe932c] border border-[#dfc0b7]/30"
              >
                <option value="brahma">🌅 Brahma Muhurta (04:00-06:00)</option>
                <option value="pratah">☀️ Morning (06:00-11:00)</option>
                <option value="madhyahna">🌤️ Noon (11:00-16:00)</option>
                <option value="sayam">🌆 Evening (16:00-20:00)</option>
                <option value="ratri">🌙 Night (20:00-23:00)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-serif text-[10px] text-[#58423b] uppercase font-bold">Reminder Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-[#f6f3ee] px-3 py-2 rounded-xl text-xs text-[#1c1c19] outline-none focus:ring-2 focus:ring-[#fe932c] border border-[#dfc0b7]/30"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-serif text-[10px] text-[#58423b] uppercase font-bold">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                className="bg-[#f6f3ee] px-3 py-2 rounded-xl text-xs text-[#1c1c19] outline-none focus:ring-2 focus:ring-[#fe932c] border border-[#dfc0b7]/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-serif text-[10px] text-[#58423b] uppercase font-bold">Willpower Hack / Tip</label>
            <input
              type="text"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="e.g., Unroll meditation cushion the night before"
              className="bg-[#f6f3ee] px-3 py-2 rounded-xl text-xs text-[#1c1c19] outline-none focus:ring-2 focus:ring-[#fe932c] border border-[#dfc0b7]/30"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-[#dfc0b7]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#ebe8e3] text-[#1c1c19] text-xs font-bold hover:bg-[#e5e2dd]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8b2500] text-white text-xs font-bold hover:bg-[#641800] shadow-xs"
            >
              Commit Resolution (Save to Vercel Blob DB)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
