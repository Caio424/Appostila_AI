import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, userId, type, systemPrompt, context } = await request.json()

    const chatvoltApiKey = process.env.CHATVOLT_API_KEY
    const chatvoltBaseUrl = process.env.CHATVOLT_BASE_URL

    if (!chatvoltApiKey || !chatvoltBaseUrl) {
      return NextResponse.json({ error: "Configuração do Chatvolt não encontrada" }, { status: 500 })
    }

    // Log para debug
    console.log("Enviando para Chatvolt:", {
      url: `${chatvoltBaseUrl}/api/chat`,
      userId,
      type,
      messageLength: message.length,
    })

    // Preparar payload para o Chatvolt
    const payload = {
      message: systemPrompt ? `${systemPrompt}\n\nUsuário: ${message}` : message,
      userId: userId,
      sessionId: `apostila_ai_${type}_${userId}_${Date.now()}`,
      metadata: {
        app: "apostila_ai",
        feature: type,
        timestamp: new Date().toISOString(),
        ...context,
      },
    }

    // Fazer requisição para o Chatvolt
    const chatvoltResponse = await fetch(`${chatvoltBaseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatvoltApiKey}`,
        "X-API-Key": chatvoltApiKey,
        // Adicionar headers adicionais se necessário
        "User-Agent": "Apostila_AI/1.0",
      },
      body: JSON.stringify(payload),
    })

    // Log da resposta para debug
    console.log("Resposta do Chatvolt:", {
      status: chatvoltResponse.status,
      statusText: chatvoltResponse.statusText,
    })

    if (!chatvoltResponse.ok) {
      const errorText = await chatvoltResponse.text()
      console.error("Erro detalhado do Chatvolt:", errorText)

      return NextResponse.json(
        {
          error: "Erro na comunicação com o Chatvolt",
          details: `Status: ${chatvoltResponse.status}`,
          chatvoltError: errorText,
        },
        { status: 500 },
      )
    }

    const chatvoltData = await chatvoltResponse.json()

    // Log da resposta para debug
    console.log("Dados recebidos do Chatvolt:", {
      hasResponse: !!chatvoltData.response,
      hasMessage: !!chatvoltData.message,
      keys: Object.keys(chatvoltData),
    })

    // Extrair a resposta do Chatvolt (formato pode variar)
    const aiResponse =
      chatvoltData.response ||
      chatvoltData.message ||
      chatvoltData.answer ||
      chatvoltData.text ||
      "Resposta não encontrada"

    return NextResponse.json({
      response: aiResponse,
      success: true,
      timestamp: new Date().toISOString(),
      metadata: {
        type,
        userId,
        chatvoltData: chatvoltData, // Para debug, remover em produção
      },
    })
  } catch (error) {
    console.error("Erro interno na API do Chatvolt:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
