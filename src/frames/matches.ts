import { Match, Participant } from '../interfaces/match.interface';
import { Assets, Data, Fields, User } from '../interfaces/other.interface';

import store from '../store';

import requests from '../requests';

const addMatchesToSession = (m: Match[]) => {
  const storeData = store.get();

  if (!storeData) return;

  const newSessionMatches = m
    .filter((match) => !storeData.oldMatchIds?.includes(match.metadata.matchId))
    .filter(
      (match) => !storeData.matches?.some((storedMatch) => storedMatch.metadata.matchId === match.metadata.matchId)
    );

  if (newSessionMatches.length) {
    const seesionMatches = storeData.matches || [];

    seesionMatches.unshift(...newSessionMatches);

    if (seesionMatches.length >= 6) seesionMatches.splice(6);

    console.log('seesionMatches', seesionMatches);

    store.setField('matches', seesionMatches);
  }
};

export const getParticipant = (user: User, match: Match) =>
  match.info.participants.find((p) => p.riotIdGameName === user.gameName && p.riotIdTagline === user.tagLine);

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

export default async (assets: Assets, { user, character, matchIds }: Data, fields: Fields, firstRender?: boolean) => {
  if (!user || !character) return;

  const matches: Match[] = [];

  const _list: Array<JQuery<HTMLElement>> = [];
  const _previousMatches: Array<JQuery<HTMLElement>> = [];

  let _lastMatch: JQuery<HTMLElement> | null = null;

  await Promise.all(
    matchIds.map((id) =>
      requests.match.getMatchById(fields, id).then((res) => {
        matches.push(res.data);
      })
    )
  );

  if (firstRender) store.init(character, matches);
  else addMatchesToSession(matches);

  matches.sort((a, b) => b.info.gameCreation - a.info.gameCreation);

  matches.forEach((match, index) => {
    const participant = getParticipant(user, match);

    if (!participant) return;

    index
      ? _previousMatches.push(createMatch(assets, match.metadata.matchId, participant))
      : (_lastMatch = createLastMatch(assets, match.metadata.matchId, participant));
  });

  if (_lastMatch) _list.push(_lastMatch);

  _list.push($('<div>').addClass('matches').append(_previousMatches));

  console.log('interval');

  return _list;
};
