import mongoose from 'mongoose'

const produtoSchema = new mongoose.Schema({
    titulo: String,
    preco: String,
    mercado: String,
    link: String
}, {timestamps: true})

export default mongoose.model('Produto', produtoSchema)