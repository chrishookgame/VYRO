import type {
  MemberCard,
} from "./index";

export type MemberImageExport = {
  fileName: string;
  mimeType: "image/png";
  width: number;
  height: number;
  card: MemberCard;
};

export function createMemberImageExport(
  card: MemberCard,
): MemberImageExport {

  return {
    fileName:
      `${card.memberId}.png`,
    mimeType:
      "image/png",
    width: 1080,
    height: 1920,
    card,
  };

}
