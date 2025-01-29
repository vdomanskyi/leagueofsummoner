import { createMatch } from './matches';

import { Assets, Dataset, SessionStore, User } from '../interfaces/other.interface';

import { getParticipant } from '../utils';

const createTitle = (session: SessionStore) => {
  const _title = $('<p>').addClass('session-title__text').text('Session');
  const _kda = $('<p>').addClass('session-title__kda');

  let kda = session.kda.reduce((sum, kda) => sum + kda, 0);

  kda === 0 ? 0 : (kda = Number(kda.toFixed(1)));

  _kda.text(`KDA: ${kda}`);

  return $('<div>').addClass('session-title').append([_title, _kda]);
};

const createWinTotalLossStats = (user: User, session: SessionStore) => {
  const _sessionStats = $('<div>').addClass('win-total-loss-stats');

  const _wins = $('<p>').addClass('wins');
  const _losses = $('<p>').addClass('losses');
  const _total = $('<p>').addClass('total');

  let wins = 0;
  let losses = 0;
  let percent = 0;

  session.matches.forEach((match) => {
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

const createMatchList = (assets: Assets, user: User, session: SessionStore) => {
  const __list = $('<div>').addClass('session-matches');

  const matches: JQuery<HTMLElement>[] = [];

  session.matches.forEach((match) => {
    const participant = getParticipant(user, match);

    if (!participant) return;

    matches.push(createMatch(assets, match.metadata.matchId, participant));
  });

  if (!matches.length) __list.append($('<p>').addClass('session-matches__no-data').text('No matches'));
  else __list.append(matches);

  return __list;
};

export default async (assets: Assets, dataset: Dataset, session: SessionStore, firstRender?: boolean) => {
  return new Promise<Array<JQuery<HTMLElement>>>((resolve, reject) => {
    if (!dataset.character || !dataset.summoner || !dataset.user)
      return reject('No character, summoner, or user found');

    resolve([
      createTitle(session),
      createMatchList(assets, dataset.user, session),
      createWinTotalLossStats(dataset.user, session),
    ]);
  });
};
