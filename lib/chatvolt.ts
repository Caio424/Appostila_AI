// Configuração para integração com Chatvolt
export class ChatvoltAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.CHATVOLT_API_KEY || ""
    this.baseUrl = process.env.CHATVOLT_BASE_URL || "https://api.chatvolt.ai"
  }

  async sendMessage(message: string, userId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          message,
          userId,
          context: "apostila_ai_student",
        }),
      })

      if (!response.ok) {
        throw new Error("Erro na comunicação com Chatvolt")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Erro Chatvolt:", error)
      throw error
    }
  }

  async generateExercises(topic: string, difficulty: string, count = 5) {
    try {
      const response = await fetch(`${this.baseUrl}/generate-exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          topic,
          difficulty,
          count,
          format: "multiple_choice",
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar exercícios")
      }

      const data = await response.json()
      return data.exercises
    } catch (error) {
      console.error("Erro ao gerar exercícios:", error)
      throw error
    }
  }
}

export const chatvoltAPI = new ChatvoltAPI()
