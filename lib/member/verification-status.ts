import type {
  MemberCard,
} from "./index";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "suspended"
  | "revoked";

export function updateVerificationStatus(
  card: MemberCard,
  status: VerificationStatus,
): MemberCard {

  return {
    ...card,
    verified:
      status === "verified",
  };

}

export function getVerificationLabel(
  status: VerificationStatus,
) {

  switch (status) {

    case "verified":
      return "✔ Verificado";

    case "pending":
      return "🟡 Pendiente";

    case "suspended":
      return "⛔ Suspendido";

    case "revoked":
      return "❌ Revocado";

  }

}
