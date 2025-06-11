"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Settings,
  User,
  Bell,
  Moon,
  Shield,
  Database,
  HelpCircle,
  LogOut,
  Trash2,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [studyReminders, setStudyReminders] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState(true)

  const settingSections = [
    {
      title: "Perfil",
      icon: User,
      items: [
        { label: "Nome", value: "João Silva", type: "input" },
        { label: "Email", value: "joao@email.com", type: "input" },
        { label: "Turma", value: "Ensino Médio", type: "input" },
        { label: "Instituição", value: "Colégio ABC", type: "input" },
      ],
    },
    {
      title: "Notificações",
      icon: Bell,
      items: [
        {
          label: "Notificações Push",
          value: notifications,
          type: "switch",
          onChange: setNotifications,
        },
        {
          label: "Lembretes de Estudo",
          value: studyReminders,
          type: "switch",
          onChange: setStudyReminders,
        },
        {
          label: "Sugestões da IA",
          value: aiSuggestions,
          type: "switch",
          onChange: setAiSuggestions,
        },
      ],
    },
    {
      title: "Aparência",
      icon: Moon,
      items: [
        {
          label: "Modo Escuro",
          value: darkMode,
          type: "switch",
          onChange: setDarkMode,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">Configurações</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Summary */}
        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">João Silva</h3>
                <p className="text-slate-400 text-sm">joao@email.com</p>
                <p className="text-slate-500 text-xs">Ensino Médio • Colégio ABC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <section.icon className="h-5 w-5 text-cyan-400" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between">
                  <Label className="text-slate-300 text-sm">{item.label}</Label>
                  {item.type === "switch" ? (
                    <Switch
                      checked={item.value as boolean}
                      onCheckedChange={item.onChange}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-600"
                    />
                  ) : (
                    <Input
                      value={item.value as string}
                      className="w-40 bg-slate-700/50 border-slate-600/50 text-white text-sm"
                      readOnly
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Data & Privacy */}
        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              Dados & Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Database className="h-4 w-4 mr-2" />
              Gerenciar Dados do Supabase
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
            <Button variant="outline" className="w-full justify-start border-red-600 text-red-400 hover:bg-red-900/20">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Cache Local
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-cyan-400" />
              Suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Feedback ou Sugestão</Label>
              <Textarea
                placeholder="Conte-nos como podemos melhorar o Apostila_AI..."
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500"
                rows={3}
              />
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                Enviar Feedback
              </Button>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <p className="text-slate-400 text-xs text-center">Apostila_AI v1.0.0 • Powered by Chatvolt & Supabase</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="outline" className="w-full border-red-600 text-red-400 hover:bg-red-900/20">
          <LogOut className="h-4 w-4 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </div>
  )
}
