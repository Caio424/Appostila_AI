-- Criação das tabelas no Supabase

-- Tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  turma VARCHAR(100),
  instituicao VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perguntas (integração com Chatvolt)
CREATE TABLE IF NOT EXISTS perguntas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  turma VARCHAR(100),
  pergunta TEXT NOT NULL,
  resposta_ia TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de exercícios gerados
CREATE TABLE IF NOT EXISTS exercicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno VARCHAR(255) NOT NULL,
  topico VARCHAR(255) NOT NULL,
  dificuldade VARCHAR(50) NOT NULL,
  questoes JSONB NOT NULL,
  pontuacao INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de apostilas
CREATE TABLE IF NOT EXISTS apostilas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  materia VARCHAR(100) NOT NULL,
  conteudo TEXT,
  aluno VARCHAR(255) NOT NULL,
  progresso INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos do calendário
CREATE TABLE IF NOT EXISTS eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'study', 'exam', 'assignment', 'reminder'
  data_evento DATE NOT NULL,
  hora_evento TIME,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_perguntas_aluno ON perguntas(aluno);
CREATE INDEX IF NOT EXISTS idx_perguntas_timestamp ON perguntas(timestamp);
CREATE INDEX IF NOT EXISTS idx_exercicios_aluno ON exercicios(aluno);
CREATE INDEX IF NOT EXISTS idx_apostilas_aluno ON apostilas(aluno);
CREATE INDEX IF NOT EXISTS idx_eventos_aluno ON eventos(aluno);
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data_evento);
