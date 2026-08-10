import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  canAccessAdmin,
  canAccessPage,
} from "@/lib/admin/permissions";

import {
  rolePermissions,
  type Permission,
  type UserRole,
} from "@/lib/roles";

const protectedRoutes = [
  "/dashboard",
  "/feed",
  "/workspace",
  "/profile",
  "/admin",
];

type AdminRouteRule = {
  prefix: string;
  permission: Permission;
};

const adminRouteRules: readonly AdminRouteRule[] = [
  { prefix: "/admin/users", permission: "users.read" },
  { prefix: "/admin/member", permission: "users.read" },
  { prefix: "/admin/wallet", permission: "wallet.read" },
  { prefix: "/admin/withdraws", permission: "withdraw.read" },
  { prefix: "/admin/support", permission: "tickets.read" },
  { prefix: "/admin/settings", permission: "settings.update" },
  { prefix: "/admin/audit", permission: "reports.read" },
  { prefix: "/admin/academy", permission: "academy.read" },
  { prefix: "/admin/live", permission: "live.read" },
  { prefix: "/admin/marketplace", permission: "marketplace.read" },
  { prefix: "/admin/ai", permission: "ai.read" },
];

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

function matchesRoute(
  pathname: string,
  prefix: string,
): boolean {
  return (
    pathname === prefix ||
    pathname.startsWith(`${prefix}/`)
  );
}

export async function proxy(
  request: NextRequest,
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );
              },
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );
          },
        },
      },
    );

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

  const requiresAuth =
    protectedRoutes.some(
      (route) =>
        matchesRoute(
          pathname,
          route,
        ),
    );

  if (
    requiresAuth &&
    !user
  ) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      "/login";

    loginUrl.searchParams.set(
      "next",
      pathname,
    );

    return NextResponse.redirect(
      loginUrl,
    );
  }

  if (
    matchesRoute(
      pathname,
      "/admin",
    ) &&
    user
  ) {
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
      !isUserRole(profile.role) ||
      !canAccessAdmin(profile.role)
    ) {
      const dashboardUrl =
        request.nextUrl.clone();

      dashboardUrl.pathname =
        "/dashboard";

      dashboardUrl.search = "";

      return NextResponse.redirect(
        dashboardUrl,
      );
    }

    const routeRule =
      adminRouteRules.find(
        (rule) =>
          matchesRoute(
            pathname,
            rule.prefix,
          ),
      );

    if (
      routeRule &&
      !canAccessPage(
        profile.role,
        routeRule.permission,
      )
    ) {
      const adminUrl =
        request.nextUrl.clone();

      adminUrl.pathname =
        "/admin";

      adminUrl.search = "";

      return NextResponse.redirect(
        adminUrl,
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/feed/:path*",
    "/workspace/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
