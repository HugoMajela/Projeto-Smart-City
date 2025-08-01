import axios from 'axios'

export async function interpretarPergunta(pergunta) {
  const prompt = `
Sua tarefa é extrair termos de produtos consultáveis em um banco de dados.

Entrada: um pedido do usuário em linguagem natural. Pode conter o nome do produto especificamente ou uma categoria. Por exemplo, listar todos os itens que são vendidos em açougue. 

IMPORTANTE:
No caso de perguntar sobre uma categoria, ou seja, termos genéricos (como "açougue", "hortifruti", "padaria"), você deve interpretar e convertê-los para nomes específicos de produtos. Por exemplo:
- "itens de açougue" → carne bovina, carne suina, frango, linguiça
- "frutas" → banana, maçã, laranja
- "pães" → pao frances, pao de forma
Mas somente faça isso para termos genéricos. 

Saída:
- Apenas os nomes dos produtos reais que estão relacionados à intenção do usuário
- Um termo por linha
- Letras minúsculas
- No singular
- Sem acento
- Sem explicação, comentário ou exemplo
- Somente termos em português

ATENÇÃO:
Retorne só e somente só o nome do produto. Não adicione qualquer informação. 
Caso o usuário informe o nome do produto específico, pode manter na consulta. 
Para palavras compostas, use obirgatoriamente espaço para separá-las e não -

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
