import match from '../match';

import { createMatch, getParticipant } from './matches';

import { Assets, Data, User } from '../interfaces/other.interface';

import store from '../store';

/**
 * Frame elements
 */

const createTitle = async () => {
  const _title = $('<p>').addClass('session-title__text').text('Session');
  const _lp = $('<p>').addClass('session-title__score');

  const storeData = await store.get();

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

const createWinTotalLossStats = async (user: User) => {
  const _sessionStats = $('<div>').addClass('win-total-loss-stats');

  const _wins = $('<p>').addClass('wins');
  const _losses = $('<p>').addClass('losses');
  const _total = $('<p>').addClass('total');

  const data = await store.get();

  let wins = 0;
  let losses = 0;
  let percent = 0;

  data?.matches?.forEach((match) => {
    const participant = getParticipant(user, match);

    if (participant) participant.win ? wins++ : losses++;
  });

  percent = wins > 0 ? Number(((wins / (wins + losses)) * 100).toFixed(0)) : 0;

  _wins.text(`${wins}W`);
  _losses.text(`${losses}L`);
  _total.text(`${wins + losses}`);

  _total.append($('<span>').text(`(${percent}%)`));

  _sessionStats.append([_wins, _total, _losses]);

  return _sessionStats;
};

const createMatchList = async (assets: Assets, user: User) => {
  const storeData = await store.get();

  const __list = $('<div>').addClass('session-matches');

  const matches: JQuery<HTMLElement>[] = [];

  (storeData?.matches || []).forEach((match) => {
    const participant = getParticipant(user, match);

    if (participant) matches.push(createMatch(assets, match.metadata.matchId, participant));
  });

  if (!matches.length) __list.append($('<p>').addClass('session-matches__no-data').text('No matches'));
  else __list.append(matches);

  return __list;
};

export default async (assets: Assets, { user, character }: Data, firstRender?: boolean) => {
  if (!user || !character) return;

  if (!firstRender) await store.setField('currentLP', character.leaguePoints);

  return Promise.all([createTitle(), createMatchList(assets, user), createWinTotalLossStats(user)]);
};
