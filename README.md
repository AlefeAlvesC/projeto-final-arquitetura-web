# GeekVerse Store

E-commerce geek full stack, desenvolvido como Projeto Final de Arquitetura Web.
Usuários navegam pelo catálogo, adicionam produtos ao carrinho e finalizam pedidos. Administradores gerenciam os produtos e acompanham as vendas.

## Tecnologias

| Camada   | Stack                                                                 |
| -------- | --------------------------------------------------------------------- |
| Frontend | React (Vite), React Router, Axios, Tailwind CSS v4, lucide-react      |
| Backend  | Node.js, Express 5, Mongoose (MongoDB), JWT, bcrypt                   |

## Funcionalidades

**Usuário comum**
- Cadastro e login com feedback visual de erros
- Catálogo com busca e filtro por categorias
- Página de detalhe do produto
- Carrinho (por usuário), com remoção de itens por seleção
- Checkout e histórico em "Meus pedidos"

**Administrador**
- Painel Admin protegido por role
- CRUD completo de produtos (criar, editar, excluir)
- Aba de pedidos com total de vendas, número de pedidos, ticket médio e produtos mais vendidos

## Arquitetura

```
.
├── client/                  # Frontend (SPA)
│   └── src/
│       ├── components/      # Navbar, Footer, ProductCard, ui/, admin/ ...
│       ├── context/         # AuthContext, CartContext
│       ├── hooks/           # useProducts, useOrders
│       ├── pages/           # Home, Login, Register, ProductDetail, Cart,
│       │                    # Checkout, MyOrders, AdminDashboard
│       ├── services/        # api.js (Axios + interceptor de token)
│       └── utils/           # format.js
└── server/                  # Backend (API REST, padrão MVC)
    ├── server.js            # Inicialização
    └── src/
        ├── app.js
        ├── models/          # User, Product, Order
        ├── controllers/     # authController, productController, orderController
        ├── routes/          # authRoutes, productRoutes, orderRoutes
        ├── middlewares/     # authMiddleware (verifyToken, verifyAdmin)
        └── seeds/           # seedAdmin, seedProducts
```

No backend, a "View" do MVC é a resposta em JSON. Os controllers concentram a regra de negócio e os models definem o schema e a validação (Mongoose).

## Como rodar localmente

### Pré-requisitos

- Node.js 18 ou superior
- Um MongoDB acessível: local (`mongodb://127.0.0.1:27017/geekverse`) ou um cluster do MongoDB Atlas

### 1. Backend

```bash
cd server
npm install
cp .env.example .env     # no Windows: copy .env.example .env
```

Edite o `.env` e preencha `MONGO_URI` e `JWT_SECRET`:

| Variável         | Descrição                                       | Exemplo                                    |
| ---------------- | ----------------------------------------------- | ------------------------------------------ |
| `PORT`           | Porta da API                                    | `5000`                                     |
| `MONGO_URI`      | String de conexão do MongoDB                    | `mongodb://127.0.0.1:27017/geekverse`      |
| `JWT_SECRET`     | Segredo usado para assinar os tokens            | qualquer texto longo e aleatório           |
| `ADMIN_NAME`     | Nome do admin criado pelo seed                  | `Administrador`                            |
| `ADMIN_EMAIL`    | E-mail do admin criado pelo seed                | `admin@geekverse.com`                      |
| `ADMIN_PASSWORD` | Senha do admin criado pelo seed                 | `admin123`                                 |

Popule o banco e inicie a API:

```bash
npm run seed:all         # cria o administrador e 12 produtos de exemplo
npm start                # API em http://localhost:5000
```

### 2. Frontend

Em outro terminal:

```bash
cd client
npm install
npm run dev              # app em http://localhost:5173
```

O endereço da API fica em `client/src/services/api.js` e deve apontar para `http://localhost:5000/api`.

## Contas para teste

| Perfil        | Como obter                                              |
| ------------- | ------------------------------------------------------- |
| Administrador | `admin@geekverse.com` / `admin123` (criado pelo seed)   |
| Usuário comum | Crie pela tela de cadastro em `/register`               |

O cadastro público cria **sempre** usuários comuns. A conta de administrador só pode ser criada por quem tem acesso ao servidor, via seed.

## Scripts do backend

| Comando                       | O que faz                                                        |
| ----------------------------- | ---------------------------------------------------------------- |
| `npm start`                   | Inicia a API                                                     |
| `npm run seed`                | Cria (ou atualiza) o administrador                               |
| `npm run seed:products`       | Insere os produtos de exemplo, sem duplicar                      |
| `npm run seed:products:reset` | Apaga todos os produtos e recria os de exemplo                   |
| `npm run seed:all`            | Administrador + produtos                                         |

## API

Base: `/api`

| Método | Rota              | Acesso        | Descrição                                           |
| ------ | ----------------- | ------------- | --------------------------------------------------- |
| POST   | `/auth/register`  | Público       | Cadastra usuário comum                              |
| POST   | `/auth/login`     | Público       | Autentica e devolve `{ token, user }`               |
| GET    | `/products`       | Público       | Lista os produtos                                   |
| POST   | `/products`       | Admin         | Cria produto                                        |
| PUT    | `/products/:id`   | Admin         | Atualiza produto                                    |
| DELETE | `/products/:id`   | Admin         | Remove produto                                      |
| POST   | `/orders`         | Autenticado   | Cria pedido                                         |
| GET    | `/orders`         | Autenticado   | Usuário comum: seus pedidos. Admin: todos           |

Rotas protegidas exigem o header `Authorization: Bearer <token>`.

## Segurança

- **Autenticação:** login com JWT (expira em 1 dia). Senhas armazenadas com hash `bcrypt`.
- **Autorização:** dois níveis (`UsuarioComum` e `Admin`). O backend valida o token e a role em cada rota protegida (`verifyToken` e `verifyAdmin`). No frontend, `ProtectedRoute` e `ProtectedAdminRoute` bloqueiam as telas, mas a barreira real é a API.
- **Escalada de privilégio:** o cadastro ignora qualquer `role` enviado pelo cliente.
- **Não confiar no frontend:** ao criar um pedido, o servidor busca os produtos no banco, valida a quantidade contra o estoque e **calcula o total com os preços reais**. O total enviado pelo cliente não é usado.
- **Validação de entrada:** validações do Mongoose nos models (campos obrigatórios) e validações de UX no frontend.
- **Token no cliente:** o JWT fica no `localStorage` e é enviado por um interceptor do Axios. Alternativa mais robusta: cookie `httpOnly`.

## Fluxo de demonstração

1. Cadastrar um usuário e mostrar um erro de login (senha incorreta).
2. Entrar como usuário comum e tentar abrir `/admin` (é redirecionado).
3. Navegar pelo catálogo, filtrar por categoria e buscar um produto.
4. Adicionar ao carrinho, remover um item e finalizar a compra.
5. Conferir o pedido em "Meus pedidos".
6. Entrar como admin, criar, editar e excluir um produto.
7. Abrir a aba "Pedidos" e conferir o total de vendas.

## Limitações conhecidas

- O pagamento é apenas visual: o model `Order` não guarda a forma de pagamento.
- O status do pedido nasce como `Pendente` e não há rota para alterá-lo.
- O carrinho fica no navegador (`localStorage`), por usuário, pois não há entidade de carrinho no backend.
- As páginas institucionais são apenas ilustrativas.
- As imagens dos produtos de exemplo são provisórias (`placehold.co`) e exigem internet.

## Autores

Projeto desenvolvido em dupla por [Alefe Alves](https://github.com/AlefeAlvesC) (Frontend) e [Luciano dos Santos](https://github.com/luciano-cc-dev/) (Backend) para a disciplina de Arquitetura Web.
