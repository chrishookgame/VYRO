import { supabase } from "@/lib/supabase";

export type ReferralRegistrationResult = {
  success: boolean;
  error?: string;
};

export async function findReferrerByCode(
  referralCode: string,
) {
  return await supabase
    .from("profiles")
    .select("id, referral_code")
    .eq(
      "referral_code",
      referralCode,
    )
    .maybeSingle();
}

export async function registerReferral(
  referrerUserId: string,
  referredUserId: string,
  referralCode: string,
) {
  return await supabase
    .from("referrals")
    .insert({
      referrer_user_id:
        referrerUserId,
      referred_user_id:
        referredUserId,
      referral_code:
        referralCode,
      status: "registered",
    });
}

export async function registerReferralByCode(
  referredUserId: string,
  referralCode: string,
): Promise<ReferralRegistrationResult> {
  const cleanReferralCode =
    referralCode
      .trim()
      .toUpperCase();

  if (!cleanReferralCode) {
    return {
      success: false,
      error:
        "El código de referido está vacío.",
    };
  }

  const {
    data: referrer,
    error: referrerError,
  } = await findReferrerByCode(
    cleanReferralCode,
  );

  if (referrerError) {
    return {
      success: false,
      error:
        referrerError.message,
    };
  }

  if (!referrer) {
    return {
      success: false,
      error:
        "El código de referido no existe.",
    };
  }

  if (
    referrer.id ===
    referredUserId
  ) {
    return {
      success: false,
      error:
        "Un usuario no puede referirse a sí mismo.",
    };
  }

  const {
    data: existingReferral,
    error: existingReferralError,
  } = await supabase
    .from("referrals")
    .select("id")
    .eq(
      "referred_user_id",
      referredUserId,
    )
    .maybeSingle();

  if (existingReferralError) {
    return {
      success: false,
      error:
        existingReferralError.message,
    };
  }

  if (existingReferral) {
    return {
      success: false,
      error:
        "Este usuario ya tiene un referido asociado.",
    };
  }

  const {
    error: registrationError,
  } = await registerReferral(
    referrer.id,
    referredUserId,
    cleanReferralCode,
  );

  if (registrationError) {
    return {
      success: false,
      error:
        registrationError.message,
    };
  }

  return {
    success: true,
  };
}

export async function getUserReferrals(
  userId: string,
) {
  return await supabase
    .from("referrals")
    .select("*")
    .eq(
      "referrer_user_id",
      userId,
    )
    .order(
      "created_at",
      {
        ascending: false,
      },
    );
}

export async function getReferralCount(
  userId: string,
) {
  return await supabase
    .from("referrals")
    .select(
      "*",
      {
        count: "exact",
        head: true,
      },
    )
    .eq(
      "referrer_user_id",
      userId,
    );
}
