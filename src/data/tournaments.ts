export interface UpcomingTournament {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  dateDisplay: string;
  dateDisplayUpper: string;
  venue: string;
  venueShort: string;
  categories: string[];
  categoriesDisplay: string;
  time: string;
  timeDisplay: string;
  organizer: string;
  notes?: string;
}

/**
 * Calculates current status of a tournament in Indian Standard Time (IST).
 * Returns 'UPCOMING' before tournament begins, 'LIVE' during the tournament,
 * and 'COMPLETED' after event dates/times pass.
 */
export function getTournamentStatus(
  startDateStr: string,
  endDateStr: string,
  startTimeStr: string = '08:00',
  endTimeStr: string = '17:00'
): 'UPCOMING' | 'LIVE' | 'COMPLETED' {
  try {
    const now = new Date();
    // Parse start and end timestamps in IST (+05:30)
    const startIST = new Date(`${startDateStr}T${startTimeStr}:00+05:30`);
    const endIST = new Date(`${endDateStr}T${endTimeStr}:00+05:30`);

    const nowTime = now.getTime();
    if (nowTime < startIST.getTime()) {
      return 'UPCOMING';
    } else if (nowTime > endIST.getTime()) {
      return 'COMPLETED';
    } else {
      return 'LIVE';
    }
  } catch {
    return 'UPCOMING';
  }
}

export const upcomingTournamentsData: UpcomingTournament[] = [
  {
    id: 'asmita-rugby-state-tournament-2026',
    name: 'Asmita Rugby State Tournament',
    startDate: '2026-10-27',
    endDate: '2026-10-28',
    dateDisplay: '27–28 October 2026',
    dateDisplayUpper: '27–28 OCTOBER 2026',
    venue: 'Rohnawal Stadium, Haridwar, Uttarakhand',
    venueShort: 'Rohnawal Stadium, Haridwar',
    categories: ['Under-15', 'Under-18'],
    categoriesDisplay: 'U15 | U18',
    time: '8:00 AM to 5:00 PM',
    timeDisplay: '8:00 AM – 5:00 PM',
    organizer: 'Uttarakhand Rugby Association',
  },
];
