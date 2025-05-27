
# Manhuaçu Smart — Chatbot com IA + Web Scraping

Este projeto é uma **prova de conceito** de um sistema inteligente que:
- Realiza scraping de produtos de supermercados locais (Pais & Filhos e Paxá)
- Armazena os dados em um banco MongoDB
- Utiliza uma IA local (Ollama com modelo `mistral`) para interpretar perguntas em linguagem natural
- Responde com informações de produtos via API

---

## Estrutura do Projeto

```
.
├── Web Scraping/
│   ├── paisEFilhos/
│   │   └── index.js
│   └── paxa/
│       └── index.js
├── ia/
│   └── interpretador.js
├── models/
│   └── Produto.js
├── database/
│   └── conexao.js
├── server.js
└── README.md
```

---

## Como Executar

### 1. Instale as dependências
```bash
npm install
```

### 2. Inicie o MongoDB
Garanta que o MongoDB esteja rodando localmente na porta padrão:
```bash
mongod
```

### 3. Inicie o modelo no Ollama
Certifique-se de que o Ollama está instalado. Inicie o modelo `mistral`:

```bash
ollama run mistral
```

(O Ollama ficará escutando em `http://localhost:11434`)

---

## Web Scraping

### Supermercado Pais & Filhos
```bash
cd '.\Web Scraping\'
cd .\paisEFilhos\
node index.js
```

### Supermercado Paxá
```bash
cd '.\Web Scraping\'
cd .\paxa\
node index.js
```

Cada scraper:
- Extrai título, preço e link dos produtos
- Remove dados antigos
- Salva no MongoDB

---

## Executar o Servidor com IA

```bash
node server.js
```

- A API estará disponível em: `http://localhost:3000/chat`
- Aguarda perguntas do usuário sobre produtos

---

## Testando com Postman

### Exemplo:
```json
{{
  "pergunta": "Qual o preço do arroz?"
}}
```

### Resposta esperada:
```json
{{
  "resposta": "Produto: ARROZ FIGHERA T1 5KG PARB\nPreço: R$ 31,79 — Mercado: Paxá\nLink: https://paxaemcasa.com.br/loja/produto/arroz-fighera-t1-5kg-parb-36/"
}}
```

---

## 📌 Observações

- O modelo Mistral responde apenas com o nome do produto.
- A API faz uma busca usando regex no campo `titulo` do MongoDB.
- A IA não acessa diretamente o banco, apenas ajuda a identificar a intenção do usuário.

---

## 🛠️ Futuras Melhorias

- Suporte a múltiplos produtos na mesma pergunta
- Filtros por preço, mercado ou disponibilidade
- Agendamento automático dos scrapers
- Desenvolver a API para que a IA não apenas interprete a pergunta, mas também procure no banco de dados

---

## 👨‍💻 Autor

Desenvolvido por **Hugo Majela de Souza** — IF Sudeste MG Campus Manhuaçu
