# 🎨 Frontend - Interface Web CRUD de Produtos

Interface web desenvolvida em HTML, CSS e JavaScript para gerenciamento de produtos.

## 📋 Estrutura

```
frontend/
├── public/              # Arquivos estáticos
│   ├── index.html      # Página principal
│   ├── css/
│   │   └── style.css   # Estilos
│   └── js/
│       └── app.js      # Lógica JavaScript
├── nginx.conf          # Configuração Nginx
├── setup.sh            # Script de configuração automática
└── README.md           # Este arquivo
```

## 🔧 Configuração Local

1. **Configurar URL da API:**
   - Edite `public/index.html`
   - Localize a linha: `window.API_BASE_URL = 'http://SEU-IP-BACKEND:3000/api/produtos';`
   - Substitua `SEU-IP-BACKEND` pelo IP ou URL do seu backend

2. **Servir localmente (opcional):**
   - Use um servidor HTTP simples como `python -m http.server 8000`
   - Ou use o Live Server do VS Code

## 🚀 Deploy na AWS

Consulte o arquivo `../AWS-CONFIGURACAO.md` na raiz do projeto para instruções completas.

### Passos Rápidos:

1. **Conectar à VM Frontend:**
```bash
ssh -i sua-chave.pem ec2-user@IP-FRONTEND
```

2. **Executar script de setup:**
```bash
bash setup.sh
```

3. **Copiar arquivos do frontend para a VM:**
```bash
# Do seu computador local
scp -i sua-chave.pem -r frontend/public/* ec2-user@IP-FRONTEND:~/produtos-frontend/public/
```

4. **Configurar URL do backend:**
```bash
cd ~/produtos-frontend/public
nano index.html
# Edite a linha: window.API_BASE_URL = 'http://IP-BACKEND:3000/api/produtos';
```

5. **Recarregar Nginx:**
```bash
sudo systemctl reload nginx
```

## ⚙️ Configuração da URL da API

A URL da API deve ser configurada no arquivo `public/index.html`:

```html
<script>
    window.API_BASE_URL = 'http://IP-PUBLICO-BACKEND:3000/api/produtos';
</script>
```

**Importante:** Substitua `IP-PUBLICO-BACKEND` pelo IP público da sua VM Backend na AWS.

## 📝 Funcionalidades

- ✅ Cadastrar produtos
- ✅ Listar todos os produtos
- ✅ Buscar produto por ID
- ✅ Editar produtos
- ✅ Deletar produtos
- ✅ Interface responsiva e moderna

## 🔒 Segurança

- Headers de segurança configurados no Nginx
- Validação de dados no frontend
- Comunicação segura com a API via CORS

## 📊 Monitoramento

```bash
# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Verificar status do Nginx
sudo systemctl status nginx
```


