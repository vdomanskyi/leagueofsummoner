import { Match } from '../interfaces/match.interface';
import { User } from '../interfaces/other.interface';

export const getParticipant = (user: User, match: Match) =>
  match.info.participants.find((p) => p.riotIdGameName === user.gameName && p.riotIdTagline === user.tagLine);
