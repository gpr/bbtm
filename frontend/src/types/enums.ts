// T028: TeamRace and RegistrationStatus enums

// Team races available for Blood Bowl tournaments
export const TeamRace = {
  HUMAN: 'human',
  ORC: 'orc',
  DWARF: 'dwarf',
  SKAVEN: 'skaven',
  WOOD_ELF: 'wood_elf',
  DARK_ELF: 'dark_elf',
  HIGH_ELF: 'high_elf',
  CHAOS: 'chaos',
  UNDEAD: 'undead',
  HALFLING: 'halfling',
  GOBLIN: 'goblin',
  AMAZON: 'amazon',
  LIZARDMAN: 'lizardman',
  NORSE: 'norse',
  NECROMANTIC: 'necromantic',
  NURGLE: 'nurgle',
  VAMPIRE: 'vampire',
  CHAOS_DWARF: 'chaos_dwarf',
  UNDERWORLD: 'underworld',
  OGRE: 'ogre',
} as const;

export type TeamRace = typeof TeamRace[keyof typeof TeamRace];

// Status of a coach's tournament registration
export const RegistrationStatus = {
  PENDING: 'pending', // Awaiting confirmation
  CONFIRMED: 'confirmed', // Registration confirmed
  CANCELLED: 'cancelled', // Registration cancelled
  WAITLIST: 'waitlist', // On waiting list (if tournament full)
} as const;

export type RegistrationStatus = typeof RegistrationStatus[keyof typeof RegistrationStatus];

// Team race display names for UI
export const TEAM_RACE_LABELS: Record<TeamRace, string> = {
  [TeamRace.HUMAN]: 'Human',
  [TeamRace.ORC]: 'Orc',
  [TeamRace.DWARF]: 'Dwarf',
  [TeamRace.SKAVEN]: 'Skaven',
  [TeamRace.WOOD_ELF]: 'Wood Elf',
  [TeamRace.DARK_ELF]: 'Dark Elf',
  [TeamRace.HIGH_ELF]: 'High Elf',
  [TeamRace.CHAOS]: 'Chaos',
  [TeamRace.UNDEAD]: 'Undead',
  [TeamRace.HALFLING]: 'Halfling',
  [TeamRace.GOBLIN]: 'Goblin',
  [TeamRace.AMAZON]: 'Amazon',
  [TeamRace.LIZARDMAN]: 'Lizardman',
  [TeamRace.NORSE]: 'Norse',
  [TeamRace.NECROMANTIC]: 'Necromantic',
  [TeamRace.NURGLE]: 'Nurgle',
  [TeamRace.VAMPIRE]: 'Vampire',
  [TeamRace.CHAOS_DWARF]: 'Chaos Dwarf',
  [TeamRace.UNDERWORLD]: 'Underworld',
  [TeamRace.OGRE]: 'Ogre',
};

// Registration status display names for UI
export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  [RegistrationStatus.PENDING]: 'Pending',
  [RegistrationStatus.CONFIRMED]: 'Confirmed',
  [RegistrationStatus.CANCELLED]: 'Cancelled',
  [RegistrationStatus.WAITLIST]: 'Waitlist',
};

// Team race colors for UI (hex colors)
export const TEAM_RACE_COLORS: Record<TeamRace, string> = {
  [TeamRace.HUMAN]: '#4A90E2',
  [TeamRace.ORC]: '#7ED321',
  [TeamRace.DWARF]: '#8B5A3C',
  [TeamRace.SKAVEN]: '#50E3C2',
  [TeamRace.WOOD_ELF]: '#9013FE',
  [TeamRace.DARK_ELF]: '#D0021B',
  [TeamRace.HIGH_ELF]: '#F5A623',
  [TeamRace.CHAOS]: '#BD10E0',
  [TeamRace.UNDEAD]: '#417505',
  [TeamRace.HALFLING]: '#B8E986',
  [TeamRace.GOBLIN]: '#F8E71C',
  [TeamRace.AMAZON]: '#F01A35',
  [TeamRace.LIZARDMAN]: '#6AB04C',
  [TeamRace.NORSE]: '#FF9F43',
  [TeamRace.NECROMANTIC]: '#5F27CD',
  [TeamRace.NURGLE]: '#10AC84',
  [TeamRace.VAMPIRE]: '#8C7AE6',
  [TeamRace.CHAOS_DWARF]: '#E55039',
  [TeamRace.UNDERWORLD]: '#3C6382',
  [TeamRace.OGRE]: '#A4B0BE',
};

// Registration status colors for UI
export const REGISTRATION_STATUS_COLORS: Record<RegistrationStatus, string> = {
  [RegistrationStatus.PENDING]: '#F5A623',
  [RegistrationStatus.CONFIRMED]: '#7ED321',
  [RegistrationStatus.CANCELLED]: '#D0021B',
  [RegistrationStatus.WAITLIST]: '#9013FE',
};

// Helper functions for working with enums
export const getTeamRaceOptions = () => {
  return Object.values(TeamRace).map((race) => ({
    value: race,
    label: TEAM_RACE_LABELS[race],
    color: TEAM_RACE_COLORS[race],
  }));
};

export const getRegistrationStatusOptions = () => {
  return Object.values(RegistrationStatus).map((status) => ({
    value: status,
    label: REGISTRATION_STATUS_LABELS[status],
    color: REGISTRATION_STATUS_COLORS[status],
  }));
};

// Type guards
export const isValidTeamRace = (value: string): value is TeamRace => {
  return Object.values(TeamRace).includes(value as TeamRace);
};

export const isValidRegistrationStatus = (value: string): value is RegistrationStatus => {
  return Object.values(RegistrationStatus).includes(value as RegistrationStatus);
};

// Default values
export const DEFAULT_TEAM_RACE = TeamRace.HUMAN;
export const DEFAULT_REGISTRATION_STATUS = RegistrationStatus.PENDING;