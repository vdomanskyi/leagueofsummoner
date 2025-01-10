// import { Character, SessionStoreData } from './interfaces/other.interface';
// import { Match } from './interfaces/match.interface';

// const storeName = `LoS_v1.0.0`;
// const store = {
//   set: (data: SessionStoreData) => SE_API.store.set(storeName, data),
//   get: async (): Promise<SessionStoreData | null> => {
//     const value = await SE_API.store.get(storeName);

//     return !value ? null : value;
//   },
//   setField: async (key: keyof SessionStoreData, value: any) => {
//     const data = await store.get();

//     if (!data) return new Error('No data found');

//     data[key] = value;

//     store.set(data);
//   },
//   init: (character: Character, matches: Match[]) => {
//     store.set({
//       startLP: character.leaguePoints,
//       currentLP: character.leaguePoints,
//       oldMatchIds: matches.map((m) => m.metadata.matchId),
//       matches: [],
//     });
//   },
// };

// export default store;
