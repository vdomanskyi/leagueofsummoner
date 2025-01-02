import { Match } from './match.interface';

export interface Detail {
  detail: {
    fieldData: Fields;
  };
}

export type Assets = {
  profileIcon: string;
  rankedFolder: string;
  bannerFolder: string;
  championIcons: string;
  baitPing: string;
  banner: Record<RANKED, string>;
  ranked: Record<RANKED, string>;
};

export enum RANKED {
  IRON = 'IRON',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  EMERALD = 'EMERALD',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
  CHALLENGER = 'CHALLENGER',
}

export interface Fields {
  pauseDuration: number;
  transitionDuration: number;
  flipBorder: boolean;
  regionalRouting: string;
  platformRouting: string;
  matchesType: string;
  gameName: string;
  tagLine: string;
  API_KEY: string;
}

export interface Data {
  user: User | null;
  character: Character | null;
  summoner: Summoner | null;
  matchIds: Array<string>;
  matches: Array<Match>;
}

export interface Character {
  leagueId: string;
  queueType: string;
  tier: RANKED;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: number;
  inactive: number;
  freshBlood: number;
  hotStreak: number;
}

export interface User {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}
