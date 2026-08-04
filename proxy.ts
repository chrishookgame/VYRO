import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/feed",
  "/workspace",
  "/profile",
  "/admin",
];

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
        pathname === route ||
        pathname.startsWith(
          `${route}/`,
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
