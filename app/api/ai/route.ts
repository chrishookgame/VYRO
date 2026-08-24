import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";

import { runProvider } from "@/lib/ai/providers";
import type { AIRequest } from "@/lib/ai/types";

const ALLOWED_AI_PROVIDERS = [
  "openai",
  "gemini",
  "claude",
  "deepseek",
  "llama",
] as const;

const ALLOWED_AI_MODULES = [
  "academy",
  "creator",
  "live",
  "business",
  "marketplace",
] as const;

const MAX_SYSTEM_PROMPT_LENGTH = 12_000;
const MAX_USER_PROMPT_LENGTH = 32_000;
const MAX_AI_REQUEST_BYTES = 64_000;
const MIN_TEMPERATURE = 0;
const MAX_TEMPERATURE = 2;
const MIN_MAX_TOKENS = 1;
const MAX_MAX_TOKENS = 8_000;

function isAllowedProvider(
  value: unknown,
): value is AIRequest["provider"] {
  return (
    typeof value === "string" &&
    (ALLOWED_AI_PROVIDERS as readonly string[]).includes(value)
  );
}

function isAllowedModule(
  value: unknown,
): value is AIRequest["module"] {
  return (
    typeof value === "string" &&
    (ALLOWED_AI_MODULES as readonly string[]).includes(value)
  );
}

function isNonEmptyString(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}
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

    const contentLength =
      request.headers.get("content-length");

    if (contentLength) {
      const requestBytes = Number(contentLength);

      if (
        Number.isFinite(requestBytes) &&
        requestBytes > MAX_AI_REQUEST_BYTES
      ) {
        return NextResponse.json(
          {
            success: false,
            provider: "openai",
            content: "",
            error: "La solicitud de IA es demasiado grande.",
          },
          { status: 413 },
        );
      }
    }

    const body =
      (await request.json()) as Partial<AIRequest>;

    if (
      !isAllowedModule(body.module) ||
      !isAllowedProvider(body.provider) ||
      !isNonEmptyString(body.systemPrompt) ||
      !isNonEmptyString(body.userPrompt)
    ) {
      return NextResponse.json(
        {
          success: false,
          provider:
            isAllowedProvider(body.provider)
              ? body.provider
              : "openai",
          content: "",
          error: "La solicitud de IA contiene datos inválidos.",
        },
        { status: 400 },
      );
    }

    if (
      body.systemPrompt.length >
        MAX_SYSTEM_PROMPT_LENGTH ||
      body.userPrompt.length >
        MAX_USER_PROMPT_LENGTH
    ) {
      return NextResponse.json(
        {
          success: false,
          provider: body.provider,
          content: "",
          error: "El contenido enviado a VYRO AI es demasiado grande.",
        },
        { status: 413 },
      );
    }

    if (
      body.temperature !== undefined &&
      (
        typeof body.temperature !== "number" ||
        !Number.isFinite(body.temperature) ||
        body.temperature < MIN_TEMPERATURE ||
        body.temperature > MAX_TEMPERATURE
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          provider: body.provider,
          content: "",
          error: "La temperatura de IA no es válida.",
        },
        { status: 400 },
      );
    }

    if (
      body.maxTokens !== undefined &&
      (
        typeof body.maxTokens !== "number" ||
        !Number.isInteger(body.maxTokens) ||
        body.maxTokens < MIN_MAX_TOKENS ||
        body.maxTokens > MAX_MAX_TOKENS
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          provider: body.provider,
          content: "",
          error: "El límite de tokens de IA no es válido.",
        },
        { status: 400 },
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
        rateLimitError.message,
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
