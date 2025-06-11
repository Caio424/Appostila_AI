"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Search, FileText, Download, Star, Clock, Eye, MessageCircle } from "lucide-react"
import Link from "next/link"

interface Apostila {
  id: string
  title: string
  subject: string
  pages: number
  lastRead: string
  progress: number
  rating: number
  downloads: number
  description: string
}

export default function ApostilasPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const apostilas: Apostila[] = [
    {
      id: "1",
      title: "Matemática Básica - Álgebra",
      subject: "Matemática",
      pages: 45,
      lastRead: "2 dias atrás",
      progress: 75,
      rating: 4.8,
      downloads: 1250,
      description: "Fundamentos de álgebra com exercícios práticos",
    },
    {
      id: "2",
      title: "História do Brasil - República",
      subject: "História",
      pages: 62,
      lastRead: "1 semana atrás",
      progress: 30,
      rating: 4.6,
      downloads: 890,
      description: "Período republicano brasileiro detalhado",
    },
    {
      id: "3",
      title: "Física - Mecânica Clássica",
      subject: "Física",
      pages: 78,
      lastRead: "Nunca",
      progress: 0,
      rating: 4.9,
      downloads: 2100,
      description: "Leis de Newton e aplicações práticas",
    },
  ]

  const filteredApostilas = apostilas.filter(
    (apostila) =>
      apostila.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apostila.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      Matemática: "bg-gradient-to-r from-blue-500 to-cyan-500",
      História: "bg-gradient-to-r from-orange-500 to-red-500",
      Física: "bg-gradient-to-r from-purple-500 to-violet-500",
      Química: "bg-gradient-to-r from-green-500 to-emerald-500",
      Biologia: "bg-gradient-to-r from-teal-500 to-green-500",
    }
    return colors[subject] || "bg-gradient-to-r from-gray-500 to-slate-500"
  }

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
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">Minhas Apostilas</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar apostilas..."
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <BookOpen className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{apostilas.length}</div>
              <div className="text-xs text-slate-400">Apostilas</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <Eye className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">2</div>
              <div className="text-xs text-slate-400">Lendo</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <Star className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">4.8</div>
              <div className="text-xs text-slate-400">Média</div>
            </CardContent>
          </Card>
        </div>

        {/* Apostilas List */}
        <div className="space-y-4">
          {filteredApostilas.map((apostila) => (
            <Link key={apostila.id} href={`/apostilas/${apostila.id}`}>
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-base mb-1">{apostila.title}</CardTitle>
                      <p className="text-slate-400 text-sm">{apostila.description}</p>
                    </div>
                    <Badge className={`${getSubjectColor(apostila.subject)} text-white text-xs`}>
                      {apostila.subject}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Progress Bar */}
                  {apostila.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progresso</span>
                        <span>{apostila.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${apostila.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{apostila.pages} páginas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{apostila.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{apostila.downloads}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{apostila.lastRead}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredApostilas.length === 0 && (
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhuma apostila encontrada</h3>
              <p className="text-slate-400 text-sm">Tente buscar por outro termo ou adicione novas apostilas</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700">
            <Download className="h-4 w-4 mr-2" />
            Importar PDF
          </Button>
          <Link href="/chat">
            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
              <MessageCircle className="h-4 w-4 mr-2" />
              Tirar Dúvida
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
