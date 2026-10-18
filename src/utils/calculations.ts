import type { DailyLogEntry, SankalpVow, TimeSlotKey, SequenceAnalysisResult } from '../types.ts';

export interface ImportReport {
  totalRows: number;
  imported: number;
  rejected: number;
  skipped: number;
  duplicates: number;
  errors: string[];
}

/**
 * Calculates current unbroken streak of consecutive disciplined days up to currentDay.
 */
export function calculateStreak(
  dailyLogs: Record<number, DailyLogEntry> | undefined,
  currentDay: number
): number {
  if (!dailyLogs || currentDay <= 0) return 0;

  let streak = 0;
  const todayLog = dailyLogs[currentDay];
  let startDay = currentDay;

  // If today has no completed vows yet, start checking from yesterday so streak doesn't reset to 0 mid-day
  if (!todayLog || !todayLog.completedVowIds || todayLog.completedVowIds.length === 0) {
    startDay = currentDay - 1;
  }

  for (let d = startDay; d >= 1; d--) {
    const log = dailyLogs[d];
    if (log && log.completedVowIds && log.completedVowIds.length > 0 && log.status !== 'Pending') {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates overall completion metrics (total resolutions completed vs total possible).
 */
export function calculateCompletionMetrics(
  dailyLogs: Record<number, DailyLogEntry> | undefined,
  totalActiveVows: number,
  targetDay: number
) {
  if (!dailyLogs || totalActiveVows <= 0 || targetDay <= 0) {
    return { completedCount: 0, totalPossible: 0, percent: 0 };
  }

  let completedCount = 0;
  for (let d = 1; d <= targetDay; d++) {
    const log = dailyLogs[d];
    if (log && Array.isArray(log.completedVowIds)) {
      completedCount += log.completedVowIds.length;
    }
  }

  const totalPossible = totalActiveVows * targetDay;
  const percent = totalPossible > 0 ? Math.min(100, Math.round((completedCount / totalPossible) * 1000) / 10) : 0;

  return { completedCount, totalPossible, percent };
}

/**
 * Calculates average mindfulness rating (1.0 to 5.0).
 */
export function calculateMindfulnessIndex(
  dailyLogs: Record<number, DailyLogEntry> | undefined,
  targetDay: number
) {
  if (!dailyLogs || targetDay <= 0) {
    return { average: 0, formatted: '0.0', count: 0 };
  }

  let sum = 0;
  let count = 0;

  for (let d = 1; d <= targetDay; d++) {
    const log = dailyLogs[d];
    if (log && typeof log.mindfulnessRating === 'number' && log.mindfulnessRating > 0) {
      sum += log.mindfulnessRating;
      count++;
    }
  }

  const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
  return { average, formatted: average.toFixed(1), count };
}

/**
 * Calculates percentage breakdown of active vows by Category.
 */
export function calculateCategoryDistribution(sankalps: SankalpVow[] | undefined) {
  const categories = ['Spiritual', 'Health', 'Mind', 'Discipline', 'Relationships'] as const;
  if (!sankalps || sankalps.length === 0) {
    return categories.map((cat) => ({ category: cat, count: 0, percentage: 0 }));
  }

  const activeVows = sankalps.filter((s) => s.active);
  const total = activeVows.length;
  if (total === 0) {
    return categories.map((cat) => ({ category: cat, count: 0, percentage: 0 }));
  }

  return categories.map((cat) => {
    const count = activeVows.filter((s) => s.category === cat).length;
    const percentage = Math.round((count / total) * 100);
    return { category: cat, count, percentage };
  });
}

/**
 * Calculates completion efficacy percentage for each Time Slot across history.
 */
export function calculateSlotEfficacy(
  dailyLogs: Record<number, DailyLogEntry> | undefined,
  sankalps: SankalpVow[] | undefined,
  targetDay: number
) {
  const slots: { slot: TimeSlotKey; label: string; time: string }[] = [
    { slot: 'brahma', label: 'Brahma Muhurta', time: '04-06 AM' },
    { slot: 'pratah', label: 'Morning', time: '06-10 AM' },
    { slot: 'madhyahna', label: 'Midday', time: '10-02 PM' },
    { slot: 'sayam', label: 'Evening', time: '05-08 PM' },
    { slot: 'ratri', label: 'Night', time: '09-11 PM' },
  ];

  if (!dailyLogs || !sankalps || targetDay <= 0) {
    return slots.map((s) => ({ ...s, percentage: 0 }));
  }

  const activeVows = sankalps.filter((s) => s.active);

  return slots.map(({ slot, label, time }) => {
    const slotVows = activeVows.filter((v) => v.timeSlot === slot);
    if (slotVows.length === 0) {
      return { slot, label, time, percentage: 100 };
    }

    const possible = slotVows.length * targetDay;
    let completed = 0;

    for (let d = 1; d <= targetDay; d++) {
      const log = dailyLogs[d];
      if (log && Array.isArray(log.completedVowIds)) {
        slotVows.forEach((vow) => {
          if (log.completedVowIds.includes(vow.id)) {
            completed++;
          }
        });
      }
    }

    const percentage = possible > 0 ? Math.min(100, Math.round((completed / possible) * 100)) : 0;
    return { slot, label, time, percentage };
  });
}

/**
 * Validates, parses, and cleanses raw imported data rows (Excel / CSV / JSON).
 */
export function parseAndValidateImportData(
  rawData: any[],
  existingLogs: Record<number, DailyLogEntry>,
  activeVows: SankalpVow[] = []
): { cleanedLogs: Record<number, DailyLogEntry>; report: ImportReport } {
  const report: ImportReport = {
    totalRows: rawData ? rawData.length : 0,
    imported: 0,
    rejected: 0,
    skipped: 0,
    duplicates: 0,
    errors: [],
  };

  const cleanedLogs: Record<number, DailyLogEntry> = { ...existingLogs };
  const seenDays = new Set<number>();

  if (!Array.isArray(rawData) || rawData.length === 0) {
    report.errors.push('Uploaded dataset is empty or invalid.');
    return { cleanedLogs, report };
  }

  const activeVowIds = activeVows.length > 0
    ? activeVows.map((v) => v.id)
    : ['vow-1', 'vow-2', 'vow-3', 'vow-4', 'vow-5', 'vow-6', 'vow-7'];

  rawData.forEach((row, idx) => {
    const rowNum = idx + 1;

    // Extract Day Number
    let dayNumRaw = row['Day #'] ?? row['Day'] ?? row['dayNumber'] ?? row['day'];
    if (typeof dayNumRaw === 'string') {
      const match = dayNumRaw.match(/\d+/);
      if (match) dayNumRaw = parseInt(match[0], 10);
    }

    const dayNum = Number(dayNumRaw);

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 100) {
      report.rejected++;
      report.errors.push(`Row ${rowNum}: Invalid or missing Day number (${dayNumRaw ?? 'blank'}). Must be between 1 and 100.`);
      return;
    }

    // Check Duplicate Row
    if (seenDays.has(dayNum)) {
      report.duplicates++;
      report.errors.push(`Row ${rowNum}: Duplicate record for Day ${dayNum}. Overwriting with latest row.`);
    }
    seenDays.add(dayNum);

    // Extract Date
    const dateStr = String(row['Date'] || row['dateStr'] || row['date'] || `Day ${dayNum}`).trim();

    // Extract Rating
    let ratingRaw = row['Mindfulness Rating'] ?? row['mindfulnessRating'] ?? row['rating'] ?? 4.5;
    if (typeof ratingRaw === 'string') {
      const match = ratingRaw.match(/[\d.]+/);
      if (match) ratingRaw = parseFloat(match[0]);
    }
    let rating = Number(ratingRaw);
    if (isNaN(rating) || rating < 0) rating = 0;
    if (rating > 5) rating = 5;

    // Extract Inner State
    const innerState = String(row['Inner State'] || row['innerState'] || row['state'] || 'Tranquil').trim();

    // Extract Notes
    const journalNote = String(row['Journal Notes'] || row['journalNote'] || row['notes'] || '').trim();

    // Extract Status
    const statusRaw = String(row['Status'] || row['status'] || 'Fulfilled').trim().toLowerCase();
    let status: 'Fulfilled' | 'Partial' | 'In Progress' | 'Pending' = 'Fulfilled';
    let completedVowIds: string[] = [];

    if (statusRaw.includes('partial')) {
      status = 'Partial';
      completedVowIds = activeVowIds.slice(0, Math.max(1, activeVowIds.length - 1));
    } else if (statusRaw.includes('progress')) {
      status = 'In Progress';
      completedVowIds = activeVowIds.slice(0, Math.ceil(activeVowIds.length / 2));
    } else if (statusRaw.includes('pending')) {
      status = 'Pending';
      completedVowIds = [];
    } else {
      status = 'Fulfilled';
      completedVowIds = [...activeVowIds];
    }

    // Construct valid DailyLogEntry
    cleanedLogs[dayNum] = {
      dayNumber: dayNum,
      dateStr,
      completedVowIds,
      mindfulnessRating: Math.round(rating * 10) / 10,
      innerState,
      journalNote,
      status,
      excelRowRef: `DailyLogs!A${dayNum + 1}:H${dayNum + 1}`,
      syncedAt: new Date().toISOString(),
    };

    report.imported++;
  });

  return { cleanedLogs, report };
}

/**
 * Deterministic sequence analysis routine (Classified Win/Loss sequence & reverse transformation).
 * Fulfills Phase 6 verification checks.
 */
export function analyzeSequence(inputSequence: string): SequenceAnalysisResult {
  const sanitized = (inputSequence || '').toUpperCase().trim();
  const chars = sanitized.split('').filter((c) => c === 'W' || c === 'L');

  let wins = 0;
  let losses = 0;

  chars.forEach((c) => {
    if (c === 'W') wins++;
    if (c === 'L') losses++;
  });

  const totalCount = chars.length;
  const winRatePercent = totalCount > 0 ? Math.round((wins / totalCount) * 100) : 0;
  const lossRatePercent = totalCount > 0 ? Math.round((losses / totalCount) * 100) : 0;

  // Reverse transformation: W becomes L, L becomes W
  const reversedChars = chars.map((c) => (c === 'W' ? 'L' : 'W'));
  const reversedSequence = reversedChars.join('');

  let reversedWins = 0;
  let reversedLosses = 0;
  reversedChars.forEach((c) => {
    if (c === 'W') reversedWins++;
    if (c === 'L') reversedLosses++;
  });

  return {
    rawSequence: chars.join(''),
    totalCount,
    wins,
    losses,
    winRatePercent,
    lossRatePercent,
    reversedSequence,
    reversedWins,
    reversedLosses,
  };
}
