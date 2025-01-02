import { Match } from './interfaces/match.interface';
import type { Character, Fields, Summoner, User } from './interfaces/other.interface';

const proxy = axios.create({
  baseURL: 'https://gfb4yi67pbkrvi4wbrol7ktlym0uvsqp.lambda-url.eu-north-1.on.aws/',
});

export default {
  general: {
    getUser: async function (fields: Fields) {
      const rawPath = `https://${fields.platformRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${fields.gameName}/${fields.tagLine}?api_key=${fields.API_KEY}`;
      return proxy.post<User>('', { rawPath });
    },
    getCharacterList: async function (fields: Fields, summonerId: string) {
      const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${fields.API_KEY}`;
      return proxy.post<Character[]>('', { rawPath });
    },
    getSummonerByPUUID: async function (fields: Fields, puuid: string) {
      const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${fields.API_KEY}`;
      return proxy.post<Summoner>('', { rawPath });
    },
  },

  match: {
    getMatchList: async function (fields: Fields, puuid: string, count = 7) {
      const rawPath = `https://${fields.platformRouting}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=${fields.matchesType}&start=0&count=${count}&api_key=${fields.API_KEY}`;
      return proxy.post<string[]>('', { rawPath });
    },
    getMatchById: async function (fields: Fields, matchId: string) {
      const rawPath = `https://${fields.platformRouting}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${fields.API_KEY}`;
      return proxy.post<Match>('', { rawPath });
    },
  },

  // champion: {
  //   getChampionTop: async function (fields: Fields, puuid: string, count = 3) {
  //     const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}&api_key=${fields.API_KEY}`;
  //     return proxy.post('', { rawPath });
  //   },
  // },
};
