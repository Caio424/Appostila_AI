"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  MessageCircle,
  PenTool,
  Play,
  Calendar,
  Settings,
  Brain,
  Zap,
  Target,
  User,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userName] = useState("João Silva") // Simulado - virá do Supabase

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const quickActions = [
    {
      title: "Tira-Dúvidas IA",
      description: "Pergunte qualquer coisa",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-gradient-to-br from-cyan-500 to-blue-600",
      badge: "Popular",
    },
    {
      title: "Gerar Exercícios",
      description: "Pratique com IA",
      icon: PenTool,
      href: "/exercises",
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      title: "Minhas Apostilas",
      description: "Conteúdo dinâmico",
      icon: BookOpen,
      href: "/apostilas",
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
    },
    {
      title: "Videoaulas",
      description: "Curadoria inteligente",
      icon: Play,
      href: "/videos",
      color: "bg-gradient-to-br from-orange-500 to-red-600",
    },
  ]

  const stats = [
    { label: "Dúvidas Resolvidas", value: "47", icon: Brain },
    { label: "Exercícios Feitos", value: "23", icon: Target },
    { label: "Horas de Estudo", value: "12h", icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Apostila_AI</h1>
              <p className="text-sm text-slate-300">
                {currentTime.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Olá, {userName}! 👋</h2>
          <p className="text-slate-300">Pronto para acelerar seus estudos hoje?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-3 text-center">
                <stat.icon className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Acesso Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-4 relative">
                    {action.badge && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-xs">
                        {action.badge}
                      </Badge>
                    )}
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">{action.title}</h4>
                    <p className="text-xs text-slate-400">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Exercícios de Matemática</p>
                    <p className="text-xs text-slate-400">Há 2 horas • 8/10 acertos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Dúvida sobre Física</p>
                    <p className="text-xs text-slate-400">Ontem • Resolvida pela IA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700/50">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            <Button variant="ghost" size="sm" className="flex-col gap-1 text-cyan-400">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Início</span>
            </Button>
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="flex-col gap-1 text-slate-400 hover:text-cyan-400">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">Chat IA</span>
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="ghost" size="sm" className="flex-col gap-1 text-slate-400 hover:text-cyan-400">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Agenda</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="flex-col gap-1 text-slate-400 hover:text-cyan-400">
                <Settings className="h-5 w-5" />
                <span className="text-xs">Config</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
