import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "your-supabase-url"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Aluno {
  id: string
  nome: string
  email: string
  turma: string
  instituicao?: string
  created_at: string
}

export interface Pergunta {
  id: string
  aluno: string
  email: string
  turma: string
  pergunta: string
  resposta_ia?: string
  timestamp: string
}

export interface Exercicio {
  id: string
  aluno: string
  topico: string
  dificuldade: string
  questoes: any[]
  pontuacao: number
  timestamp: string
}

export interface Apostila {
  id: string
  titulo: string
  materia: string
  conteudo: string
  aluno: string
  progresso: number
  created_at: string
}
