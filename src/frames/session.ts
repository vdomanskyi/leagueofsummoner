// /**
//  * FRAME: SESSION
//  */
// const createSessionWinLosses = () => {
//   const _title = $('<p>').addClass('title').text('W/L');

//   const _win = $('<span>').addClass('win').text(`${session.win.get()}W`);
//   const _losses = $('<span>').addClass('losses').text(`${session.losses.get()}L`);
//   const _total = $('<span>').addClass('total').text(`${session.win.get() + session.losses.get()}`);

//   if (session.win.get() > 0) {
//     const value = ((session.win.get() / (session.win.get() + session.losses.get())) * 100).toFixed(0);
//     const _percent = $('<span>').text(`(${value}%)`);

//     _total.append(_percent.get(0));
//   }

//   const _value = $('<p>').addClass('value').append(_win.get(0), _total.get(0), _losses.get(0));
//   const _sessionWinLosses = $('<div>').addClass('session-win-losses').append([_title.get(0), _value.get(0)]);

//   return _sessionWinLosses.get(0);
// };

// const createSessionKDA = () => {
//   const kda = session.kda.get().reduce((acc, curr) => acc + curr, 0) / session.kda.get().length;

//   const _title = $('<p>').addClass('title').text('KDA');
//   const _value = $('<p>').addClass('value').text(kda.toFixed(2));
//   const _sessionKDA = $('<div>').addClass('session-kda').append([_title.get(0), _value.get(0)]);

//   return _sessionKDA.get(0);
// }

// const createSessionStats = () => {
//   const _title = $('<p>').addClass('session-title').text('Session');
//   const _stats = $('<div>').addClass('session-stats').append(createSessionWinLosses(), createSessionKDA())
//   const _container = $('<div>').addClass('session-container').append(_title.get(0), _stats.get(0));

//   return _container.get(0);
// }

// const createTopChampionMasteries = () => {
//   const _title = $('<p>').addClass('title').text('Champion masteries');
//   const _champions = $('<div>').addClass('masteries');

//   data.topChampionMasteries.forEach((c) => {
//     const points = new Intl.NumberFormat('en-US', { notation: 'compact',  compactDisplay: 'short', maximumFractionDigits: 1, }).format(c.championPoints);

//     const _champion = $('<img>').addClass('champion').attr('src', `${assets.championIcons}/${c.championId}.png`);
//     const _points = $('<p>').addClass('points').text(points);

//     const _mastery = $('<div>').addClass('mastery').append([_champion.get(0), _points.get(0)]);

//     _champions.append(_mastery.get(0));
//   })

//   return $('<div>').addClass('champions').append([_title.get(0), _champions.get(0)]);
// };

import match from '../match';
import pkg from '../../package.json';

import { createMatch, getParticipant } from './matches';

import { Assets, Data, SessionStoreData, User } from '../interfaces/other.interface';

const storeName = `LoS_v${pkg.version}`;

const store = {
  set: (data: SessionStoreData) => sessionStorage.setItem(storeName, JSON.stringify(data)),
  get: (): SessionStoreData | null => {
    const value = sessionStorage.getItem(storeName);

    return typeof value === 'object' && value !== null ? JSON.parse(value) : null;
  },
};

const createTitle = () => {
  const _title = $('<p>').addClass('session-title__text').text('Session');
  const _lp = $('<p>').addClass('session-title__score').addClass('loss').text(`${-4}LP`);

  return $('<div>').addClass('session-title').append([_title, _lp]);
};

const createSessionStats = () => {
  const _sessionStats = $('<div>').addClass('win-total-loss-stats');

  const _wins = $('<p>').addClass('wins').text(`${18}W`);
  const _losses = $('<p>').addClass('losses').text(`${1}L`);
  const _total = $('<p>')
    .addClass('total')
    .text(`${18 + 1}`);

  // if (character.wins > 0) {
  // const value = ((character.wins / (character.wins + character.losses)) * 100).toFixed(0);
  const _percent = $('<span>').text(`(${99}%)`);

  _total.append(_percent);
  // }

  _sessionStats.append([_wins, _total, _losses]);

  return _sessionStats;
};

const createMatchList = (assets: Assets, user: User) => {
  const __list = $('<div>').addClass('session-matches');

  const participant = getParticipant(user, match);

  if (!participant) return __list;

  const matches = [
    createMatch(assets, participant),
    createMatch(assets, participant),
    createMatch(assets, participant),
    createMatch(assets, participant),
    createMatch(assets, participant),
    createMatch(assets, participant),
  ];

  __list.append(matches);

  return __list;
};

export default async (assets: Assets, { user }: Data) => {
  if (!user) return;

  return [createTitle(), createMatchList(assets, user), createSessionStats()];
};
