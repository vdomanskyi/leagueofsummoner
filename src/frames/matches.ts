import { Assets } from '../interfaces/other.interface';
import { Dataset } from '../interfaces/other.interface';
import { Participant } from '../interfaces/match.interface';

import { getParticipant } from '../utils';

/**
 * Frame elements
 */

export const createMatch = (assets: Assets, matchId: string, participant: Participant) => {
  const countPings = (Object.keys(participant) as (keyof Participant)[])
    .filter((k) => k.toLowerCase().includes('pings'))
    .reduce((sum, key) => sum + Number(participant[key]), 0);

  const _match = $('<div>').attr('id', matchId).addClass('match');

  const _champion = $('<div>').addClass('champion');
  const _matchStats = $('<div>').addClass('match__stats');
  const _stats = $('<p>').addClass('stats');

  const _bait = $('<img>').addClass('bait').attr('src', assets.baitPing);
  const _count = $('<p>').text(`${countPings}`);
  const _pings = $('<div>').addClass('pings');

  _stats.text(`${participant.kills}/${participant.deaths}/${participant.assists}`);
  _pings.append([_bait, _count]);

  _champion.append($('<img>').attr('src', `${assets.championIcons}/${participant.championId}.png`));
  _matchStats.append([_stats, _pings]);

  _match.append([_champion, _matchStats]);

  if (participant.win) _match.addClass('win');

  return _match;
};

const createLastMatch = (assets: Assets, matchId: string, participant: Participant) => {
  $('.last-match').remove();

  const _lastMatch = $('<div>').addClass('last-match');

  const _title = $('<p>').addClass('title');
  const _last = $('<span>').addClass('last').text('Last');

  const _match = $('<span>').addClass('match').text('match:');

  _title.append([_last, _match]);

  _lastMatch.append(_title, createMatch(assets, matchId, participant));

  return _lastMatch;
};

export default async (assets: Assets, dataset: Dataset) => {
  return new Promise<Array<JQuery<HTMLElement>>>((resolve, reject) => {
    if (!dataset.character || !dataset.summoner || !dataset.user)
      return reject('No character, summoner, or user found');

    if (!dataset.matches.length) return resolve([$('<p>').addClass('matches__no-data').text('No matches')]);

    const _previous: Array<JQuery<HTMLElement>> = [];
    let _last: JQuery<HTMLElement> | null = null;

    dataset.matches.forEach((match, index) => {
      const participant = getParticipant(dataset.user!, match);

      if (!participant) return;

      index
        ? _previous.push(createMatch(assets, match.metadata.matchId, participant))
        : (_last = createLastMatch(assets, match.metadata.matchId, participant));
    });

    resolve([_last!, $('<div>').addClass('matches').append(_previous)]);
  });
};
