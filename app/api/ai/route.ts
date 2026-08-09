import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";

import { runProvider } from "@/lib/ai/providers";
import type { AIRequest } from "@/lib/ai/types";

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
