import { Match } from './interfaces/match.interface';

import type { Character, Fields, RiotError, Summoner, User } from './interfaces/other.interface';

const proxy = axios.create({ baseURL: 'https://aziankew.mooo.com:3443/proxy' });

export default {
  general: {
    getUser: async function (fields: Fields) {
      const rawPath = `https://${fields.platformRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${fields.gameName}/${fields.tagLine}?api_key=${fields.API_KEY}`;
      return proxy.post<User | RiotError>('', { rawPath });
    },
    getCharacterList: async function (fields: Fields, summonerId: string) {
      const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${fields.API_KEY}`;
      return proxy.post<Character[] | RiotError>('', { rawPath });
    },
    getSummonerByPUUID: async function (fields: Fields, puuid: string) {
      const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${fields.API_KEY}`;
      return proxy.post<Summoner | RiotError>('', { rawPath });
    },
  },

  match: {
    getMatchList: async function (fields: Fields, puuid: string, count = 1) {
      const rawPath = `https://${fields.platformRouting}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=${fields.matchesType}&start=0&count=${count}&api_key=${fields.API_KEY}`;
      return proxy.post<string[] | RiotError>('', { rawPath });
    },
    getMatchById: async function (fields: Fields, matchId: string) {
      const rawPath = `https://${fields.platformRouting}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${fields.API_KEY}`;
      return proxy.post<Match | RiotError>('', { rawPath });
    },
  },
};
