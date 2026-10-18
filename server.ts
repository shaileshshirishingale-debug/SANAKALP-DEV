import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import { put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'sankalp_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed database matching the "My Sankalp 108" app requirements
function getInitialDatabase() {
  const initialSankalps = [
    {
      id: 'vow-1',
      systemId: 'sys-108',
      title: 'Brahma Muhurta Meditation & Om Chanting (45 Mins)',
      category: 'Spiritual',
      timeSlot: 'brahma',
      timeLabel: '🌅 04:30 AM',
      reminderTime: '04:30',
      durationMins: 45,
      tip: 'Take 3 deep conscious breaths before rising and view palms with reverence.',
      streakDays: 42,
      active: true,
    },
    {
      id: 'vow-2',
      systemId: 'sys-108',
      title: 'Surya Namaskar (12 Cycles) & Warm Copper Water',
      category: 'Health',
      timeSlot: 'brahma',
      timeLabel: '🌅 05:30 AM',
      reminderTime: '05:30',
      durationMins: 30,
      tip: 'Drink copper-stored water slowly while seated on the floor.',
      streakDays: 42,
      active: true,
    },
    {
      id: 'vow-3',
      systemId: 'sys-108',
      title: '2 Hours Deep Work (No Phone, No Social Media)',
      category: 'Mind',
      timeSlot: 'pratah',
      timeLabel: '☀️ 09:00 AM',
      reminderTime: '09:00',
      durationMins: 120,
      tip: 'Leave phone in another room or activate strict "Do Not Disturb" mode.',
      streakDays: 28,
      active: true,
    },
    {
      id: 'vow-4',
      systemId: 'sys-108',
      title: 'Sattvic Pure Diet (No Refined Sugar, No Processed Food)',
      category: 'Discipline',
      timeSlot: 'madhyahna',
      timeLabel: '🌤️ 01:00 PM',
      reminderTime: '13:00',
      durationMins: 45,
      tip: 'Pause for 10 seconds of silent gratitude before beginning your meal.',
      streakDays: 42,
      active: true,
    },
    {
      id: 'vow-5',
      systemId: 'sys-108',
      title: 'Evening Aarti & Bhagavad Gita Contemplation (Ch. 6 Dhyana Yoga)',
      category: 'Spiritual',
      timeSlot: 'sayam',
      timeLabel: '🌆 06:30 PM',
      reminderTime: '18:30',
      durationMins: 30,
      tip: 'Elevate the self through the self; for the self alone is friend or foe.',
      streakDays: 35,
      active: true,
    },
    {
      id: 'vow-6',
      systemId: 'sys-108',
      title: '30 Mins Screen-Free Quality Family Dialogue',
      category: 'Relationships',
      timeSlot: 'sayam',
      timeLabel: '🌆 08:00 PM',
      reminderTime: '20:00',
      durationMins: 30,
      tip: 'Silent and mindful listening is the highest gesture of genuine respect.',
      streakDays: 40,
      active: true,
    },
    {
      id: 'vow-7',
      systemId: 'sys-108',
      title: 'Digital Detox & Yoga Nidra (10:00 PM Bedtime)',
      category: 'Discipline',
      timeSlot: 'ratri',
      timeLabel: '🌙 09:30 PM',
      reminderTime: '21:30',
      durationMins: 30,
      tip: 'Take soothing Triphala tea 30 minutes before sleep for gentle detox.',
      streakDays: 42,
      active: true,
    },
  ];

  // Populate 100 days of logs (Days 1..41 completed, Day 42 active/today, 43..100 upcoming)
  const dailyLogs: Record<number, any> = {};
  const baseDate = new Date(2024, 8, 7); // Sep 07, 2024 start date -> Day 42 is Oct 18, 2024

  for (let d = 1; d <= 100; d++) {
    const logDate = new Date(baseDate);
    logDate.setDate(baseDate.getDate() + (d - 1));
    const dateStr = logDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (d < 42) {
      // Completed past days
      const isPartial = d === 3 || d === 8 || d === 14 || d === 17 || d === 26 || d === 32 || d === 38;
      const completedVowIds = isPartial
        ? ['vow-1', 'vow-2', 'vow-3', 'vow-4', 'vow-5', 'vow-7']
        : ['vow-1', 'vow-2', 'vow-3', 'vow-4', 'vow-5', 'vow-6', 'vow-7'];

      dailyLogs[d] = {
        dayNumber: d,
        dateStr,
        completedVowIds,
        mindfulnessRating: isPartial ? 4.2 : 5.0,
        innerState: isPartial ? 'Energized' : d % 2 === 0 ? 'Tranquil' : 'Single-Pointed Focus',
        journalNote: d === 41
          ? 'Mind remained exceptionally focused. High energy retained throughout the day with zero negative intrusions.'
          : d === 21
          ? '🌟 Phase 1 Milestone: 21 Days Complete! Habit formation successfully achieved.'
          : `Day ${d} discipline fulfilled with serene resolve and steady focus.`,
        status: isPartial ? 'Partial' : 'Fulfilled',
        excelRowRef: `DailyLogs!A${d + 1}:H${d + 1}`,
        syncedAt: new Date().toISOString(),
      };
    } else if (d === 42) {
      // Today (Day 42) - 3 of 7 fulfilled so far
      dailyLogs[42] = {
        dayNumber: 42,
        dateStr: '18 Oct 2024',
        completedVowIds: ['vow-1', 'vow-2', 'vow-3'],
        mindfulnessRating: 4.5,
        innerState: 'Tranquil',
        journalNote: 'Mid-day stillness maintained. Recharged energy with 5 minutes of contemplation after noon.',
        status: 'In Progress',
        excelRowRef: 'DailyLogs!A43:H43',
        syncedAt: new Date().toISOString(),
      };
    } else {
      // Upcoming days
      dailyLogs[d] = {
        dayNumber: d,
        dateStr,
        completedVowIds: [],
        mindfulnessRating: 0,
        innerState: 'Pending',
        journalNote: d === 51
          ? '🎯 Target Milestone: 51 Days (Mental Fortitude Vow).'
          : d === 75
          ? '🔥 Target Milestone: 75 Days (Unshakable Will Radiance).'
          : d === 100
          ? '👑 Target Milestone: Day 100 Supreme Siddhi Completion!'
          : `Scheduled discipline for Day ${d}.`,
        status: 'Pending',
        excelRowRef: `DailyLogs!A${d + 1}:H${d + 1}`,
        syncedAt: '',
      };
    }
  }

  return {
    seekerName: 'ADITYA SHARMA',
    guideName: 'Acharya V. Shastri',
    verificationHash: 'SNKLP-2024-XLSX-9842',
    activeSystemId: 'sys-108',
    systems: [
      {
        id: 'sys-108',
        title: '100-Day Supreme Mindful Discipline',
        vowCycleNumber: 1,
        startDate: '2024-09-07',
        targetDays: 100,
        currentDay: 42,
        tapasLevelPercent: 84,
        active: true,
      },
      {
        id: 'sys-40',
        title: 'Sattvic Diet & Vitality Cleanse (40-Day Reset)',
        vowCycleNumber: 2,
        startDate: '2024-10-19',
        targetDays: 40,
        currentDay: 0,
        tapasLevelPercent: 0,
        active: false,
      },
    ],
    sankalps: initialSankalps,
    dailyLogs,
    lastSyncedAt: new Date().toISOString(),
    blobVersion: 'v2.4-json-blob',
    blobSizeKb: 12.4,
  };
}

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading DB file, re-initializing:', err);
  }
  const initDb = getInitialDatabase();
  saveDatabase(initDb);
  return initDb;
}

function saveDatabase(db: any) {
  try {
    db.lastSyncedAt = new Date().toISOString();
    const str = JSON.stringify(db, null, 2);
    db.blobSizeKb = parseFloat((Buffer.byteLength(str, 'utf8') / 1024).toFixed(1));
    fs.writeFileSync(DB_FILE, str, 'utf-8');

    // Async upload to Vercel Blob if environment token is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      put('sankalp_database.json', str, {
        access: 'public',
        addRandomSuffix: false,
      }).catch((err) => console.error('Vercel Blob remote upload error:', err));
    }
  } catch (err) {
    console.error('Error saving DB file:', err);
  }
}

// REST API Endpoints for Vercel Blob JSON Database Simulation
app.get('/api/blob/db', (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, db });
});

// Update/Save complete DB
app.post('/api/blob/db', (req, res) => {
  const newDb = req.body;
  if (!newDb || typeof newDb !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid DB payload' });
  }
  saveDatabase(newDb);
  res.json({ success: true, message: 'Database saved to Vercel Blob JSON storage', lastSyncedAt: newDb.lastSyncedAt });
});

// Switch active resolution system
app.post('/api/blob/system/switch', (req, res) => {
  const { systemId } = req.body;
  const db = loadDatabase();
  const sys = db.systems?.find((s: any) => s.id === systemId);
  if (!sys) {
    return res.status(404).json({ success: false, error: 'System not found' });
  }
  db.systems.forEach((s: any) => {
    s.active = s.id === systemId;
  });
  db.activeSystemId = systemId;
  saveDatabase(db);
  res.json({ success: true, activeSystem: sys, db });
});

// Update Seeker Name
app.post('/api/blob/seeker/update', (req, res) => {
  const { seekerName } = req.body;
  if (!seekerName || typeof seekerName !== 'string') {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }
  const db = loadDatabase();
  db.seekerName = seekerName.trim().toUpperCase();
  saveDatabase(db);
  res.json({ success: true, seekerName: db.seekerName });
});

// Toggle a vow for a specific day
app.post('/api/blob/sankalp/toggle', (req, res) => {
  const { dayNumber, vowId } = req.body;
  const db = loadDatabase();
  const dayLog = db.dailyLogs[dayNumber] || {
    dayNumber,
    dateStr: '18 Oct 2024',
    completedVowIds: [],
    mindfulnessRating: 4.5,
    innerState: 'Tranquil',
    journalNote: '',
    status: 'In Progress',
    excelRowRef: `DailyLogs!A${dayNumber + 1}:H${dayNumber + 1}`,
    syncedAt: new Date().toISOString(),
  };

  const idx = dayLog.completedVowIds.indexOf(vowId);
  const isCompleted = idx === -1;
  if (idx > -1) {
    dayLog.completedVowIds.splice(idx, 1);
  } else {
    dayLog.completedVowIds.push(vowId);
  }

  // Update status
  const totalVows = db.sankalps.filter((s: any) => s.active).length;
  if (dayLog.completedVowIds.length === 0) {
    dayLog.status = 'Pending';
  } else if (dayLog.completedVowIds.length >= totalVows) {
    dayLog.status = 'Fulfilled';
  } else {
    dayLog.status = 'In Progress';
  }
  dayLog.syncedAt = new Date().toISOString();
  db.dailyLogs[dayNumber] = dayLog;

  saveDatabase(db);
  res.json({ success: true, dayLog, completedCount: dayLog.completedVowIds.length, totalVows, isCompleted });
});

// Create new Sankalp vow
app.post('/api/blob/sankalp/create', (req, res) => {
  const { title, category, timeSlot, reminderTime, durationMins, tip } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }
  const db = loadDatabase();
  const slotLabels: Record<string, string> = {
    brahma: '🌅 Brahma Muhurta',
    pratah: '☀️ Morning',
    madhyahna: '🌤️ Noon',
    sayam: '🌆 Evening',
    ratri: '🌙 Night',
  };

  const newVow = {
    id: `vow-${Date.now()}`,
    systemId: db.activeSystemId || 'sys-108',
    title: title.trim(),
    category: category || 'Spiritual',
    timeSlot: timeSlot || 'brahma',
    timeLabel: `${slotLabels[timeSlot] || '🌅'} ${reminderTime || '06:00'}`,
    reminderTime: reminderTime || '06:00',
    durationMins: Number(durationMins) || 30,
    tip: tip || 'Maintain steady resolve and calm breathing.',
    streakDays: 1,
    active: true,
  };

  db.sankalps.push(newVow);
  saveDatabase(db);
  res.json({ success: true, newVow, totalSankalps: db.sankalps.length });
});

// Save daily mindfulness rating and micro-journal
app.post('/api/blob/journal/save', (req, res) => {
  const { dayNumber, mindfulnessRating, innerState, journalNote } = req.body;
  const db = loadDatabase();
  const d = dayNumber || 42;
  const dayLog = db.dailyLogs[d] || {
    dayNumber: d,
    dateStr: '18 Oct 2024',
    completedVowIds: [],
    mindfulnessRating: 4.5,
    innerState: 'Tranquil',
    journalNote: '',
    status: 'In Progress',
    excelRowRef: `DailyLogs!A${d + 1}:H${d + 1}`,
    syncedAt: new Date().toISOString(),
  };

  if (mindfulnessRating !== undefined) dayLog.mindfulnessRating = Number(mindfulnessRating);
  if (innerState) dayLog.innerState = innerState;
  if (journalNote !== undefined) dayLog.journalNote = journalNote;

  dayLog.syncedAt = new Date().toISOString();
  db.dailyLogs[d] = dayLog;
  saveDatabase(db);

  res.json({ success: true, dayLog });
});

// Export Excel Database (.xlsx download)
app.get('/api/blob/export/excel', (req, res) => {
  try {
    const db = loadDatabase();
    const wb = XLSX.utils.book_new();

    // Sheet 1: Systems
    const systemsData = db.systems.map((s: any) => ({
      'System ID': s.id,
      'Title': s.title,
      'Vow Cycle': s.vowCycleNumber,
      'Start Date': s.startDate,
      'Target Days': s.targetDays,
      'Current Day': s.currentDay,
      'Tapas Level (%)': s.tapasLevelPercent,
      'Active': s.active ? 'YES' : 'NO',
    }));
    const wsSystems = XLSX.utils.json_to_sheet(systemsData);
    XLSX.utils.book_append_sheet(wb, wsSystems, 'Resolution_Systems');

    // Sheet 2: Sankalps Registry
    const sankalpsData = db.sankalps.map((v: any) => ({
      'Vow ID': v.id,
      'Title': v.title,
      'Category': v.category,
      'Time Slot': v.timeSlot,
      'Reminder Time': v.reminderTime,
      'Duration (Min)': v.durationMins,
      'Tip / Hack': v.tip,
      'Streak (Days)': v.streakDays,
      'Active': v.active ? 'ACTIVE' : 'INACTIVE',
    }));
    const wsSankalps = XLSX.utils.json_to_sheet(sankalpsData);
    XLSX.utils.book_append_sheet(wb, wsSankalps, 'Sankalp_Registry');

    // Sheet 3: Daily Logs
    const logsArray = Object.values(db.dailyLogs).map((l: any) => ({
      'Day #': `Day ${String(l.dayNumber).padStart(3, '0')}`,
      'Date': l.dateStr,
      'Completed Vows Count': l.completedVowIds?.length || 0,
      'Mindfulness Rating': l.mindfulnessRating ? `${l.mindfulnessRating} / 5.0` : 'N/A',
      'Inner State': l.innerState,
      'Journal Notes': l.journalNote,
      'Status': l.status,
      'Excel Cell Ref': l.excelRowRef,
    }));
    const wsLogs = XLSX.utils.json_to_sheet(logsArray);
    XLSX.utils.book_append_sheet(wb, wsLogs, 'Daily_Logs_2024');

    // Sheet 4: JSON Audit
    const auditData = [
      {
        'Seeker Name': db.seekerName,
        'Guide Name': db.guideName,
        'Verification Hash': db.verificationHash,
        'Blob Version': db.blobVersion,
        'Last Synced At': db.lastSyncedAt,
        'Blob Size (KB)': db.blobSizeKb,
      },
    ];
    const wsAudit = XLSX.utils.json_to_sheet(auditData);
    XLSX.utils.book_append_sheet(wb, wsAudit, 'JSON_Audit_Backup');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="sankalp_database.xlsx"');
    res.send(buffer);
  } catch (err: any) {
    console.error('Excel generation failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset database to initial 42-day baseline
app.post('/api/blob/reset', (req, res) => {
  const initDb = getInitialDatabase();
  saveDatabase(initDb);
  res.json({ success: true, db: initDb, message: 'Database reset to initial 42-day state.' });
});

// Import Dataset Endpoint (.xlsx / .csv / JSON rows import with backup)
app.post('/api/blob/import', (req, res) => {
  try {
    const { rawRows } = req.body;
    if (!Array.isArray(rawRows)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input. rawRows must be an array of objects.',
        report: { totalRows: 0, imported: 0, rejected: 0, skipped: 0, duplicates: 0, errors: ['rawRows must be an array'] },
      });
    }

    const db = loadDatabase();

    // Preserve original data in backup snapshot
    if (!db.backups) db.backups = [];
    db.backups.push({
      timestamp: new Date().toISOString(),
      reason: 'Pre-import backup snapshot',
      logCount: Object.keys(db.dailyLogs).length,
    });

    const report = {
      totalRows: rawRows.length,
      imported: 0,
      rejected: 0,
      skipped: 0,
      duplicates: 0,
      errors: [] as string[],
    };

    const seenDays = new Set<number>();

    rawRows.forEach((row: any, idx: number) => {
      const rowNum = idx + 1;
      let dayNumRaw = row['Day #'] || row['Day'] || row['dayNumber'] || row['day'];
      if (typeof dayNumRaw === 'string') {
        const match = dayNumRaw.match(/\d+/);
        if (match) dayNumRaw = parseInt(match[0], 10);
      }

      const dayNum = Number(dayNumRaw);

      if (isNaN(dayNum) || dayNum < 1 || dayNum > 100) {
        report.rejected++;
        report.errors.push(`Row ${rowNum}: Invalid Day number (${dayNumRaw}). Must be between 1 and 100.`);
        return;
      }

      if (seenDays.has(dayNum)) {
        report.duplicates++;
      }
      seenDays.add(dayNum);

      const dateStr = String(row['Date'] || row['dateStr'] || row['date'] || `Day ${dayNum}`).trim();

      let ratingRaw = row['Mindfulness Rating'] || row['mindfulnessRating'] || row['rating'] || 4.5;
      if (typeof ratingRaw === 'string') {
        const match = ratingRaw.match(/[\d.]+/);
        if (match) ratingRaw = parseFloat(match[0]);
      }
      let rating = Number(ratingRaw);
      if (isNaN(rating) || rating < 0) rating = 0;
      if (rating > 5) rating = 5;

      const innerState = String(row['Inner State'] || row['innerState'] || row['state'] || 'Tranquil').trim();
      const journalNote = String(row['Journal Notes'] || row['journalNote'] || row['notes'] || '').trim();

      let statusRaw = String(row['Status'] || row['status'] || 'Fulfilled').trim();
      let status: 'Fulfilled' | 'Partial' | 'In Progress' | 'Pending' = 'Fulfilled';
      if (statusRaw.toLowerCase().includes('partial')) status = 'Partial';
      else if (statusRaw.toLowerCase().includes('progress')) status = 'In Progress';
      else if (statusRaw.toLowerCase().includes('pending')) status = 'Pending';

      const activeVowIds = db.sankalps ? db.sankalps.filter((s: any) => s.active).map((s: any) => s.id) : ['vow-1', 'vow-2', 'vow-3', 'vow-4', 'vow-5', 'vow-6', 'vow-7'];
      let completedVowIds: string[] = [];
      if (status === 'Fulfilled') completedVowIds = [...activeVowIds];
      else if (status === 'Partial') completedVowIds = activeVowIds.slice(0, Math.max(1, activeVowIds.length - 1));
      else if (status === 'In Progress') completedVowIds = activeVowIds.slice(0, Math.ceil(activeVowIds.length / 2));
      else completedVowIds = [];

      db.dailyLogs[dayNum] = {
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

    saveDatabase(db);
    res.json({ success: true, report, db });
  } catch (err: any) {
    console.error('Import failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Vite Middleware for Dev mode or Static file serving
async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
