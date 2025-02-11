import assets from './static/assets';

import error from './frames/error';

import general from './frames/general';
import matches from './frames/matches';
import session from './frames/session';

import { Match } from './interfaces/match.interface';
import {
  Character,
  Dataset,
  Detail,
  RANKED,
  RiotError,
  SessionStore,
  Summoner,
  User,
} from './interfaces/other.interface';

import requests from './requests';

import { getParticipant } from './utils';

const widget = $('.widget').addClass('loading');

const border = {
  topBottom:
    'data:image/png;base64,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',
  leftRight:
    'data:image/png;base64,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',
};

const hasDivisions: Record<RANKED, boolean> = {
  [RANKED.IRON]: true,
  [RANKED.BRONZE]: true,
  [RANKED.SILVER]: true,
  [RANKED.GOLD]: true,
  [RANKED.PLATINUM]: true,
  [RANKED.EMERALD]: true,
  [RANKED.DIAMOND]: true,
  [RANKED.MASTER]: false,
  [RANKED.GRANDMASTER]: false,
  [RANKED.CHALLENGER]: false,
};

const dataset: Dataset = {
  fields: null,
  user: null,
  character: null,
  summoner: null,

  matcheIds: [],
  matches: [],
};

const sessionstore: SessionStore = {
  matches: [],
  kda: [],
};

/**
 * GET DATA
 */

const fetchData = async (firstRender?: boolean) => {
  return new Promise(async (resolve, reject) => {
    if (!dataset.fields) return reject('No fields found');

    try {
      if (firstRender) {
        const user = await requests.general.getUser(dataset.fields);
        if (Object.hasOwn(user.data, 'status_code')) return reject((user.data as RiotError).message);
        else dataset.user = user.data as User;

        const summoner = await requests.general.getSummonerByPUUID(dataset.fields, dataset.user.puuid);
        if (Object.hasOwn(summoner.data, 'status_code')) return reject((summoner.data as RiotError).message);
        else dataset.summoner = summoner.data as Summoner;
      }

      if (!dataset.summoner) return reject('No summoner found');

      const character = await requests.general.getCharacterList(dataset.fields, dataset.summoner.id);
      if (Object.hasOwn(character.data, 'status_code')) return reject((character.data as RiotError).message);
      else {
        dataset.character =
          (character.data as Character[]).find((c) => c.queueType === dataset.fields?.rankedQueue) || null;
      }

      if (!dataset.character) return reject('No character found');

      const matchIds = await requests.match.getMatchList(dataset.fields, dataset.summoner.puuid);
      if (Object.hasOwn(matchIds.data, 'status_code')) return reject((matchIds.data as RiotError).message);
      else dataset.matcheIds = matchIds.data as string[];

      await Promise.all(
        dataset.matcheIds.map(async (matchId) => {
          if (!dataset.matches.some((m) => m.metadata.matchId === matchId) && dataset.fields && dataset.user) {
            const match = await requests.match.getMatchById(dataset.fields, matchId);
            const participant = getParticipant(dataset.user, match.data as Match);

            if (Object.hasOwn(match.data, 'status_code')) return reject((match.data as RiotError).message);
            else dataset.matches.push(match.data as Match);

            if (!firstRender && participant) {
              sessionstore.kda.push(participant.challenges.kda);
              sessionstore.matches.unshift(match.data as Match);
            }
          }
        })
      );

      dataset.matches.sort((a, b) => b.info.gameCreation - a.info.gameCreation);
      sessionstore.matches.sort((a, b) => b.info.gameCreation - a.info.gameCreation);

      dataset.matches.splice(7);
      sessionstore.matches.splice(6);

      resolve(undefined);
    } catch (error: any) {
      reject(error);
    }
  });
};

/**
 * UI ELEMENTS AND ANIMATION.
 */

const createBackground = () => {
  if (!assets || !dataset.character) return;

  const _banner = $('<img>')
    .addClass('banner')
    .attr('src', `${assets.bannerFolder}/${assets.banner[dataset.character.tier]}`);

  return $('<div>').addClass('background').append(_banner).get(0);
};

const createBorder = () => {
  const _borderTopBottom = $('<img>').addClass('border').attr('src', border.topBottom);
  const _borderLeftRight = $('<img>').addClass('border').addClass('left-right').attr('src', border.leftRight);

  return [_borderTopBottom, _borderLeftRight];
};

const animate = () => {
  if (!dataset.fields) return;

  const row = $('.row');

  const width = row.width() || 0;
  const countFrames = row.children().length;

  const timeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
    defaults: { ease: Power1.easeInOut, duration: dataset.fields.transitionDuration },
  });

  for (let i = 0; i < countFrames; i++) {
    const gap = width * i * -1;
    const time = i === 1 ? '<' : `>+${dataset.fields.pauseDuration}`;

    timeline.to('.row', { x: gap }, time);
  }
};

/**
 * INITIALIZE
 */

const createFrame = (className: string, node: JQuery<HTMLElement>[]) => {
  const _frame = $('<div>').addClass('frame').addClass(className);
  const _content = $('<div>').addClass('content').append(node);

  return _frame.append(_content);
};

const frames = async (firstRender?: boolean) => {
  if (!assets || !dataset.character || !dataset.fields) return;

  const _row = $('<div>').addClass('row');
  const _frames: JQuery<HTMLElement>[] = [];

  try {
    const _general = await general(assets, dataset, hasDivisions[dataset.character!.tier]);
    _frames.push(createFrame('general', _general));

    const _matches = await matches(assets, dataset);
    _frames.push(createFrame('matches', _matches));

    const _session = await session(assets, dataset, sessionstore, firstRender);
    _frames.push(createFrame('session', _session));
  } catch (error: any) {
    //
  }

  if (_frames.length) _row.append([..._frames, $(_frames[0]).clone(true)]);

  $('.row').remove();
  $('.background').remove();

  return {
    frames: [createBackground()!, _row],
    countFrames: _row.children().length,
  };
};

const factory = async (firstRender?: boolean) => {
  if (!dataset.fields) return;

  try {
    await fetchData(firstRender);

    const F = await frames(firstRender);
    if (!F) return new Error('No frames created');

    const timer = (F.countFrames - 1) * (dataset.fields.pauseDuration + dataset.fields.transitionDuration) * 15000;

    widget.append(F.frames || []);

    animate();

    setTimeout(factory, timer);

    if (firstRender) widget.removeClass('loading').append(createBorder());
  } catch (err: any) {
    widget
      .removeClass('loading')
      .addClass('error')
      .append(createFrame('issue', error(err)));
  }
};

addEventListener('onWidgetLoad', async (obj) => {
  dataset.fields = (obj as unknown as Detail).detail.fieldData;

  factory(true);
});
