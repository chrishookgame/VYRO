type WithdrawAction =
  | "approve"
  | "reject"
  | "pay";

export type AdminWithdrawRow = {
  id: string;
  user_id: string;
  user_name?: string | null;
  user_full_name?: string | null;
  amount: number | string;
  currency?: string | null;
  payment_method?: string | null;
  payment_account?: string | null;
  status: string;
  admin_notes?: string | null;
  created_at: string;
  approved_at?: string | null;
  rejected_at?: string | null;
  paid_at?: string | null;
  approved_by?: string | null;
  transaction_id?: string | null;
};

type WithdrawActionResult = {
  error: Error | null;
};

type WithdrawListResult = {
  data: AdminWithdrawRow[] | null;
  error: Error | null;
};

export async function getWithdrawRequests(): Promise<WithdrawListResult> {
  try {
    const response =
      await fetch(
        "/api/admin/withdraws/action",
        {
          method: "GET",
          cache: "no-store",
        },
      );

    const result =
      (await response.json()) as {
        success?: boolean;
        data?: AdminWithdrawRow[];
        error?: string;
      };

    if (!response.ok) {
      return {
        data: null,
        error: new Error(
          result.error ??
            "No fue posible cargar los retiros.",
        ),
      };
    }

    return {
      data: result.data ?? [],
      error: null,
    };
  } catch {
    return {
      data: null,
      error: new Error(
        "No fue posible conectar con el servidor.",
      ),
    };
  }
}

async function runWithdrawAction(
  id: string,
  action: WithdrawAction,
): Promise<WithdrawActionResult> {
  try {
    const response =
      await fetch(
        "/api/admin/withdraws/action",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            withdrawId: id,
            action,
          }),
        },
      );

    const result =
      (await response.json()) as {
        success?: boolean;
        error?: string;
      };

    if (!response.ok) {
      return {
        error: new Error(
          result.error ??
            "No fue posible procesar el retiro.",
        ),
      };
    }

    return {
      error: null,
    };
  } catch {
    return {
      error: new Error(
        "No fue posible conectar con el servidor.",
      ),
    };
  }
}

export async function approveWithdraw(
  id: string,
) {
  return runWithdrawAction(
    id,
    "approve",
  );
}

export async function rejectWithdraw(
  id: string,
) {
  return runWithdrawAction(
    id,
    "reject",
  );
}

export async function markWithdrawPaid(
  id: string,
) {
  return runWithdrawAction(
    id,
    "pay",
  );
}
