require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/User')

const app = express()

//Config JSON response
app.use(express.json())

//Models


//Open Route
app.get('/', async(req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API' })
})

//Register User
app.post('/auth/register'), async(req, res) => {

    const { name, email, password, confirmpassword } = req.body

    //Validations
    if(!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório !' })
    }

    if(!email) {
        return res.status(422).json({ msg: 'O email é obrigatório !' })
    }

    if(!password) {
        return res.status(422).json({ msg: 'A senha é obrigatório !' })
    }

    if( password !== confirmpassword ) {
        return res.status(422).json({ msg: 'As senhas não conferem !' })
    }

    //check user if exists
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        res.status(422).json({ msg: 'Por favor, ultilize outro email' })
    }
    //Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Create User
    const user = new User ({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save()
        res.status(201).json({  msg: 'Usuário criado com sucesso !'})

    }catch(error) {
        console.log(error)
        res.status(422).json({ msg: 'Algo de errado ocorreu no banco' })
    }
}


//Credencials
const dbUser = process.env.DB_USER
const dbPass = encodeURIComponent(process.env.DB_PASSWORD)

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.fvugqa3.mongodb.net/?retryWrites=true&w=majority`).then(() =>{
    //app.listen(3001)
    console.log('Conexão ao banco efetuado com sucesso !')
}).catch((err) => console.log(err)) 


app.listen(3000)

