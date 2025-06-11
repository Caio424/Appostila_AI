import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, userId } = await request.json()

    if (!topic || !difficulty) {
      return NextResponse.json({ error: "Tópico e dificuldade são obrigatórios" }, { status: 400 })
    }

    const chatvoltApiKey = process.env.CHATVOLT_API_KEY
    const chatvoltBaseUrl = process.env.CHATVOLT_BASE_URL

    if (!chatvoltApiKey || !chatvoltBaseUrl) {
      return NextResponse.json({ error: "Configuração da IA não encontrada" }, { status: 500 })
    }

    // Prompt específico para gerar exercícios
    const exercisePrompt = `
Gere 5 exercícios de múltipla escolha sobre o tópico: "${topic}"
Dificuldade: ${difficulty}

Para cada exercício, forneça:
1. Uma pergunta clara
2. 4 alternativas (A, B, C, D)
3. A resposta correta
4. Uma explicação detalhada

Formato de resposta em JSON:
{
  "exercises": [
    {
      "question": "Pergunta aqui",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctAnswer": 0,
      "explanation": "Explicação detalhada"
    }
  ]
}
`

    const chatvoltResponse = await fetch(`${chatvoltBaseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatvoltApiKey}`,
        "X-API-Key": chatvoltApiKey,
      },
      body: JSON.stringify({
        message: exercisePrompt,
        userId: userId || "anonymous",
        sessionId: `exercises_${Date.now()}`,
        context: {
          app: "apostila_ai",
          feature: "exercise_generator",
          topic: topic,
          difficulty: difficulty,
        },
      }),
    })

    if (!chatvoltResponse.ok) {
      throw new Error(`Chatvolt API error: ${chatvoltResponse.status}`)
    }

    const chatvoltData = await chatvoltResponse.json()
    const aiResponse = chatvoltData.response || chatvoltData.message || chatvoltData.answer

    // Tentar extrair JSON da resposta
    try {
      // Se a resposta contém JSON, extrair
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const exercisesData = JSON.parse(jsonMatch[0])
        return NextResponse.json(exercisesData)
      }
    } catch (parseError) {
      console.log("Não foi possível parsear JSON, gerando exercícios padrão")
    }

    // Fallback: gerar exercícios baseados na resposta de texto
    const fallbackExercises = {
      exercises: [
        {
          question: `Sobre ${topic}, qual das alternativas está correta?`,
          options: [
            "Primeira opção relacionada ao tópico",
            "Segunda opção relacionada ao tópico",
            "Terceira opção relacionada ao tópico",
            "Quarta opção relacionada ao tópico",
          ],
          correctAnswer: 1,
          explanation: `A resposta correta é a segunda opção. ${aiResponse.substring(0, 200)}...`,
        },
      ],
    }

    return NextResponse.json(fallbackExercises)
  } catch (error) {
    console.error("Erro ao gerar exercícios:", error)
    return NextResponse.json({ error: "Erro ao gerar exercícios" }, { status: 500 })
  }
}
