import Produto from '../models/Produto.js'
import axios from 'axios'

// Envia a pergunta para o Ollama e retorna o nome do produto mencionado
export async function interpretarPergunta(pergunta) {
    const prompt = `
Extraia apenas os nomes dos produtos do texto abaixo.  
Retorne somente os nomes, um por linha, no singular, sem acentos e em letras minúsculas.  
Não adicione comentários, explicações, marcas de pontuação ou qualquer outro conteúdo.  
A saída deve conter apenas os nomes, um em cada linha.


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

        console.log(texto)

        return texto
    } catch (err) {
        console.error('Erro ao consultar Ollama:', err.response?.data || err.message)
        return null
    }
}

//Você é um assistente que ajuda a encontrar produtos em supermercados e farmácia. 
// Apenas retorne o nome do produto mencionado na pergunta abaixo, apenas o
// nome do produto, sem ficar colocando observações em parênteses.

// Pergunta: "${pergunta}"

// Nome do produto:
