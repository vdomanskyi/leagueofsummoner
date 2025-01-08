import match from '../match';

import { createMatch, getParticipant } from './matches';

import { Assets, Character, Data, SessionStoreData, User } from '../interfaces/other.interface';

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
  setup: (character: Character) =>
    store.set({
      startLP: character.leaguePoints,
      currentLP: character.leaguePoints,
      matches: {},
    }),
};

export const addMatchToStore = (matchId: string, win: boolean) => {
  const data = store.get();

  if (!data) return new Error('No data found');

  data.matches[matchId] = { win };

  store.set(data);
};

/**
 * Frame elements
 */

const createTitle = () => {
  const _title = $('<p>').addClass('session-title__text').text('Session');
  const _lp = $('<p>').addClass('session-title__score');

  const storeData = store.get();

  if (!storeData) _lp.text('No data');
  else {
    const score = (storeData.startLP - (storeData.currentLP || storeData.startLP)) * -1;

    _lp.text(`${score > 0 ? '+' : ''}${score}LP`);

    if (score > 0) _lp.addClass('win');
    else if (score < 0) _lp.addClass('loss');
    else _lp.removeClass('win').removeClass('loss');
  }

  return $('<div>').addClass('session-title').append([_title, _lp]);
};

const createWinTotalLossStats = () => {
  const _sessionStats = $('<div>').addClass('win-total-loss-stats');

  const _wins = $('<p>').addClass('wins');
  const _losses = $('<p>').addClass('losses');
  const _total = $('<p>').addClass('total');

  const data = store.get();

  let wins = 0;
  let losses = 0;
  let percent = 0;

  Object.values(data?.matches || {}).forEach(({ win }) => (win ? wins++ : losses++));
  percent = Number(((wins / (wins + losses)) * 100).toFixed(0));

  _wins.text(`${wins}W`);
  _losses.text(`${losses}L`);
  _total.text(`${wins + losses}`);

  _total.append($('<span>').text(`(${percent}%)`));

  _sessionStats.append([_wins, _total, _losses]);

  return _sessionStats;
};

const createMatchList = (assets: Assets, user: User) => {
  const __list = $('<div>').addClass('session-matches');

  const participant = getParticipant(user, match);

  if (!participant) return __list;

  const matches = [
    createMatch(assets, participant),
    createMatch(assets, { ...participant, win: false }),
    createMatch(assets, participant),
    createMatch(assets, { ...participant, win: false }),
    createMatch(assets, { ...participant, win: false }),
    createMatch(assets, participant),
  ];

  __list.append(matches);

  return __list;
};

export default async (assets: Assets, { user, character }: Data, firstRender?: boolean) => {
  if (!user || !character) return;

  if (firstRender) store.setup(character);

  return [createTitle(), createMatchList(assets, user), createWinTotalLossStats()];
};
