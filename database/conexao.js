import mongoose from 'mongoose'

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/produtos'

export async function conectar() {
    try {
        await mongoose.connect(mongoUri)
        console.log("Conectado com o MongoDB")
    } catch (error) {
        console.log("Erro ao conectar com o banco: ", error)
    }
}

conectar()
