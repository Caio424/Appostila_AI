"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Brain, User, Sparkles, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Sou sua assistente de estudos com IA. Como posso ajudar você hoje? 🤖✨",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      // Salvar pergunta no Supabase
      await supabase.from("perguntas").insert({
        aluno: "João Silva",
        email: "joao@email.com",
        turma: "Ensino Médio",
        pergunta: currentInput,
        timestamp: new Date().toISOString(),
      })

      // Usar o novo proxy do Chatvolt
      const response = await fetch("/api/chatvolt-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          userId: "joao@email.com",
          type: "chat",
          context: {
            userLevel: "Ensino Médio",
            previousMessages: messages.slice(-3), // Últimas 3 mensagens para contexto
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro na comunicação com a IA")
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Desculpe, não consegui processar sua pergunta no momento.",
        sender: "ai",
        timestamp: new Date(),
      }

      // Atualizar resposta no Supabase
      await supabase
        .from("perguntas")
        .update({ resposta_ia: data.response })
        .eq("pergunta", currentInput)
        .eq("aluno", "João Silva")

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Desculpe, ocorreu um erro: ${error instanceof Error ? error.message : "Erro desconhecido"}. Tente novamente.`,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Assistente IA</h1>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollAreaRef}>
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-white" />
                </div>
              )}

              <Card
                className={`max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-none"
                    : "bg-slate-800/50 border-slate-700/50"
                }`}
              >
                <CardContent className="p-3">
                  <p className={`text-sm ${message.sender === "user" ? "text-white" : "text-slate-200"}`}>
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-slate-400"}`}>
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {message.sender === "ai" && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-green-400">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-400">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {message.sender === "user" && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                    <p className="text-sm text-slate-300">Pensando...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua dúvida aqui..."
              className="flex-1 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-cyan-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Powered by Apostila_AI • Suas conversas são salvas com segurança
          </p>
        </div>
      </div>
    </div>
  )
}
