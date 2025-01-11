import { createMatch, getParticipant } from './matches';

import { Dataset, SessionStore, User } from '../interfaces/other.interface';
import { Assets } from '../interfaces/other.interface';

const createTitle = (session: SessionStore) => {
  const _title = $('<p>').addClass('session-title__text').text('Session');
  const _lp = $('<p>').addClass('session-title__score');

  const score = (session.startLP - session.currentLP) * -1;

  _lp.text(`${score > 0 ? '+' : ''}${score}LP`);

  if (score > 0) _lp.addClass('win');
  else if (score < 0) _lp.addClass('loss');
  else _lp.removeClass('win').removeClass('loss');

  return $('<div>').addClass('session-title').append([_title, _lp]);
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

export default async (assets: Assets, dataset: Dataset, session: SessionStore) => {
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
