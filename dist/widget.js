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
  const border = {
    topBottom: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAACdfAAAnXwEdhrpqAAAD20lEQVR4nO3aP24cVQDA4bdZJxKiABcgCkCiI8fgHJQ5BRI9p6DkNnQcIFIIFYWriJDYXoo0zkv0m4xnE63J9zXW2vNmnsfzmz/e3R0Oh3Fbv/7y4+0H30GfzN84m15fLqxgXv6Gq6vrsd/fWzehtdublv9n3dbuvEc//bZbOyb+ZMt+/+PJluF3zoP5G/vp9dXCCublb9iNMVafbdZub1r+xdrt3XGPbjFmUyDjetPocX9pgTig3sWDw9IRtGBh79yfJzgvP29+On/tF4/weXXT9ubz4cL+enn2+vbe2P9LV6QFL3Yb/2ALu+PltrXfysprOnxcdlueQc6/OP+onkG42y7+vlj9DOIKAmHTM8jzjfescOo2BfL59w+PNQ84SW6xIGy6gjz76+mx5gEnaVMg+8PGN0LgxLnFgiAQCAKBsO2zWGP8fJRZfHx249W+/2yM8eUY43y8w0fT+PA2fdQE/u/cYkEQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQBAIBIFAEAgEgUAQCASBQDjbMvj8m68Px5oIvG8Xfz7drR3jCgJBIBAEAmHTM8gYV8eZBZyoTYF8+u13x5oHnCS3WBA2XUGePXl8rHnASdr2DHJ5pFnAiXKLBWHTFeSHh1+NcRhjTO9P3hu78SDWvPR25vOVV6ar1e+PTuOn19fv+fMBh2n912M/LeG/g6diUyC7sXvr0X4YY/x7+err68u/tafXxo34OXxomwJ5GT/bcpCf3Rz8Diuaz79L5vPzPH4/bfN6XsFU/mFhjvMVaTct/+b81/5GvC//AVXtVtakTdSHAAAAAElFTkSuQmCC',
    leftRight: 'data:image/png;base64,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'
  }

  const borderTopBottom = $('<img>').addClass('border').attr('src', border.topBottom);
  const borderLeftRight = $('<img>').addClass('border').addClass('left-right').attr('src', border.leftRight);

  if (flip) borderTopBottom.addClass('flip'), borderLeftRight.addClass('flip');

  return [borderTopBottom.get(0), borderLeftRight.get(0)];
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
