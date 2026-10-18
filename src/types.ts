export type Language = 'EN' | 'HI';

export type TimeSlotKey = 'brahma' | 'pratah' | 'madhyahna' | 'sayam' | 'ratri';

export interface ResolutionSystem {
  id: string;
  title: string;
  vowCycleNumber: number;
  startDate: string;
  targetDays: number;
  currentDay: number;
  tapasLevelPercent: number;
  active: boolean;
}

export interface SankalpVow {
  id: string;
  systemId: string;
  title: string;
  category: string;
  timeSlot: TimeSlotKey;
  timeLabel: string;
  reminderTime: string;
  durationMins: number;
  tip: string;
  streakDays: number;
  active: boolean;
}

export interface DailyLogEntry {
  dayNumber: number;
  dateStr: string;
  completedVowIds: string[];
  mindfulnessRating: number;
  innerState: string;
  journalNote: string;
  status: 'Fulfilled' | 'Partial' | 'In Progress' | 'Pending';
  excelRowRef: string;
  syncedAt: string;
}

export interface DatabaseBackupSnapshot {
  timestamp: string;
  reason: string;
  logCount: number;
}

export interface DatabaseSchema {
  seekerName: string;
  guideName: string;
  verificationHash: string;
  activeSystemId: string;
  systems: ResolutionSystem[];
  sankalps: SankalpVow[];
  dailyLogs: Record<number, DailyLogEntry>;
  lastSyncedAt: string;
  blobVersion: string;
  blobSizeKb: number;
  backups?: DatabaseBackupSnapshot[];
}

export interface SequenceAnalysisResult {
  rawSequence: string;
  totalCount: number;
  wins: number;
  losses: number;
  winRatePercent: number;
  lossRatePercent: number;
  reversedSequence: string;
  reversedWins: number;
  reversedLosses: number;
}
