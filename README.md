
# 🛒 Manhuaçu Smart Market — Chatbot com IA + Web Scraping

Este projeto é uma **prova de conceito** de um sistema inteligente que:
- Realiza scraping de produtos de supermercados locais (Pais & Filhos e Paxá)
- Armazena os dados em um banco MongoDB
- Utiliza uma IA local (Ollama com modelo `mistral`) para interpretar perguntas em linguagem natural
- Responde com informações de produtos via API

---

## 📦 Estrutura do Projeto

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

## 🚀 Como Executar

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

## 🕸️ Web Scraping

### Supermercado Pais & Filhos
```bash
node Web\ Scraping/paisEFilhos/index.js
```

### Supermercado Paxá
```bash
node Web\ Scraping/paxa/index.js
```

Cada scraper:
- Extrai título, preço e link dos produtos
- Remove dados antigos
- Salva no MongoDB

---

## 🤖 Executar o Servidor com IA

```bash
node server.js
```

- A API estará disponível em: `http://localhost:3000/chat`
- Aguarda perguntas do usuário sobre produtos

---

## 🧪 Testando com cURL ou Postman

### Exemplo:
```bash
curl -X POST http://localhost:3000/chat \
     -H "Content-Type: application/json" \
     -d '{{"pergunta": "Qual o preço do leite?"}}'
```

### Resposta esperada:
```json
{{
  "resposta": "Produto: Leite Italac Integral 1L\nPreço: R$ 4,99 — Mercado: Paxá\nLink: https://..."
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
- Painel administrativo
- Agendamento automático dos scrapers
- Deploy com Docker

---

## 👨‍💻 Autor

Desenvolvido por **Hugo Majela de Souza** — IF Sudeste MG Campus Manhuaçu
