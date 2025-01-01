// /**
//  * FRAME: MATCHES
//  */
// const renderMatches = async () => {
//   let lastMatch = null;
//   let previousMatches = [];

//   await Promise.all(data.matchIds.map((matchId, index) => {
//     return requests.match.getMatchById(matchId).then((res) => {
//       !index ? lastMatch = res.data : previousMatches.push(res.data);
//     })
//   }));

//   previousMatches.sort((a, b) => b.info.gameCreation - a.info.gameCreation);

//   const _lastMatch = createLastMatch(lastMatch);
//   const _previousMatches = $('<div>').addClass('matches').append(previousMatches.map((m) => createMatch(m)));

//   return [_lastMatch, _previousMatches];
// };

// const createLastMatch = (match) => {
//   $('.last-match').remove();

//   const _lastMatch = $('<div>').addClass('last-match');

//   const _title = $('<p>').addClass('title');
//   const _last = $('<span>').addClass('last').text('Last');
//   const _match = $('<span>').addClass('match').text('match:');

//   _title.append([_last.get(0), _match.get(0)]);

//   _lastMatch.append(_title.get(0), createMatch(match));

//   return _lastMatch.get(0);
// };

// const createMatch = (match) => {
//   if (!match) return;

//   const participant = match.info.participants.find(
//     (p) => p.riotIdGameName === data.user.gameName && p.riotIdTagline === data.user.tagLine
//   );

//   const countPings =
//     participant.commandPings +
//     participant.dangerPings +
//     participant.enemyMissingPings +
//     participant.enemyVisionPings +
//     participant.getBackPings +
//     participant.holdPings +
//     participant.needVisionPings +
//     participant.onMyWayPings +
//     participant.pushPings +
//     participant.retreatPings +
//     participant.visionClearedPings +
//     participant.allInPings +
//     participant.basicPings +
//     participant.assistMePings;

//   const _match = $('<div>').addClass('match');

//   const _champion = $('<div>')
//     .addClass('champion')
//     .append($('<img>').attr('src', `${assets.championIcons}/${participant.championId}.png`));

//   const _matchStats = $('<div>').addClass('match-stats');

//   const _stats = $('<p>').addClass('stats').text(`${participant.kills}/${participant.deaths}/${participant.assists}`);

//   const _pings = $('<div>').addClass('pings'),
//     _bait = $('<img>').addClass('bait').attr('src', assets.baitPing),
//     _countPings = $('<p>').text(`${countPings}`);

//   _pings.append([_bait.get(0), _countPings.get(0)]);
//   _matchStats.append([_stats.get(0), _pings.get(0)]);

//   _match.append([_champion.get(0), _matchStats.get(0)]);

//   if (participant.win) _match.addClass('win');

//   addDataParticipantToStore(participant)

//   return _match.get(0);
// };

// const addDataParticipantToStore = (participant) => {
//   participant.win ? session.win.add() : session.losses.add();

//   session.kda.push(participant.challenges.kda);
// }
