const lambda = axios.create({
  baseURL: 'https://gfb4yi67pbkrvi4wbrol7ktlym0uvsqp.lambda-url.eu-north-1.on.aws',
  headers: { 'Content-Type': 'text/plain' },
});

let assets = {};

let user = null;
let summoner = null;
let character = null;

let matchIds = [];
let matches = [];

let data = null;
let apiKey = null;

const requests = {
  getUser: async (gameName, tagLine) => {
    const data =
      'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' +
      gameName +
      '/' +
      tagLine +
      '?api_key=' +
      apiKey;

    return lambda.post('/', data);
  },
  getCharacterList: async (summonerId) => {
    const data =
      'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerId + '?api_key=' + apiKey;

    return lambda.post('/', data);
  },
  getSummonerByPUUID: async (puuid) => {
    const data = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' + puuid + '?api_key=' + apiKey;

    return lambda.post('/', data);
  },

  match: {
    getMatchList: (puuid, count = 7) => {
      const data =
        'https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/' +
        puuid +
        '/ids?start=0&count=' +
        count +
        '&api_key=' +
        apiKey;
      return lambda.post('/', data);
    },
    getMatchById: (matchId) => {
      const data = 'https://europe.api.riotgames.com/lol/match/v5/matches/' + matchId + '?api_key=' + apiKey;

      return lambda.post('/', data).then((res) => {
        matches.push(res.data);

        matches.sort((a, b) => b.info.gameCreation - a.info.gameCreation);
      });
    },
  },
};

const getUserData = async () => {
  await requests.getUser(data.gameName, data.tagLine).then((res) => {
    user = res.data;
  });

  if (!user) return alert('No user');

  await requests.getSummonerByPUUID(user.puuid).then((res) => {
    summoner = res.data;
  });

  if (!summoner) return alert('No summoner');

  await requests.getCharacterList(summoner.id).then((res) => {
    character = res.data.find((c) => c.queueType === 'RANKED_SOLO_5x5') || null;
  });

  await requests.match.getMatchList(user.puuid).then((res) => {
    matchIds = res.data;
  });
};

const getAssetsUrls = async () => {
  const url = 'https://raw.githubusercontent.com/vdomanskyi/widget/refs/heads/main/dist/assets.json';

  await $.getJSON(url, (json) => {
    assets = json;
  });
};

/** GENERAL BLOCKS */

const createBorder = (flip) => {
  const border =
    'data:image/png;base64,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';

  const img = $('<img>').addClass('border').attr('src', border);

  if (flip) img.addClass('flip');

  return img.get(0);
};

const renderFrame = (className, node) => {
  const frame = $('<div>').addClass('frame').addClass(className);
  const content = $('<div>').addClass('content').append(node);

  return frame.append(content.get(0)).get(0);
};

/** GENREAL FRAME */

const createBackground = () => {
  const _background = $('<div>').addClass('background');
  const _banner = $('<img>').addClass('banner').attr('src', `${assets.bannerFolder}/${assets.banner[character.tier]}`);

  return _background.append(_banner.get(0)).get(0);
};

const createAvatar = () => {
  const _avatar = $('<div>').addClass('avatar');

  if (assets.hasDivisions[character.tier]) {
    const _division = $('<div>').addClass('division').append($('<p>').text(character.rank));

    _avatar.append(_division.get(0));
  }

  const _icon = $('<img>').addClass('icon').attr('src', `${assets.profileIcon}/${summoner.profileIconId}.jpg`);
  const _border = $('<img>').addClass('border').attr('src', `${assets.rankedFolder}/${assets.ranked[character.tier]}`);

  _avatar.append([_icon.get(0), _border.get(0)]);

  return _avatar.get(0);
};

const createCharacter = () => {
  const _character = $('<div>').addClass('character');

  const _lp = $('<p>').addClass('lp').text(`${character.leaguePoints}LP`);
  const _username = $('<div>')
    .addClass('username')
    .append($('<p>').text(`${user.gameName}#${user.tagLine}`));

  _character.append([_lp.get(0), _username.get(0)]);

  return _character.get(0);
};

const createCharacterStats = () => {
  const _characterStats = $('<div>').addClass('character-stats');
  const _wins = $('<p>').addClass('wins').text(`${character.wins}W`);
  const _losses = $('<p>').addClass('losses').text(`${character.losses}L`);
  const _total = $('<p>')
    .addClass('total')
    .text(`${character.wins + character.losses}`);

  if (character.wins > 0) {
    const value = ((character.wins / (character.wins + character.losses)) * 100).toFixed(0);
    const _percent = $('<span>').text(`(${value}%)`);

    _total.append(_percent.get(0));
  }

  _characterStats.append([_wins.get(0), _total.get(0), _losses.get(0)]);

  return _characterStats.get(0);
};

/** MATCHES */
const renderMatches = async () => {
  let previousMatches = [];
  let lastMatch = null;

  matches = [];

  await Promise.all(matchIds.map((id) => requests.match.getMatchById(id))).then(() => {
    const lastMatchId = matchIds[0];

    lastMatch = matches.find((m) => m.metadata.matchId === lastMatchId);
    previousMatches = matches.filter((m) => m.metadata.matchId !== lastMatchId);
  });

  const _lastMatch = createLastMatch(lastMatch);
  const _previousMatches = previousMatches.map((m) => createMatch(m));
  const _matches = $('<div>').addClass('matches').append(_previousMatches);

  return [_lastMatch, _matches];
};

const createLastMatch = (match) => {
  $('.last-match').remove();

  const _lastMatch = $('<div>').addClass('last-match');

  const _title = $('<p>').addClass('title');
  const _last = $('<span>').addClass('last').text('Last');
  const _match = $('<span>').addClass('match').text('match:');

  _title.append([_last.get(0), _match.get(0)]);

  _lastMatch.append(_title.get(0), createMatch(match));

  return _lastMatch.get(0);
};

const createMatch = (match) => {
  const participant = match.info.participants.find(
    (p) => p.riotIdGameName === user.gameName && p.riotIdTagline === user.tagLine
  );

  const countPings =
    participant.commandPings +
    participant.dangerPings +
    participant.enemyMissingPings +
    participant.enemyVisionPings +
    participant.getBackPings +
    participant.holdPings +
    participant.needVisionPings +
    participant.onMyWayPings +
    participant.pushPings +
    participant.retreatPings +
    participant.visionClearedPings +
    participant.allInPings +
    participant.basicPings +
    participant.assistMePings;

  const _match = $('<div>').addClass('match');

  const _champion = $('<div>')
    .addClass('champion')
    .append($('<img>').attr('src', `${assets.championIcons}/${participant.championId}.png`));

  const _matchStats = $('<div>').addClass('match-stats');

  const _stats = $('<p>').addClass('stats').text(`${participant.kills}/${participant.deaths}/${participant.assists}`);

  const _pings = $('<div>').addClass('pings'),
    _bait = $('<img>').addClass('bait').attr('src', assets.baitPing),
    _countPings = $('<p>').text(`${countPings}`);

  _pings.append([_bait.get(0), _countPings.get(0)]);
  _matchStats.append([_stats.get(0), _pings.get(0)]);

  _match.append([_champion.get(0), _matchStats.get(0)]);

  if (participant.win) _match.addClass('win');

  return _match.get(0);
};

const render = async () => {
  await getUserData();

  const _background = createBackground();
  const _general = renderFrame('general', [createAvatar(), createCharacter(), createCharacterStats()]);
  const _matches = renderFrame('matches', await renderMatches());

  const _row = $('<div>').addClass('row').append([_general, _matches]);

  $('.row').remove();
  $('.background').remove();

  return {
    _background,
    _row: _row.get(0),
  };
};

window.addEventListener('onWidgetLoad', async (obj) => {
  const { flipBorder, gameName, tagLine, pauseDuration, API_KEY } = obj.detail.fieldData;
  const _widget = $('.widget').append(createBorder(flipBorder === 'true'));

  const _animation = $('<div>').addClass('animation');

  data = { gameName, tagLine };
  apiKey = API_KEY;

  await getAssetsUrls();

  const r = await render();

  _widget.append([r._background, _animation.append(r._row)]);

  gsap.to('.animation', {
    x: -200,
    duration: 3,
    repeat: -1,
    yoyo: true,
    repeatDelay: pauseDuration,
    ease: 'power1.inOut',
  });

  setInterval(async () => {
    const r = await render();

    _widget.append([r._background, _animation.append(r._row)]);
  }, 15000);
});
