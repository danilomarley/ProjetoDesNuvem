#!/bin/bash

# Script de configuração automática para VM Backend
# Execute como: bash setup.sh

echo "🚀 Iniciando configuração do Backend..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo yum update -y 2>/dev/null || sudo apt update && sudo apt upgrade -y

# Instalar Node.js
echo "📦 Instalando Node.js..."
if ! command -v node &> /dev/null; then
    if [ -f /etc/redhat-release ]; then
        # Amazon Linux / CentOS
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    else
        # Ubuntu / Debian
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
fi

echo "✅ Node.js instalado: $(node --version)"
echo "✅ NPM instalado: $(npm --version)"

# Instalar PM2
echo "📦 Instalando PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

echo "✅ PM2 instalado: $(pm2 --version)"

# Criar diretório do projeto
echo "📁 Criando diretório do projeto..."
mkdir -p ~/produtos-backend
cd ~/produtos-backend

# Instalar dependências (se package.json existir)
if [ -f "package.json" ]; then
    echo "📦 Instalando dependências do projeto..."
    npm install
fi

# Configurar firewall
echo "🔥 Configurando firewall..."
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-port=3000/tcp
    sudo firewall-cmd --reload
elif command -v ufw &> /dev/null; then
    sudo ufw allow 3000/tcp
    sudo ufw --force enable
fi

echo ""
echo "✅ Configuração do Backend concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Copie os arquivos da pasta backend/ para ~/produtos-backend/"
echo "2. Crie o arquivo .env com as configurações do Supabase (copie de .env.example)"
echo "3. Execute: npm install"
echo "4. Execute: pm2 start server.js --name produtos-api"
echo "5. Execute: pm2 startup && pm2 save"
echo ""

