"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, CalendarIcon, Clock, Bell, Plus, BookOpen, PenTool } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  type: "study" | "exam" | "assignment" | "reminder"
  date: Date
  time: string
  description: string
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const events: Event[] = [
    {
      id: "1",
      title: "Prova de Matemática",
      type: "exam",
      date: new Date(2024, 11, 15),
      time: "14:00",
      description: "Álgebra e Geometria",
    },
    {
      id: "2",
      title: "Estudar Física",
      type: "study",
      date: new Date(),
      time: "16:00",
      description: "Mecânica Clássica - Cap. 3",
    },
    {
      id: "3",
      title: "Entrega de Trabalho",
      type: "assignment",
      date: new Date(2024, 11, 20),
      time: "23:59",
      description: "História do Brasil",
    },
  ]

  const todayEvents = events.filter((event) => event.date.toDateString() === new Date().toDateString())

  const upcomingEvents = events
    .filter((event) => event.date > new Date() && event.date.toDateString() !== new Date().toDateString())
    .slice(0, 3)

  const getEventColor = (type: string) => {
    const colors = {
      study: "bg-blue-500",
      exam: "bg-red-500",
      assignment: "bg-orange-500",
      reminder: "bg-purple-500",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500"
  }

  const getEventIcon = (type: string) => {
    const icons = {
      study: BookOpen,
      exam: PenTool,
      assignment: Clock,
      reminder: Bell,
    }
    return icons[type as keyof typeof icons] || Clock
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
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">Calendário Acadêmico</h1>
            </div>
            <Button size="icon" className="ml-auto bg-gradient-to-r from-cyan-500 to-blue-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Today's Summary */}
        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-orange-400" />
              Hoje -{" "}
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map((event) => {
                  const IconComponent = getEventIcon(event.type)
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <div
                        className={`w-8 h-8 ${getEventColor(event.type)} rounded-full flex items-center justify-center`}
                      >
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{event.title}</h4>
                        <p className="text-slate-400 text-xs">
                          {event.time} • {event.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <CalendarIcon className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Nenhum evento hoje</p>
                <p className="text-slate-500 text-xs">Que tal agendar um tempo de estudo?</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center text-white",
                caption_label: "text-sm font-medium text-white",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal text-white hover:bg-slate-700 rounded-md",
                day_selected:
                  "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-700",
                day_today: "bg-slate-700 text-white",
                day_outside: "text-slate-600 opacity-50",
                day_disabled: "text-slate-600 opacity-50",
                day_range_middle: "aria-selected:bg-slate-700 aria-selected:text-white",
                day_hidden: "invisible",
              }}
            />
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const IconComponent = getEventIcon(event.type)
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <div
                        className={`w-8 h-8 ${getEventColor(event.type)} rounded-full flex items-center justify-center`}
                      >
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{event.title}</h4>
                        <p className="text-slate-400 text-xs">
                          {event.date.toLocaleDateString("pt-BR")} • {event.time}
                        </p>
                        <p className="text-slate-500 text-xs">{event.description}</p>
                      </div>
                      <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                        {Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Nenhum evento próximo</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-cyan-400" />
              Sugestões da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-slate-300 text-sm">
                💡 Baseado no seu histórico, sugiro estudar <strong>Física</strong> hoje às 16h
              </p>
              <p className="text-slate-300 text-sm">
                📚 Você tem uma prova de Matemática em 3 dias. Que tal revisar álgebra?
              </p>
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              Agendar Sessão de Estudo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
