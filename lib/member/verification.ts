export function getMemberVerificationUrl(
  memberId: string,
  baseUrl: string,
) {
  return `${baseUrl}/verify/${memberId}`;
}

export function generateQrPayload(
  memberId: string,
  baseUrl: string,
) {
  return {
    memberId,
    verificationUrl:
      getMemberVerificationUrl(
        memberId,
        baseUrl,
      ),
  };
}
