// 20 requests every 1 seconds(s)
// 100 requests every 2 minutes(s)

import requests from './requests';

import general from './frames/general';
import matches from './frames/matches';

import border from './static/border.json';

import { type Assets, type Data, type Fields, type Detail, RANKED } from './interfaces/other.interface';

const _LoS_ = '[League of Summoner]';

const widget = $('.widget').addClass('loading');

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
  [RANKED.CHALLENGE]: false,
};

let assets: Assets | null = null;
let fields: Fields | null = null;
let data: Data = {
  user: null,
  character: null,
  summoner: null,

  matchIds: [],
  matches: [],
};

/**
 * GET ASSETS AND USER DATA
 */

const getUserData = async () => {
  if (!fields) return console.error(_LoS_, 'No fields found');

  await requests.general.getUser(fields).then((res) => {
    data.user = res.data;
  });

  if (data.user === null) return console.error(_LoS_, 'No user found');

  await requests.general.getSummonerByPUUID(fields, data.user.puuid).then((res) => {
    data.summoner = res.data;
  });

  if (data.summoner === null) return console.error(_LoS_, 'No summoner found');

  await requests.general.getCharacterList(fields, data.summoner.id).then((res) => {
    data.character = res.data.find((c) => c.queueType === 'RANKED_SOLO_5x5') || null;
  });

  if (data.character === null) return console.error(_LoS_, 'No character found');

  await requests.match.getMatchList(fields, data.user.puuid).then((res) => {
    data.matchIds = res.data;
  });
};

const getAssetsUrls = async () => {
  const url = 'https://raw.githubusercontent.com/vdomanskyi/leagueofsummoner/refs/heads/main/dist/assets.json';

  await $.getJSON(url, (json) => {
    assets = json;
  });
};

/**
 * UI ELEMENTS
 */

const createBackground = () => {
  if (!assets || !data.character) return;

  const _banner = $('<img>')
    .addClass('banner')
    .attr('src', `${assets.bannerFolder}/${assets.banner[data.character.tier]}`);

  return $('<div>').addClass('background').append(_banner).get(0);
};

const createBorder = () => {
  const _borderTopBottom = $('<img>').addClass('border').attr('src', border.topBottom);
  const _borderLeftRight = $('<img>').addClass('border').addClass('left-right').attr('src', border.leftRight);

  return [_borderTopBottom, _borderLeftRight];
};

const animate = () => {
  if (!fields) return;

  const row = $('.row');

  const width = row.width()!;
  const countFrames = row.children().length;
  const frameWidth = width / countFrames;

  const timeline = window.gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
    defaults: { ease: window.Power1.easeInOut, duration: fields.transitionDuration },
  });

  for (let i = 0; i < countFrames; i++) {
    const gap = frameWidth * i * -1;
    const time = i === 1 ? '<' : `>+${fields.pauseDuration}`;

    timeline.to('.animation', { x: gap }, time);
  }
};

/**
 * RENDERING LOGIC
 */

const createFrame = (className: string, node: JQuery<HTMLElement>[]) => {
  const _frame = $('<div>').addClass('frame').addClass(className);
  const _content = $('<div>').addClass('content').append(node);

  return _frame.append(_content);
};

const frames = async () => {
  if (!assets || !data.character || !fields) return;

  const _row = $('<div>').addClass('row');
  const _frames: JQuery<HTMLElement>[] = [];

  await general(_LoS_, assets, data, hasDivisions[data.character.tier]).then((frame) => {
    if (frame) _frames.push(createFrame('general', frame));
  });

  await matches(_LoS_, assets, data, fields).then((frame) => {
    if (frame) _frames.push(createFrame('matches', frame));
  });

  if (_frames.length) _row.append([..._frames, $(_frames[0]).clone(true)]);

  $('.row').remove();
  $('.background').remove();

  return {
    background: createBackground(),
    row: _row.get(0),
    countFrames: _row.children().length,
  };
};

const factory = async (firstRender?: boolean) => {
  await getUserData();

  const F = await frames();

  $('.animation').remove();

  if (!F?.background || !F.row) return;

  widget.append([F.background, $('<div>').addClass('animation').append(F.row)]);

  animate();

  if (firstRender) widget.removeClass('loading').append(createBorder());
};

window.addEventListener('onWidgetLoad', async (obj) => {
  const { detail } = obj as unknown as Detail;

  await getAssetsUrls();

  fields = detail.fieldData;

  factory(true);
});
