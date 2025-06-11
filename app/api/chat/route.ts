import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Mensagem e userId são obrigatórios" }, { status: 400 })
    }

    // Configuração do Chatvolt
    const chatvoltApiKey = process.env.CHATVOLT_API_KEY
    const chatvoltBaseUrl = process.env.CHATVOLT_BASE_URL

    if (!chatvoltApiKey || !chatvoltBaseUrl) {
      console.error("Variáveis de ambiente do Chatvolt não configuradas")
      return NextResponse.json({ error: "Configuração da IA não encontrada" }, { status: 500 })
    }

    // Fazer requisição para o Chatvolt
    const chatvoltResponse = await fetch(`${chatvoltBaseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatvoltApiKey}`,
        // Alguns endpoints do Chatvolt podem usar diferentes headers
        "X-API-Key": chatvoltApiKey,
      },
      body: JSON.stringify({
        message: message,
        userId: userId,
        sessionId: `apostila_ai_${userId}`,
        context: {
          app: "apostila_ai",
          userType: "student",
          timestamp: new Date().toISOString(),
        },
      }),
    })

    if (!chatvoltResponse.ok) {
      const errorText = await chatvoltResponse.text()
      console.error("Erro do Chatvolt:", chatvoltResponse.status, errorText)

      return NextResponse.json(
        {
          error: "Erro na comunicação com a IA",
          details: `Status: ${chatvoltResponse.status}`,
        },
        { status: 500 },
      )
    }

    const chatvoltData = await chatvoltResponse.json()

    // O formato da resposta pode variar dependendo da configuração do seu Chatvolt
    // Ajuste conforme necessário baseado na estrutura da sua API
    const aiResponse = chatvoltData.response || chatvoltData.message || chatvoltData.answer

    return NextResponse.json({
      response: aiResponse,
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro interno da API:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
