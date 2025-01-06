"use strict";

// src/assets.ts
var assets = {
  profileIcon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons",
  rankedFolder: "https://raw.communitydragon.org/latest/game/assets/loadouts/regalia/crests/ranked",
  bannerFolder: "https://raw.communitydragon.org/latest/game/assets/loadouts/regalia/banners",
  championIcons: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons",
  baitPing: "https://raw.communitydragon.org/13.17/game/assets/ux/minimap/pings/bait.png",
  banner: {
    IRON: "01_iron_banner.png",
    BRONZE: "02_bronze_banner.png",
    SILVER: "03_silver_banner.png",
    GOLD: "04_gold_banner.png",
    PLATINUM: "05_platinum_banner.png",
    EMERALD: "emerald_banner.png",
    DIAMOND: "06_diamond_banner.png",
    MASTER: "07_master_banner.png",
    GRANDMASTER: "08_grandmaster_banner.png",
    CHALLENGER: "09_challenger_banner.png"
  },
  ranked: {
    IRON: "01_iron/01_iron_base.png",
    BRONZE: "02_bronze/02_bronze_base.png",
    SILVER: "03_silver/03_silver_base.png",
    GOLD: "04_gold/04_gold_base.png",
    PLATINUM: "05_platinum/05_platinum_base_new.png",
    EMERALD: "emerald/emerald_base.png",
    DIAMOND: "06_diamond/06_diamond_base.png",
    MASTER: "07_master/07_master_base.png",
    GRANDMASTER: "08_grandmaster/08_grandmaster_base.png",
    CHALLENGER: "09_challenger/09_challenger_base.png"
  }
};
var assets_default = assets;

// src/requests.ts
var proxy = axios.create({
  baseURL: "https://kef3rty3rivaxm5m772uucj7de0qhias.lambda-url.eu-north-1.on.aws/",
  headers: {
    "Content-Type": "text/plain"
  }
});
var requests_default = {
  general: {
    getUser: async function(fields2) {
      const rawPath = `https://${fields2.platformRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${fields2.gameName}/${fields2.tagLine}?api_key=${fields2.API_KEY}`;
      return proxy.post("", rawPath.toString());
    },
    getCharacterList: async function(fields2, summonerId) {
      const rawPath = `https://${fields2.regionalRouting}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${fields2.API_KEY}`;
      return proxy.post("", rawPath.toString());
    },
    getSummonerByPUUID: async function(fields2, puuid) {
      const rawPath = `https://${fields2.regionalRouting}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${fields2.API_KEY}`;
      return proxy.post("", rawPath.toString());
    }
  },
  match: {
    getMatchList: async function(fields2, puuid, count = 7) {
      const rawPath = `https://${fields2.platformRouting}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=${fields2.matchesType}&start=0&count=${count}&api_key=${fields2.API_KEY}`;
      return proxy.post("", rawPath.toString());
    },
    getMatchById: async function(fields2, matchId) {
      const rawPath = `https://${fields2.platformRouting}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${fields2.API_KEY}`;
      return proxy.post("", rawPath.toString());
    }
  }
  // champion: {
  //   getChampionTop: async function (fields: Fields, puuid: string, count = 3) {
  //     const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}&api_key=${fields.API_KEY}`;
  //     return proxy.post('', { rawPath });
  //   },
  // },
};

// src/frames/general.ts
var createAvatar = (assets2, summoner, character, hasDivisions2) => {
  const _avatar = $("<div>").addClass("avatar");
  const _icon = $("<img>").addClass("icon").attr("src", `${assets2.profileIcon}/${summoner.profileIconId}.jpg`);
  const _ranked = $("<img>").addClass("ranked").attr("src", `${assets2.rankedFolder}/${assets2.ranked[character.tier]}`);
  if (hasDivisions2) _avatar.append($("<div>").addClass("division").append($("<p>").text(character.rank)));
  _avatar.append([_ranked, _icon]);
  return _avatar;
};
var createCharacter = (character, user) => {
  const _character = $("<div>").addClass("character");
  const _lp = $("<p>").addClass("lp").text(`${character.leaguePoints}LP`);
  const _username = $("<div>").addClass("username").append($("<p>").text(`${user.gameName}#${user.tagLine}`));
  _character.append([_lp, _username]);
  return _character;
};
var createCharacterStats = (character) => {
  const _characterStats = $("<div>").addClass("character-stats");
  const _wins = $("<p>").addClass("wins").text(`${character.wins}W`);
  const _losses = $("<p>").addClass("losses").text(`${character.losses}L`);
  const _total = $("<p>").addClass("total").text(`${character.wins + character.losses}`);
  if (character.wins > 0) {
    const value = (character.wins / (character.wins + character.losses) * 100).toFixed(0);
    const _percent = $("<span>").text(`(${value}%)`);
    _total.append(_percent);
  }
  _characterStats.append([_wins, _total, _losses]);
  return _characterStats;
};
var general_default = async (assets2, { summoner, user, character }, hasDivisions2) => {
  if (!user || !character || !summoner) return;
  return [
    createAvatar(assets2, summoner, character, hasDivisions2),
    createCharacter(character, user),
    createCharacterStats(character)
  ];
};

// src/frames/matches.ts
var getParticipant = (user, match) => match.info.participants.find((p) => p.riotIdGameName === user.gameName && p.riotIdTagline === user.tagLine);
var createMatch = (assets2, participant) => {
  const countPings = Object.keys(participant).filter((k) => k.toLowerCase().includes("pings")).reduce((sum, key) => sum + Number(participant[key]), 0);
  const _match = $("<div>").addClass("match");
  const _champion = $("<div>").addClass("champion");
  const _matchStats = $("<div>").addClass("match-stats");
  const _stats = $("<p>").addClass("stats");
  const _bait = $("<img>").addClass("bait").attr("src", assets2.baitPing);
  const _count = $("<p>").text(`${countPings}`);
  const _pings = $("<div>").addClass("pings");
  _stats.text(`${participant.kills}/${participant.deaths}/${participant.assists}`);
  _pings.append([_bait, _count]);
  _champion.append($("<img>").attr("src", `${assets2.championIcons}/${participant.championId}.png`));
  _matchStats.append([_stats, _pings]);
  _match.append([_champion, _matchStats]);
  if (participant.win) _match.addClass("win");
  return _match;
};
var createLastMatch = (assets2, participant) => {
  $(".last-match").remove();
  const _lastMatch = $("<div>").addClass("last-match");
  const _title = $("<p>").addClass("title");
  const _last = $("<span>").addClass("last").text("Last");
  const _match = $("<span>").addClass("match").text("match:");
  _title.append([_last, _match]);
  _lastMatch.append(_title, createMatch(assets2, participant));
  return _lastMatch;
};
var matches_default = async (assets2, { user, matchIds }, fields2) => {
  if (!user) return;
  const matches = [];
  const _list = [];
  const _previousMatches = [];
  let _lastMatch = null;
  await Promise.all(
    matchIds.map(
      (id) => requests_default.match.getMatchById(fields2, id).then((res) => {
        matches.push(res.data);
      })
    )
  );
  matches.sort((a, b) => b.info.gameCreation - a.info.gameCreation);
  matches.forEach((match, index) => {
    const participant = getParticipant(user, match);
    if (!participant) return;
    index ? _previousMatches.push(createMatch(assets2, participant)) : _lastMatch = createLastMatch(assets2, participant);
  });
  if (_lastMatch) _list.push(_lastMatch);
  _list.push($("<div>").addClass("matches").append(_previousMatches));
  return _list;
};

// src/widget.ts
var __LoS__ = "[League of Summoner]";
var border = {
  topBottom: "data:image/png;base64,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",
  leftRight: "data:image/png;base64,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"
};
var widget = $(".widget").addClass("loading");
var hasDivisions = {
  ["IRON" /* IRON */]: true,
  ["BRONZE" /* BRONZE */]: true,
  ["SILVER" /* SILVER */]: true,
  ["GOLD" /* GOLD */]: true,
  ["PLATINUM" /* PLATINUM */]: true,
  ["EMERALD" /* EMERALD */]: true,
  ["DIAMOND" /* DIAMOND */]: true,
  ["MASTER" /* MASTER */]: false,
  ["GRANDMASTER" /* GRANDMASTER */]: false,
  ["CHALLENGER" /* CHALLENGER */]: false
};
var fields = null;
var data = {
  user: null,
  character: null,
  summoner: null,
  matchIds: [],
  matches: []
};
var getUserData = async (a) => {
  if (!fields) return console.error(__LoS__, "No fields found");
  await requests_default.general.getUser(fields).then((res) => {
    if (res.data.puuid) data.user = res.data;
  });
  if (data.user === null) return console.error(__LoS__, "No user found");
  await requests_default.general.getSummonerByPUUID(fields, data.user.puuid).then((res) => {
    data.summoner = res.data;
  });
  if (data.summoner === null) return console.error(__LoS__, "No summoner found");
  await requests_default.general.getCharacterList(fields, data.summoner.id).then((res) => {
    data.character = res.data.find((c) => c.queueType === "RANKED_SOLO_5x5") || null;
  });
  if (data.character === null) return console.error(__LoS__, "No character found");
  await requests_default.match.getMatchList(fields, data.user.puuid).then((res) => {
    data.matchIds = res.data;
  });
};
var createBackground = () => {
  if (!assets_default || !data.character) return;
  const _banner = $("<img>").addClass("banner").attr("src", `${assets_default.bannerFolder}/${assets_default.banner[data.character.tier]}`);
  return $("<div>").addClass("background").append(_banner).get(0);
};
var createBorder = () => {
  const _borderTopBottom = $("<img>").addClass("border").attr("src", border.topBottom);
  const _borderLeftRight = $("<img>").addClass("border").addClass("left-right").attr("src", border.leftRight);
  return [_borderTopBottom, _borderLeftRight];
};
var animate = () => {
  if (!fields) return;
  const row = $(".row");
  const width = row.width();
  const countFrames = row.children().length;
  const frameWidth = width / countFrames;
  const timeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
    defaults: { ease: Power1.easeInOut, duration: fields.transitionDuration }
  });
  for (let i = 0; i < countFrames; i++) {
    const gap = frameWidth * i * -1;
    const time = i === 1 ? "<" : `>+${fields.pauseDuration}`;
    timeline.to(".animation", { x: gap }, time);
  }
};
var createFrame = (className, node) => {
  const _frame = $("<div>").addClass("frame").addClass(className);
  const _content = $("<div>").addClass("content").append(node);
  return _frame.append(_content);
};
var frames = async () => {
  if (!assets_default || !data.character || !fields) return;
  const _row = $("<div>").addClass("row");
  const _frames = [];
  await general_default(assets_default, data, hasDivisions[data.character.tier]).then((frame) => {
    if (frame) _frames.push(createFrame("general", frame));
  });
  await matches_default(assets_default, data, fields).then((frame) => {
    if (frame) _frames.push(createFrame("matches", frame));
  });
  if (_frames.length) _row.append([..._frames, $(_frames[0]).clone(true)]);
  $(".row").remove();
  $(".background").remove();
  return {
    background: createBackground(),
    row: _row.get(0),
    countFrames: _row.children().length
  };
};
var factory = async (firstRender) => {
  await getUserData(firstRender);
  const F = await frames();
  $(".animation").remove();
  if (!F?.background || !F.row) return;
  widget.append([F.background, $("<div>").addClass("animation").append(F.row)]);
  animate();
  if (firstRender) widget.removeClass("loading").append(createBorder());
};
addEventListener("onWidgetLoad", async (obj) => {
  const { detail } = obj;
  fields = detail.fieldData;
  await factory(true);
});
