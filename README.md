# Geek E-commerce - Backend API

API RESTful desenvolvida em Node.js e Express para o backend de um e-commerce com temática geek, utilizando persistência de dados com MongoDB e autenticação segura via JWT.

## 🚀 Tecnologias Utilizadas

* Node.js
* Express
* MongoDB & Mongoose
* JWT (jsonwebtoken)
* Bcrypt
* Podman / Docker

---

## 📁 Estrutura do Projeto

O projeto segue uma arquitetura modular com separação de responsabilidades:

```text
server/
├── src/
│   ├── config/       # Configuração de conexões
│   ├── controllers/  # Lógica de negócio das rotas
│   ├── middlewares/  # Autenticação e autorização
│   ├── models/       # Schemas do Mongoose
│   ├── routes/       # Definição dos endpoints
│   ├── app.js        # Configuração do Express
│   └── server.js     # Ponto de entrada
├── .env.example      # Exemplo de variáveis
├── .env              # Variáveis locais
├── package.json      # Dependências e scripts
└── README.md
```

## ⚙️ Pré-requisitos

Certifica-te de que tens instalado na tua máquina:
* Node.js (versão 18 ou superior recomendada)
* Podman ou Docker (para executar o container do MongoDB)

---

## 📥 Instalação e Configuração

1. **Aceda à pasta do servidor:**
   ```bash
   cd server
2. **Instale as dependências:**
   ```bash
   npm install
3. **Configure as Variáveis de Ambiente:**
   Crie um ficheiro `.env` na raiz da pasta `server` com base no exemplo abaixo:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce-geek?directConnection=true
   JWT_SECRET=sua_chave_secreta_super_segura
4. **Inicie o MongoDB via Podman:**
   ```bash
   podman run -d --name meubanco-mongo -p 27017:27017 mongo:7.0
5. **Inicie o Servidor em Modo de Desenvolvimento:**
   ```bash
   npm run dev 
---

O servidor ficará disponível em http://localhost:5000.
---

## 🔌 Endpoints Principais (API Routes)

### 🔓 Autenticação (`/api/auth`)
* `POST /api/auth/register` - Registo de novo utilizador.
* `POST /api/auth/login` - Autenticação de utilizador e retorno do token JWT.

### 🛍️ Produtos (`/api/products`)
* `GET /api/products` - Lista todos os produtos disponíveis (Pública).
* `POST /api/products` - Cadastra um novo produto (Requer autenticação e privilégio de Administrador).

---

## 🛡️ Segurança
* As senhas são encriptadas de forma segura utilizando o **bcrypt**.
* As rotas administrativas exigem a validação de um token **JWT** enviado através do header `Authorization: Bearer <token>`.