const proxy = window.axios.create({ baseURL: 'https://jb7wcew52glscncuehjfvlvwfe0xzhgm.lambda-url.eu-north-1.on.aws' });
export default {
    general: {
        getUser: async function (fields) {
            const rawPath = `https://${fields.platformRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${fields.gameName}/${fields.tagLine}?api_key=${fields.API_KEY}`;
            return proxy.post('', { rawPath });
        },
        getCharacterList: async function (fields, summonerId) {
            const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${fields.API_KEY}`;
            return proxy.post('', { rawPath });
        },
        getSummonerByPUUID: async function (fields, puuid) {
            const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${fields.API_KEY}`;
            return proxy.post('', { rawPath });
        },
    },
    match: {
        getMatchList: async function (fields, puuid, count = 7) {
            const rawPath = `https://${fields.platformRouting}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=${fields.matchesType}&start=0&count=${count}&api_key=${fields.API_KEY}`;
            return proxy.post('', { rawPath });
        },
        getMatchById: async function (fields, matchId) {
            const rawPath = `https://${fields.platformRouting}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${fields.API_KEY}`;
            return proxy.post('', { rawPath });
        },
    },
    // champion: {
    //   getChampionTop: async function (fields: Fields, puuid: string, count = 3) {
    //     const rawPath = `https://${fields.regionalRouting}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}&api_key=${fields.API_KEY}`;
    //     return proxy.post('', { rawPath });
    //   },
    // },
};
