#!/bin/bash

# Script de configuração automática para VM Frontend
# Execute como: bash setup.sh

echo "🚀 Iniciando configuração do Frontend..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo yum update -y 2>/dev/null || sudo apt update && sudo apt upgrade -y

# Instalar Nginx
echo "📦 Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    if [ -f /etc/redhat-release ]; then
        # Amazon Linux / CentOS
        sudo yum install -y nginx
    else
        # Ubuntu / Debian
        sudo apt install -y nginx
    fi
fi

# Iniciar e habilitar Nginx
echo "🔄 Iniciando Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx está rodando"
else
    echo "❌ Erro ao iniciar Nginx"
    exit 1
fi

# Criar diretório do projeto
echo "📁 Criando diretório do projeto..."
mkdir -p ~/produtos-frontend/public
cd ~/produtos-frontend

# Configurar Nginx
echo "⚙️ Configurando Nginx..."
NGINX_CONFIG="/etc/nginx/conf.d/produtos.conf"

sudo tee $NGINX_CONFIG > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    root /home/ec2-user/produtos-frontend/public;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Configurações de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache para arquivos estáticos
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ajustar permissões
echo "🔐 Ajustando permissões..."
sudo chmod -R 755 ~/produtos-frontend
sudo chown -R ec2-user:ec2-user ~/produtos-frontend 2>/dev/null || sudo chown -R ubuntu:ubuntu ~/produtos-frontend

# Testar configuração do Nginx
echo "🧪 Testando configuração do Nginx..."
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ Nginx configurado e recarregado"
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi

# Configurar firewall
echo "🔥 Configurando firewall..."
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
elif command -v ufw &> /dev/null; then
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
fi

echo ""
echo "✅ Configuração do Frontend concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Copie os arquivos da pasta frontend/public/ para ~/produtos-frontend/public/"
echo "2. Edite public/index.html e configure a URL do backend (window.API_BASE_URL)"
echo "3. Recarregue o Nginx: sudo systemctl reload nginx"
echo "4. Acesse http://SEU-IP-PUBLICO-FRONTEND no navegador"
echo ""

