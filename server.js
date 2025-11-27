const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// Middleware CORS - Configurado para aceitar requisições do frontend
app.use(cors({
  origin: FRONTEND_URL === '*' ? true : FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Removido express.static pois o frontend estará em outra VM

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: SUPABASE_URL e SUPABASE_KEY devem estar configurados no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Rotas da API

// GET - Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Consultar produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // Usa maybeSingle() que retorna null se não encontrar, em vez de lançar erro

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ success: false, error: 'Produto não encontrado' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Cadastrar novo produto
app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade } = req.body;

    if (!nome || !descricao || !preco || !quantidade) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos os campos são obrigatórios (nome, descricao, preco, quantidade)' 
      });
    }

    const { data, error } = await supabase
      .from('produtos')
      .insert([
        {
          nome,
          descricao,
          preco: parseFloat(preco),
          quantidade: parseInt(quantidade)
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Atualizar produto
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;

    if (!nome || !descricao || !preco || !quantidade) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos os campos são obrigatórios (nome, descricao, preco, quantidade)' 
      });
    }

    const { data, error } = await supabase
      .from('produtos')
      .update({
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade)
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Produto não encontrado' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Deletar produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Produto não encontrado' });
    }

    res.json({ success: true, message: 'Produto deletado com sucesso', data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API está funcionando' });
});

// Iniciar servidor - Escutando em 0.0.0.0 para aceitar conexões externas
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor API rodando na porta ${PORT}`);
  console.log(`📍 Escutando em 0.0.0.0:${PORT}`);
  console.log(`🌐 Frontend URL configurada: ${FRONTEND_URL}`);
  console.log(`✅ API pronta para receber requisições`);
});


