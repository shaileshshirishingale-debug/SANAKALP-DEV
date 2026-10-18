import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStreak,
  calculateCompletionMetrics,
  calculateMindfulnessIndex,
  calculateCategoryDistribution,
  calculateSlotEfficacy,
  parseAndValidateImportData,
  analyzeSequence,
} from './calculations.ts';
import type { DailyLogEntry, SankalpVow } from '../types.ts';

test('calculateStreak correctly computes unbroken consecutive days', () => {
  const sampleLogs: Record<number, DailyLogEntry> = {
    1: { dayNumber: 1, dateStr: '01 Sep', completedVowIds: ['v1'], mindfulnessRating: 5, innerState: 'Tranquil', journalNote: '', status: 'Fulfilled', excelRowRef: '', syncedAt: '' },
    2: { dayNumber: 2, dateStr: '02 Sep', completedVowIds: ['v1'], mindfulnessRating: 5, innerState: 'Tranquil', journalNote: '', status: 'Fulfilled', excelRowRef: '', syncedAt: '' },
    3: { dayNumber: 3, dateStr: '03 Sep', completedVowIds: ['v1'], mindfulnessRating: 4, innerState: 'Energized', journalNote: '', status: 'Partial', excelRowRef: '', syncedAt: '' },
    4: { dayNumber: 4, dateStr: '04 Sep', completedVowIds: [], mindfulnessRating: 0, innerState: 'Pending', journalNote: '', status: 'Pending', excelRowRef: '', syncedAt: '' },
  };

  assert.equal(calculateStreak(sampleLogs, 3), 3);
  assert.equal(calculateStreak(sampleLogs, 4), 3); // Day 4 pending, so streak up to day 3 is 3
  assert.equal(calculateStreak(undefined, 5), 0);
  assert.equal(calculateStreak({}, 0), 0);
});

test('calculateCompletionMetrics handles zero-value and non-zero denominators correctly', () => {
  const sampleLogs: Record<number, DailyLogEntry> = {
    1: { dayNumber: 1, dateStr: '01 Sep', completedVowIds: ['v1', 'v2'], mindfulnessRating: 5, innerState: 'Tranquil', journalNote: '', status: 'Fulfilled', excelRowRef: '', syncedAt: '' },
    2: { dayNumber: 2, dateStr: '02 Sep', completedVowIds: ['v1'], mindfulnessRating: 4, innerState: 'Tranquil', journalNote: '', status: 'Partial', excelRowRef: '', syncedAt: '' },
  };

  const metrics = calculateCompletionMetrics(sampleLogs, 2, 2);
  assert.equal(metrics.completedCount, 3);
  assert.equal(metrics.totalPossible, 4);
  assert.equal(metrics.percent, 75);

  // Zero-value handling
  const zeroMetrics = calculateCompletionMetrics(sampleLogs, 0, 0);
  assert.equal(zeroMetrics.completedCount, 0);
  assert.equal(zeroMetrics.totalPossible, 0);
  assert.equal(zeroMetrics.percent, 0);
});

test('calculateMindfulnessIndex accurately averages non-zero ratings and handles zero ratings', () => {
  const sampleLogs: Record<number, DailyLogEntry> = {
    1: { dayNumber: 1, dateStr: '01 Sep', completedVowIds: ['v1'], mindfulnessRating: 5.0, innerState: 'Tranquil', journalNote: '', status: 'Fulfilled', excelRowRef: '', syncedAt: '' },
    2: { dayNumber: 2, dateStr: '02 Sep', completedVowIds: ['v1'], mindfulnessRating: 4.0, innerState: 'Tranquil', journalNote: '', status: 'Fulfilled', excelRowRef: '', syncedAt: '' },
    3: { dayNumber: 3, dateStr: '03 Sep', completedVowIds: [], mindfulnessRating: 0, innerState: 'Pending', journalNote: '', status: 'Pending', excelRowRef: '', syncedAt: '' },
  };

  const result = calculateMindfulnessIndex(sampleLogs, 3);
  assert.equal(result.average, 4.5);
  assert.equal(result.formatted, '4.5');
  assert.equal(result.count, 2);

  const emptyResult = calculateMindfulnessIndex(undefined, 0);
  assert.equal(emptyResult.average, 0);
  assert.equal(emptyResult.formatted, '0.0');
});

test('calculateCategoryDistribution returns 100% total sum and handles empty active vows', () => {
  const vows: SankalpVow[] = [
    { id: '1', systemId: 's1', title: 'A', category: 'Spiritual', timeSlot: 'brahma', timeLabel: '', reminderTime: '', durationMins: 30, tip: '', streakDays: 1, active: true },
    { id: '2', systemId: 's1', title: 'B', category: 'Health', timeSlot: 'brahma', timeLabel: '', reminderTime: '', durationMins: 30, tip: '', streakDays: 1, active: true },
    { id: '3', systemId: 's1', title: 'C', category: 'Spiritual', timeSlot: 'sayam', timeLabel: '', reminderTime: '', durationMins: 30, tip: '', streakDays: 1, active: true },
    { id: '4', systemId: 's1', title: 'D', category: 'Mind', timeSlot: 'pratah', timeLabel: '', reminderTime: '', durationMins: 30, tip: '', streakDays: 1, active: true },
  ];

  const dist = calculateCategoryDistribution(vows);
  const spiritual = dist.find((d) => d.category === 'Spiritual');
  assert.equal(spiritual?.count, 2);
  assert.equal(spiritual?.percentage, 50);

  const emptyDist = calculateCategoryDistribution([]);
  assert.equal(emptyDist.every((d) => d.percentage === 0), true);
});

test('calculateSlotEfficacy computes percentage per time slot accurately', () => {
  const vows: SankalpVow[] = [
    { id: 'v1', systemId: 's1', title: 'Brahma 1', category: 'Spiritual', timeSlot: 'brahma', timeLabel: '', reminderTime: '', durationMins: 30, tip: '', streakDays: 1, active: true },
  ];
  const logs: Record<number, DailyLogEntry> = {
    1: { dayNumber: 1, dateStr: '01 Sep', completedVowIds: ['v1'], mindfulnessRating: 5, innerState: 'Tranquil', journalNote: '', status: 'Fulfilled', excelRowRef: '', syncedAt: '' },
    2: { dayNumber: 2, dateStr: '02 Sep', completedVowIds: [], mindfulnessRating: 4, innerState: 'Tranquil', journalNote: '', status: 'Pending', excelRowRef: '', syncedAt: '' },
  };

  const slotEff = calculateSlotEfficacy(logs, vows, 2);
  const brahmaSlot = slotEff.find((s) => s.slot === 'brahma');
  assert.equal(brahmaSlot?.percentage, 50);
});

test('parseAndValidateImportData correctly validates, parses and rejects invalid rows', () => {
  const rawRows = [
    { 'Day #': 'Day 001', 'Date': '01 Sep 2024', 'Mindfulness Rating': '5.0 / 5.0 ⭐', 'Inner State': 'Tranquil', 'Journal Notes': 'First day', 'Status': 'FULFILLED' },
    { 'Day #': 'InvalidDay', 'Date': '02 Sep 2024', 'Mindfulness Rating': '4.0', 'Inner State': 'Energized', 'Journal Notes': 'Bad day number', 'Status': 'Fulfilled' },
    { 'Day #': 1, 'Date': '01 Sep 2024 Duplicate', 'Mindfulness Rating': '4.5', 'Inner State': 'Tranquil', 'Journal Notes': 'Duplicate row', 'Status': 'Partial' },
  ];

  const { cleanedLogs, report } = parseAndValidateImportData(rawRows, {});
  assert.equal(report.totalRows, 3);
  assert.equal(report.imported, 2);
  assert.equal(report.rejected, 1);
  assert.equal(report.duplicates, 1);
  assert.equal(cleanedLogs[1].journalNote, 'Duplicate row');
  assert.equal(cleanedLogs[1].status, 'Partial');
});

test('analyzeSequence correctly calculates deterministic totals for WWLLW and reverse LLWWL', () => {
  const inputSequence = 'WWLLW';
  const result = analyzeSequence(inputSequence);

  assert.equal(result.rawSequence, 'WWLLW');
  assert.equal(result.totalCount, 5);
  assert.equal(result.wins, 3);
  assert.equal(result.losses, 2);
  assert.equal(result.winRatePercent, 60);
  assert.equal(result.lossRatePercent, 40);

  assert.equal(result.reversedSequence, 'LLWWL');
  assert.equal(result.reversedWins, 2);
  assert.equal(result.reversedLosses, 3);
});
