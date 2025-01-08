import { Character, SessionStoreData } from './interfaces/other.interface';
import { Match } from './interfaces/match.interface';

const storeName = `LoS_v1.0.0`;

const store = {
  set: (data: SessionStoreData) => sessionStorage.setItem(storeName, JSON.stringify(data)),
  get: (): SessionStoreData | null => {
    const value = sessionStorage.getItem(storeName);

    return !value ? null : JSON.parse(value);
  },
  setField: (key: keyof SessionStoreData, value: any) => {
    const data = store.get();

    if (!data) return new Error('No data found');

    data[key] = value;

    store.set(data);
  },
  init: (character: Character, matches: Match[]) => {
    store.set({
      startLP: character.leaguePoints,
      currentLP: character.leaguePoints,
      oldMatchIds: matches.map((m) => m.metadata.matchId),
      matches: matches.slice(0, 6),
      // matches: [],
    });
  },
};

export default store;
