-- Script SQL para criar a tabela de produtos no Supabase

-- Criar tabela produtos
CREATE TABLE IF NOT EXISTS produtos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  quantidade INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (opcional, mas recomendado)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações
-- ATENÇÃO: Esta política permite acesso público. Para produção, ajuste conforme necessário.
CREATE POLICY "Permitir todas as operações" ON produtos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE
    ON produtos FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


