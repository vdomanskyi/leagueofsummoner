import type { Assets, Character, Data, Summoner, User } from '../interfaces/other.interface';

const createAvatar = (assets: Assets, summoner: Summoner, character: Character, hasDivisions: boolean) => {
  const _avatar = $('<div>').addClass('avatar');

  const _icon = $('<img>').addClass('icon').attr('src', `${assets.profileIcon}/${summoner.profileIconId}.jpg`);
  const _ranked = $('<img>').addClass('ranked').attr('src', `${assets.rankedFolder}/${assets.ranked[character.tier]}`);

  if (hasDivisions) _avatar.append($('<div>').addClass('division').append($('<p>').text(character.rank)));

  _avatar.append([_ranked, _icon]);

  return _avatar;
};

const createCharacter = (character: Character, user: User) => {
  const _character = $('<div>').addClass('character');

  const _lp = $('<p>').addClass('lp').text(`${character.leaguePoints}LP`);
  const _username = $('<div>')
    .addClass('username')
    .append($('<p>').text(`${user.gameName}#${user.tagLine}`));

  _character.append([_lp, _username]);

  return _character;
};

const createCharacterStats = (character: Character) => {
  const _characterStats = $('<div>').addClass('character-stats');

  const _wins = $('<p>').addClass('wins').text(`${character.wins}W`);
  const _losses = $('<p>').addClass('losses').text(`${character.losses}L`);
  const _total = $('<p>')
    .addClass('total')
    .text(`${character.wins + character.losses}`);

  if (character.wins > 0) {
    const value = ((character.wins / (character.wins + character.losses)) * 100).toFixed(0);
    const _percent = $('<span>').text(`(${value}%)`);

    _total.append(_percent);
  }

  _characterStats.append([_wins, _total, _losses]);

  return _characterStats;
};

export default async (
  assets: Assets,
  { summoner, user, character }: Data,
  hasDivisions: boolean
): Promise<JQuery<HTMLElement>[] | undefined> => {
  if (!user || !character || !summoner) return;

  return [
    createAvatar(assets, summoner, character, hasDivisions),
    createCharacter(character, user),
    createCharacterStats(character),
  ];
};
