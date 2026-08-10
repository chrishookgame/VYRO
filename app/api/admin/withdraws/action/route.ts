import { NextResponse } from "next/server";

import {
  createServerSupabaseClient,
} from "@/lib/supabase-server";

import {
  hasPermission,
  rolePermissions,
  type Permission,
  type UserRole,
} from "@/lib/roles";

type WithdrawAction =
  | "approve"
  | "reject"
  | "pay";

type RequestBody = {
  withdrawId?: unknown;
  action?: unknown;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUserRole(
  value: unknown,
): value is UserRole {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(
      rolePermissions,
      value,
    )
  );
}

function isWithdrawAction(
  value: unknown,
): value is WithdrawAction {
  return (
    value === "approve" ||
    value === "reject" ||
    value === "pay"
  );
}

function requiredPermission(
  action: WithdrawAction,
): Permission {
  return action === "pay"
    ? "withdraw.pay"
    : "withdraw.approve";
}

async function getAuthenticatedRole() {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      supabase,
      user: null,
      role: null,
    };
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    !isUserRole(profile.role)
  ) {
    return {
      supabase,
      user,
      role: null,
    };
  }

  return {
    supabase,
    user,
    role: profile.role,
  };
}

export async function GET() {
  try {
    const {
      supabase,
      user,
      role,
    } = await getAuthenticatedRole();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Debes iniciar sesión.",
        },
        { status: 401 },
      );
    }

    if (
      !role ||
      !hasPermission(
        role,
        "withdraw.read",
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Acceso administrativo denegado.",
        },
        { status: 403 },
      );
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      "admin_list_withdraw_requests",
    );

    if (error) {
      console.error(
        "VYRO withdraw list RPC error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "No fue posible cargar los retiros.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "VYRO withdraw GET error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible cargar los retiros.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const {
      supabase,
      user,
      role,
    } = await getAuthenticatedRole();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Debes iniciar sesión.",
        },
        { status: 401 },
      );
    }

    const body =
      (await request.json()) as RequestBody;

    if (
      typeof body.withdrawId !== "string" ||
      !UUID_PATTERN.test(body.withdrawId) ||
      !isWithdrawAction(body.action)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Solicitud de retiro inválida.",
        },
        { status: 400 },
      );
    }

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          error: "Acceso administrativo denegado.",
        },
        { status: 403 },
      );
    }

    const permission =
      requiredPermission(body.action);

    if (
      !hasPermission(
        role,
        permission,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No tienes permiso para realizar esta acción.",
        },
        { status: 403 },
      );
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      "admin_process_withdraw",
      {
        p_withdraw_id:
          body.withdrawId,
        p_action:
          body.action,
      },
    );

    if (error) {
      console.error(
        "VYRO secure withdraw RPC error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "No fue posible procesar la solicitud de retiro.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "VYRO withdraw action API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible procesar la operación administrativa.",
      },
      { status: 500 },
    );
  }
}
