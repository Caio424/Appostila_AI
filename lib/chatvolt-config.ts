// Configurações específicas para diferentes tipos de requisição ao Chatvolt
export const ChatvoltConfig = {
  // Configuração para chat geral
  chat: {
    endpoint: "/api/chat",
    systemPrompt: `Você é um assistente educacional especializado em ajudar estudantes brasileiros. 
    Responda de forma clara, didática e motivadora. 
    Use exemplos práticos quando possível.
    Mantenha um tom encorajador e profissional.`,
  },

  // Configuração para geração de exercícios
  exercises: {
    endpoint: "/api/chat",
    systemPrompt: `Você é um gerador de exercícios educacionais. 
    Crie exercícios de múltipla escolha precisos e educativos.
    Sempre forneça explicações detalhadas para as respostas.
    Use o formato JSON solicitado.`,
  },

  // Configuração para análise de apostilas
  apostilas: {
    endpoint: "/api/chat",
    systemPrompt: `Você é um analisador de conteúdo educacional.
    Ajude os estudantes a compreender melhor o material de estudo.
    Forneça resumos, explicações e insights relevantes.`,
  },
}

// Função helper para fazer requisições ao Chatvolt
export async function callChatvolt(
  message: string,
  userId: string,
  type: keyof typeof ChatvoltConfig = "chat",
  additionalContext?: Record<string, any>,
) {
  const config = ChatvoltConfig[type]

  const response = await fetch("/api/chatvolt-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      userId,
      type,
      systemPrompt: config.systemPrompt,
      context: additionalContext,
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na comunicação: ${response.status}`)
  }

  return response.json()
}
