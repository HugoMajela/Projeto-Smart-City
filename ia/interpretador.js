import axios from 'axios'

export async function interpretarPergunta(pergunta) {
  const prompt = `
Extraia apenas o nome do produto mencionado no texto abaixo.  
Saída:
- Somente o nome do produto
- Uma palavra ou termo por linha
- Letras minúsculas
- Sem acentos
- Sem explicações

Texto: "${pergunta}"
  `

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt,
      stream: false
    })

    const texto = response.data.response.trim()

    // Apenas linhas simples e válidas
    return texto
      .split('\n')
      .map(l => l.trim().toLowerCase())
      .filter(l => l.length > 0)
  } catch (error) {
    console.error('Erro ao interpretar pergunta com Ollama:', error.message)
    return []
  }
}