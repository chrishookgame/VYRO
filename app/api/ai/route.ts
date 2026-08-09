import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";

import { runProvider } from "@/lib/ai/providers";
import type { AIRequest } from "@/lib/ai/types";

type AiRateLimitResult = {
  allowed: boolean;
  remaining: number;
  retry_after_seconds: number;
};

export async function POST(request: Request) {
  try {
    const supabase =
      await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          provider: "openai",
          content: "",
          error: "Debes iniciar sesión para utilizar VYRO AI.",
        },
        { status: 401 },
      );
    }

    const {
      data: rateLimitData,
      error: rateLimitError,
    } = await supabase.rpc(
      "consume_ai_rate_limit",
    );

    if (rateLimitError) {
      console.error(
        "VYRO AI rate limit error:",
        rateLimitError,
      );

      return NextResponse.json(
        {
          success: false,
          provider: "openai",
          content: "",
          error:
            "El control de uso de VYRO AI no está disponible temporalmente.",
        },
        { status: 503 },
      );
    }

    const rateLimit =
      (
        Array.isArray(rateLimitData)
          ? rateLimitData[0]
          : null
      ) as AiRateLimitResult | null;

    if (!rateLimit) {
      return NextResponse.json(
        {
          success: false,
          provider: "openai",
          content: "",
          error:
            "No fue posible validar el límite de uso de VYRO AI.",
        },
        { status: 503 },
      );
    }

    if (!rateLimit.allowed) {
      const retryAfter =
        Math.max(
          1,
          rateLimit.retry_after_seconds,
        );

      return NextResponse.json(
        {
          success: false,
          provider: "openai",
          content: "",
          error:
            "Has alcanzado temporalmente el límite de solicitudes de VYRO AI.",
        },
        {
          status: 429,
          headers: {
            "Retry-After":
              String(retryAfter),
            "X-RateLimit-Remaining":
              "0",
          },
        },
      );
    }

    const body = (await request.json()) as Partial<AIRequest>;

    if (
      !body.module ||
      !body.provider ||
      !body.systemPrompt ||
      !body.userPrompt
    ) {
      return NextResponse.json(
        {
          success: false,
          provider: body.provider ?? "openai",
          content: "",
          error: "La solicitud de IA está incompleta.",
        },
        { status: 400 },
      );
    }

    const response = await runProvider({
      module: body.module,
      provider: body.provider,
      systemPrompt: body.systemPrompt,
      userPrompt: body.userPrompt,
      temperature: body.temperature,
      maxTokens: body.maxTokens,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("VYRO AI API error:", error);

    return NextResponse.json(
      {
        success: false,
        provider: "openai",
        content: "",
        error: "No fue posible procesar la solicitud de IA.",
      },
      { status: 500 },
    );
  }
}
