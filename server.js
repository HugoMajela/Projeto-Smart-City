import express from 'express'
import mongoose from 'mongoose'
import Produto from './models/Produto.js'
import { interpretarPergunta } from './ia/interpretador.js'
import pluralize from 'pluralize'

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/produtos';
await mongoose.connect(mongoUri);

const app = express()
const PORT = 3000

app.use(express.json())

// Normaliza: minúsculas, sem acento, sem pontuação
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9 ]/g, '')      // remove pontuação
    .trim()
}

// Ex: 'fraldas' => 'fralda'
function singularizar(texto) {
  return pluralize.singular(texto)
}

app.post('/chat', async (req, res) => {
  const { pergunta } = req.body

  if (!pergunta || pergunta.trim().length < 2) {
    return res.status(400).json({ resposta: 'Pergunta inválida. Tente novamente.' })
  }

  const nomesProdutos = await interpretarPergunta(pergunta)
  console.log('🎯 Termos do Ollama:', nomesProdutos)

  if (!nomesProdutos || nomesProdutos.length === 0) {
    return res.json({ resposta: 'Não identifiquei produtos na sua pergunta.' })
  }

  // Normaliza, divide em palavras, singulariza e remove duplicatas
  const termosBusca = [...new Set(
    nomesProdutos
      .map(p => normalizar(p))
      .flatMap(p => p.split(/\s+/))         // divide cada termo por espaço
      .map(p => singularizar(p))            // singulariza
      .filter(p => p.length > 0)            // ignora vazios
  )]

  console.log('🔍 Termos normalizados para busca:', termosBusca)

  // Busca todos os produtos
  const todosProdutos = await Produto.find()
  const produtosFiltrados = todosProdutos.filter(produto => {
    const tituloNormalizado = normalizar(produto.titulo)
    return termosBusca.some(termo => tituloNormalizado.includes(termo))
  })

  if (produtosFiltrados.length === 0) {
    return res.json({ resposta: 'Nenhum produto encontrado com os termos fornecidos.' })
  }

  const resposta = produtosFiltrados.map(p => ({
    titulo: p.titulo,
    preco: p.preco,
    empresa: p.empresa,
    link: p.link
  }))

  res.json(resposta)
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}/chat`)
})
