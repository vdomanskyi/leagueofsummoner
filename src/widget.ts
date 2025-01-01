// 20 requests every 1 seconds(s)
// 100 requests every 2 minutes(s)

import general from './frames/general';
import border from './static/border.json';

import { type Assets, type Data, type Fields, type Detail, RANKED, type $NodeList } from './interfaces/other.interface';

const _LoS_ = '[League of Summoner]';

const proxy = window.axios.create({ baseURL: 'https://jb7wcew52glscncuehjfvlvwfe0xzhgm.lambda-url.eu-north-1.on.aws' });
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

  await requests.general.getUser(fields.gameName, fields.tagLine).then((res) => {
    if (!res.data.status) data.user = res.data;
  });

  if (data.user === null) return console.error(_LoS_, 'No user found');

  await requests.general.getSummonerByPUUID(data.user.puuid).then((res) => {
    data.summoner = res.data;
  });

  if (data.summoner === null) return console.error(_LoS_, 'No summoner found');

  await requests.general.getCharacterList(data.summoner.id).then((res) => {
    data.character = res.data.find((c) => c.queueType === 'RANKED_SOLO_5x5') || null;
  });

  if (data.character === null) return console.error(_LoS_, 'No character found');

  await requests.match.getMatchList(data.user.puuid).then((res) => {
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

  const banner = $('<img>')
    .addClass('banner')
    .attr('src', `${assets.bannerFolder}/${assets.banner[data.character.tier]}`);

  return $('<div>').addClass('background').append(banner).get(0);
};

const createBorder = () => {
  const borderTopBottom = $('<img>').addClass('border').attr('src', border.topBottom);
  const borderLeftRight = $('<img>').addClass('border').addClass('left-right').attr('src', border.leftRight);

  return [borderTopBottom, borderLeftRight];
};

/**
 * RENDERING LOGIC
 */

const createFrame = (className: string, node: $NodeList) => {
  const frame = $('<div>').addClass('frame').addClass(className);
  const content = $('<div>').addClass('content').append(node);

  return frame.append(content).get(0);
};

const frames = async () => {
  // const _general = renderFrame('general', [createAvatar(), createCharacter(), createCharacterStats()]);
  // const _matches = renderFrame('matches', await renderMatches());
  // const _sessionWinLosses = renderFrame('session', [createSessionStats()]);
  if (!assets || !data.character) return;

  const General = general(_LoS_, assets, data, hasDivisions[data.character.tier]);

  const frames = [General];
  const row = $('<div>')
    .addClass('row')
    .append([...frames, $(frames[0]).clone(true)]);

  $('.row').remove();
  $('.background').remove();

  return {
    background: createBackground(),
    row: row.get(0),
    countFrames: row.children().length,
  };
};

const factory = async (firstRender?: boolean) => {
  await getUserData();

  const F = await frames();

  // $('.animation').remove();
  // $('.background').remove();

  // widget.append([F.background, $('<div>').addClass('animation').append(F.row)])

  // animate();

  if (firstRender) widget.removeClass('loading').append(createBorder());
};

window.addEventListener('onWidgetLoad', async (obj) => {
  const { detail } = obj as unknown as Detail;

  await getAssetsUrls();

  fields = detail.fieldData;

  factory(true);
});
