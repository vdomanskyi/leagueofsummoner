import requests from '../requests.js';
const getParticipant = (user, match) => match.info.participants.find((p) => p.riotIdGameName === user.gameName && p.riotIdTagline === user.tagLine);
const createMatch = (assets, participant) => {
    const countPings = Object.keys(participant)
        .filter((k) => k.toLowerCase().includes('pings'))
        .reduce((sum, key) => sum + Number(participant[key]), 0);
    const _match = $('<div>').addClass('match');
    const _champion = $('<div>').addClass('champion');
    const _matchStats = $('<div>').addClass('match-stats');
    const _stats = $('<p>').addClass('stats');
    const _bait = $('<img>').addClass('bait').attr('src', assets.baitPing);
    const _count = $('<p>').text(`${countPings}`);
    const _pings = $('<div>').addClass('pings');
    _stats.text(`${participant.kills}/${participant.deaths}/${participant.assists}`);
    _pings.append([_bait, _count]);
    _champion.append($('<img>').attr('src', `${assets.championIcons}/${participant.championId}.png`));
    _matchStats.append([_stats, _pings]);
    _match.append([_champion, _matchStats]);
    if (participant.win)
        _match.addClass('win');
    return _match;
};
const createLastMatch = (assets, participant) => {
    $('.last-match').remove();
    const _lastMatch = $('<div>').addClass('last-match');
    const _title = $('<p>').addClass('title');
    const _last = $('<span>').addClass('last').text('Last');
    const _match = $('<span>').addClass('match').text('match:');
    _title.append([_last, _match]);
    _lastMatch.append(_title, createMatch(assets, participant));
    return _lastMatch;
};
export default async (_LoS_, assets, { user, matchIds }, fields) => {
    if (!user)
        return;
    const matches = [];
    const _list = [];
    const _previousMatches = [];
    let _lastMatch = null;
    await Promise.all(matchIds.map((id) => requests.match.getMatchById(fields, id).then((res) => {
        matches.push(res.data);
    })));
    matches.sort((a, b) => b.info.gameCreation - a.info.gameCreation);
    matches.forEach((match, index) => {
        const participant = getParticipant(user, match);
        if (!participant)
            return;
        index
            ? _previousMatches.push(createMatch(assets, participant))
            : (_lastMatch = createLastMatch(assets, participant));
    });
    if (_lastMatch)
        _list.push(_lastMatch);
    _list.push(..._previousMatches);
    return _list;
};
