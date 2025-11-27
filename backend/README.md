# 🚀 Backend - API REST CRUD de Produtos

API REST desenvolvida em Node.js/Express para gerenciamento de produtos utilizando Supabase.

## 📋 Estrutura

```
backend/
├── server.js           # Servidor Express com rotas da API
├── package.json        # Dependências do projeto
├── .env.example       # Exemplo de configuração
├── supabase-setup.sql # Script SQL para criar tabela
├── setup.sh           # Script de configuração automática
└── README.md          # Este arquivo
```

## 🔧 Instalação Local

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações do Supabase
```

3. **Criar tabela no Supabase:**
   - Acesse o SQL Editor no Supabase
   - Execute o conteúdo de `supabase-setup.sql`

4. **Iniciar servidor:**
```bash
npm start
# ou para desenvolvimento
npm run dev
```

## 🌐 Endpoints da API

- `GET /health` - Health check
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

## 🚀 Deploy na AWS

Consulte o arquivo `../AWS-CONFIGURACAO.md` na raiz do projeto para instruções completas.

### Passos Rápidos:

1. **Conectar à VM Backend:**
```bash
ssh -i sua-chave.pem ec2-user@IP-BACKEND
```

2. **Executar script de setup:**
```bash
bash setup.sh
```

3. **Copiar arquivos do backend para a VM:**
```bash
# Do seu computador local
scp -i sua-chave.pem -r backend/* ec2-user@IP-BACKEND:~/produtos-backend/
```

4. **Configurar .env na VM:**
```bash
cd ~/produtos-backend
cp .env.example .env
nano .env  # Edite com suas configurações
```

5. **Iniciar com PM2:**
```bash
npm install
pm2 start server.js --name produtos-api
pm2 startup && pm2 save
```

## 📝 Variáveis de Ambiente

- `PORT` - Porta do servidor (padrão: 3000)
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_KEY` - Chave Publishable do Supabase
- `FRONTEND_URL` - URL do frontend (para CORS)

## 🔒 Segurança

- CORS configurado para aceitar requisições do frontend
- Row Level Security (RLS) habilitado no Supabase
- Validação de dados nas rotas da API

## 📊 Monitoramento

```bash
# Ver logs
pm2 logs produtos-api

# Ver status
pm2 status

# Monitorar em tempo real
pm2 monit
```


