import mongoose from 'mongoose'

export async function conectar(){
    try {
        await mongoose.connect('mongodb://localhost:27017/produtos')
        console.log("Conectado com o MongoDB")
    } catch (error) {
        console.log("Erro ao conectar com o banco: ", error)
    }
}

conectar()