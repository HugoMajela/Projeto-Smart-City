import express from 'express'
import mongoose from 'mongoose'
import Produto from './models/Produto.js'
import { interpretarPergunta } from './ia/interpretador2.js'
import analisadorSemantico from 'string-similarity'

await mongoose.connect('mongodb://localhost:27017/produtos')

const app = express()
const PORT = 3000

app.use(express.json())

// Função para normalizar os textos
function normalizar(texto) {
  if (!texto || typeof texto !== 'string') return ''
  return texto
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
}

app.post('/chat', async (req, res) => {
  const { pergunta } = req.body

  if (!pergunta || pergunta.trim().length < 2) {
    return res.status(400).json({ resposta: "Pergunta inválida. Tente novamente." })
  }

  const nomeProduto = await interpretarPergunta(pergunta)

  if (!nomeProduto) {
    return res.json({ resposta: "Desculpe, não entendi sua pergunta ou o produto não foi encontrado." })
  }

  const todosProdutos = await Produto.find()
  if (todosProdutos.length === 0) {
    return res.json({ resposta: "Ainda não há produtos cadastrados no sistema." })
  }

  //console.log(todosProdutos)

  // Calcula a similaridade
  const termos = todosProdutos.map(p => normalizar(p.titulo)) // retorna o título de todos os produtos

  // retorna cada produto com o ranking. Exemplo: {target: NOME DO PRODUTO, rating: NÚMERO DO RANKING}
  const match = analisadorSemantico.findBestMatch(normalizar(nomeProduto), termos)

  //console.log(match)

  // Pega os melhores com nota de corte
  const melhores = match.ratings
    .map((r, i) => ({ produto: todosProdutos[i], score: r.rating }))
    .filter(p => p.score >= 0.01)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  if (melhores.length === 0) {
    return res.json({ resposta: `Não encontrei "${nomeProduto}" no momento.` })
  }

  const resposta = melhores.map(p =>
    `Produto: ${p.produto.titulo}\nPreço: ${p.produto.preco} — Mercado: ${p.produto.mercado}\nLink: ${p.produto.link}`
  ).join("\n\n")

  res.json({ resposta })
})

app.listen(PORT, () => {
  console.log(`Teste do chatbot rodando em http://localhost:${PORT}/chat`)
});