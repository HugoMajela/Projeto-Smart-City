import Produto from '../models/Produto.js'
import axios from 'axios'

// Envia a pergunta para o Ollama e retorna o nome do produto mencionado
export async function interpretarPergunta(pergunta) {
    const prompt = `
Você é um assistente que ajuda a encontrar produtos em supermercados. 
Apenas retorne o nome do produto mencionado na pergunta abaixo, sem explicações.

Pergunta: "${pergunta}"

Nome do produto:
    `.trim()

    try {
        const resposta = await axios.post('http://localhost:11434/api/generate', {
            model: 'mistral',
            prompt,
            stream: false
        })

        const texto = resposta.data.response.trim()
        if (!texto || texto.length < 2) return null

        return texto
    } catch (err) {
        console.error('Erro ao consultar Ollama:', err.response?.data || err.message)
        return null
    }
}
