import mongoose from 'mongoose'

const produtoSchema = new mongoose.Schema({
    titulo: String,
    preco: String,
    empresa: String,
    link: String
}, {timestamps: true})

export default mongoose.model('Produto', produtoSchema)