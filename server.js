import express from 'express'
import mongoose from 'mongoose'
import Produto from './models/Produto.js'
import { interpretarPergunta } from './ia/interpretador.js'

await mongoose.connect('mongodb://localhost:27017/produtos')

const app = express()
const PORT = 3000

app.use(express.json())


app.post('/chat', async (req, res) => {
  const { pergunta } = req.body

  if (!pergunta || pergunta.trim().length < 2) {
    return res.status(400).json({ resposta: "Pergunta inválida. Tente novamente." })
  }

  const nomeProduto = await interpretarPergunta(pergunta)

  if (!nomeProduto) {
    return res.json({ resposta: "Desculpe, não entendi sua pergunta ou o produto não foi encontrado." })
  }

  const produtos = await Produto.find({ titulo: { $regex: nomeProduto, $options: 'i' } })

  if (produtos.length === 0) {
    return res.json({ resposta: `Não encontrei "${nomeProduto}" no momento.` })
  }

  const resposta = produtos.map(p =>
    `Produto: ${p.titulo}\nPreço: ${p.preco} — Mercado: ${p.mercado}\nLink: ${p.link}`
  ).join("\n\n")

  res.json({ resposta })
})

app.listen(PORT, () => {
  console.log(`Teste do chatbot rodando em http://localhost:${PORT}/chat`)
});