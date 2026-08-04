import type {
  MemberCard,
} from "./index";

import {
  generateQrPayload,
} from "./verification";

export type MemberQr = {
  memberId: string;
  verificationUrl: string;
};

export function createMemberQr(
  card: MemberCard,
  baseUrl: string,
): MemberQr {

  return generateQrPayload(
    card.memberId,
    baseUrl,
  );

}
