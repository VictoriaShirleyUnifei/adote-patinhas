# Adote Patinhas 🐾

Adote Patinhas é um site de adoção de pets, pensado para facilitar o encontro entre animais disponíveis para adoção e novos tutores. O projeto oferece uma experiência completa para usuários, incluindo cadastro, login, gerenciamento de perfil e cadastro de pets.


## Funcionalidades

### Autenticação
- **Cadastro de usuário:** Permite criar uma conta com informações pessoais.
- **Login:** Acesso seguro ao sistema.

### Home
- **Exibição de pets:** Cards com informações dos animais disponíveis para adoção.
- **Filtros:** Possibilidade de filtrar por espécie, raça e porte.
- **Cadastro de pet:** Botão para adicionar um novo animal (para usuários logados).

### Perfil do Usuário
- **Dados pessoais:** Visualização e edição das informações do usuário.
- **Animais cadastrados:** Tab com os pets cadastrados pelo usuário.

### Interface
- **Dark Mode:** Tema escuro para melhor experiência visual.



## Tecnologias Utilizadas
- Frontend e Backend: Next.js
- Estilização: Tailwind e Material UI


## Como rodar o projeto

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/adote-patinhas.git
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse no navegador:
http://localhost:3000


## Estrutura do Projeto
O projeto é organizado seguindo as melhores práticas do Next.js 14 com App Router, utilizando uma arquitetura modular e bem separada por responsabilidades.

`app/` - Páginas do Next.js e Rotas

- `(private)/` - Páginas privadas

- `(public)/` - Páginas públicas

- `api/` - Endpoints da API para comunicação com o backend

`components/` -  Componentes Reutilizáveis do sistema

`context/` -  Gerenciamento de Estados Global

`db/` -  Banco de Dados Local

`hooks/` - Custom Hooks

`lib/` - Utilitários e Configurações

`schemas/` - Validação de Dados

`types/` - Tipagens TypeScript

`utils/` - Funções Auxiliares

