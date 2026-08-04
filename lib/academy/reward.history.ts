export type AcademyRewardHistoryItem = {
  id: string;
  reason: string;
  points: number;
  earnedAt: string;
};

const STORAGE_KEY =
  "vyro_academy_reward_history";

export function getAcademyRewardHistory():
  AcademyRewardHistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved =
    window.localStorage.getItem(
      STORAGE_KEY,
    );

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(
      saved,
    ) as AcademyRewardHistoryItem[];
  } catch {
    return [];
  }
}

export function saveAcademyRewardHistoryItem(
  item: AcademyRewardHistoryItem,
): AcademyRewardHistoryItem[] {
  const current =
    getAcademyRewardHistory();

  const updated = [
    item,
    ...current,
  ];

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated),
  );

  return updated;
}

export function createAcademyRewardHistoryItem(
  reason: string,
  points: number,
): AcademyRewardHistoryItem {
  return {
    id: crypto.randomUUID(),
    reason,
    points,
    earnedAt:
      new Date().toISOString(),
  };
}

export function clearAcademyRewardHistory():
  AcademyRewardHistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  window.localStorage.removeItem(
    STORAGE_KEY,
  );

  return [];
}
