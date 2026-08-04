const STORAGE_KEY =
  "vyro_referral_tracking";

export function saveReferralCode(
  referralCode: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    referralCode,
  );
}

export function getReferralCode():
  string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(
    STORAGE_KEY,
  );
}

export function clearReferralCode():
  void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    STORAGE_KEY,
  );
}

export function captureReferralFromUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params =
    new URLSearchParams(
      window.location.search,
    );

  const referralCode =
    params.get("ref")?.trim();

  if (!referralCode) {
    return null;
  }

  saveReferralCode(
    referralCode,
  );

  return referralCode;
}
