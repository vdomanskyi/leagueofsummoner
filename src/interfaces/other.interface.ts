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

export interface RiotError {
  message: string;
  status_code: number;
}

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
  matchesType: MATCH_TYPE;
  gameName: string;
  tagLine: string;
  API_KEY: string;
  rankedQueue: RANKED_QUEUE;
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
  queueType: RANKED_QUEUE;
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

export interface Dataset {
  fields: Fields | null;
  user: User | null;
  character: Character | null;
  summoner: Summoner | null;

  matcheIds: string[];
  matches: Match[];
}

export interface SessionStore {
  matches: Match[];
  kda: number[];
}

export enum RANKED_QUEUE {
  RANKED_FLEX_SR = 'RANKED_FLEX_SR',
  RANKED_SOLO_5x5 = 'RANKED_SOLO_5x5',
}

export enum MATCH_TYPE {
  ranked = 'ranked',
  normal = 'normal',
  tourney = 'tourney',
  tutorial = 'tutorial',
}
