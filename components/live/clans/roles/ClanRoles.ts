import type {
  VyroClanRole,
} from "../types";

export const ClanRolePower:Record<
  VyroClanRole,
  number
> = {
  OWNER: 4,
  CAPTAIN: 3,
  ELITE: 2,
  MEMBER: 1,
};
