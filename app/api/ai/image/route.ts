import OpenAI from "openai";
import { NextResponse } from "next/server";

import { getErrorMessage } from "@/lib/core";

import { createServerSupabaseClient } from "@/lib/supabase-server";

const MAX_PROMPT_LENGTH = 4_000;

type ImageRequestBody = {
  prompt?: unknown;
};

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
          image: "",
          error:
            "Debes iniciar sesión para utilizar VYRO Image AI.",
        },
        { status: 401 },
      );
    }

    const body =
      (await request.json()) as ImageRequestBody;

    if (
      typeof body.prompt !== "string" ||
      !body.prompt.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          image: "",
          error:
            "El prompt de imagen no es válido.",
        },
        { status: 400 },
      );
    }

    const prompt = body.prompt.trim();

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          image: "",
          error:
            "El prompt de imagen es demasiado grande.",
        },
        { status: 413 },
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
        "VYRO Image AI rate limit error:",
        rateLimitError.message,
      );

      return NextResponse.json(
        {
          success: false,
          image: "",
          error:
            "El control de uso de VYRO Image AI no está disponible temporalmente.",
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
          image: "",
          error:
            "No fue posible validar el límite de VYRO Image AI.",
        },
        { status: 503 },
      );
    }

    if (!rateLimit.allowed) {
      const retryAfter = Math.max(
        1,
        rateLimit.retry_after_seconds,
      );

      return NextResponse.json(
        {
          success: false,
          image: "",
          error:
            "Has alcanzado temporalmente el límite de VYRO Image AI.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          image: "",
          error:
            "VYRO Image AI no está disponible temporalmente.",
        },
        { status: 503 },
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    const response =
      await client.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1536x1024",
        quality: "medium",
      });

    const imageBase64 =
      response.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        {
          success: false,
          image: "",
          error:
            "VYRO Image AI no devolvió una imagen.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      image:
        `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error(
      "VYRO Image AI error:",
      getErrorMessage(error),
    );

    return NextResponse.json(
      {
        success: false,
        image: "",
        error:
          "No fue posible generar la imagen.",
      },
      { status: 500 },
    );
  }
}