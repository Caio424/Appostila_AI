"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, PenTool, Sparkles, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import Link from "next/link"

interface Exercise {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function ExercisesPage() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medio")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateExercises = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          difficulty: difficulty,
          userId: "joao@email.com", // Pegar do contexto do usuário
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar exercícios")
      }

      const data = await response.json()

      if (data.exercises && data.exercises.length > 0) {
        const formattedExercises: Exercise[] = data.exercises.map((ex: any, index: number) => ({
          id: (index + 1).toString(),
          question: ex.question,
          options: ex.options,
          correctAnswer: ex.correctAnswer,
          explanation: ex.explanation,
        }))

        setExercises(formattedExercises)
        setCurrentExercise(0)
        setScore(0)
      } else {
        throw new Error("Nenhum exercício foi gerado")
      }
    } catch (error) {
      console.error("Erro ao gerar exercícios:", error)
      // Fallback para exercícios de exemplo
      const mockExercises: Exercise[] = [
        {
          id: "1",
          question: `Sobre ${topic}, qual das alternativas está correta?`,
          options: [
            "Primeira opção relacionada ao tópico",
            "Segunda opção relacionada ao tópico",
            "Terceira opção relacionada ao tópico",
            "Quarta opção relacionada ao tópico",
          ],
          correctAnswer: 1,
          explanation: `A resposta correta é a segunda opção porque está relacionada diretamente com ${topic}.`,
        },
      ]
      setExercises(mockExercises)
      setCurrentExercise(0)
      setScore(0)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return

    const isCorrect = Number.parseInt(selectedAnswer) === exercises[currentExercise].correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }

    setShowResult(true)
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSelectedAnswer("")
      setShowResult(false)
    }
  }

  const resetExercises = () => {
    setExercises([])
    setCurrentExercise(0)
    setScore(0)
    setSelectedAnswer("")
    setShowResult(false)
    setTopic("")
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
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">Gerador de Exercícios</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {exercises.length === 0 ? (
          // Generator Form
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">Gere Exercícios Personalizados</h2>
              <p className="text-slate-300 text-sm">
                Digite o conteúdo e nossa IA criará exercícios para você praticar
              </p>
            </div>

            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Configurar Exercícios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm">Tópico ou Conteúdo</Label>
                  <Textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Equações do segundo grau, Revolução Francesa, Fotossíntese..."
                    className="mt-1 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-green-500"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-slate-300 text-sm">Dificuldade</Label>
                  <RadioGroup value={difficulty} onValueChange={setDifficulty} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="facil" id="facil" className="border-slate-500" />
                      <Label htmlFor="facil" className="text-slate-300">
                        Fácil
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medio" id="medio" className="border-slate-500" />
                      <Label htmlFor="medio" className="text-slate-300">
                        Médio
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dificil" id="dificil" className="border-slate-500" />
                      <Label htmlFor="dificil" className="text-slate-300">
                        Difícil
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={generateExercises}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      Gerando Exercícios...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4 mr-2" />
                      Gerar Exercícios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Exercise Display
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {currentExercise + 1} de {exercises.length}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">
                Score: {score}/{exercises.length}
              </Badge>
            </div>

            {/* Exercise Card */}
            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">{exercises[currentExercise].question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showResult}>
                  {exercises[currentExercise].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                        showResult
                          ? index === exercises[currentExercise].correctAnswer
                            ? "border-green-500 bg-green-500/10"
                            : selectedAnswer === index.toString() && index !== exercises[currentExercise].correctAnswer
                              ? "border-red-500 bg-red-500/10"
                              : "border-slate-600"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} className="border-slate-500" />
                      <Label htmlFor={`option-${index}`} className="text-slate-300 flex-1 cursor-pointer">
                        {option}
                      </Label>
                      {showResult && index === exercises[currentExercise].correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {showResult &&
                        selectedAnswer === index.toString() &&
                        index !== exercises[currentExercise].correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                  ))}
                </RadioGroup>

                {showResult && (
                  <Card className="bg-slate-700/30 border-slate-600/50">
                    <CardContent className="p-3">
                      <p className="text-slate-300 text-sm">
                        <strong>Explicação:</strong> {exercises[currentExercise].explanation}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-2">
                  {!showResult ? (
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={!selectedAnswer}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    >
                      Confirmar Resposta
                    </Button>
                  ) : (
                    <>
                      {currentExercise < exercises.length - 1 ? (
                        <Button
                          onClick={nextExercise}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          Próximo Exercício
                        </Button>
                      ) : (
                        <Button
                          onClick={resetExercises}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Novo Conjunto
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
