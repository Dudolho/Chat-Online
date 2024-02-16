const { WebSocketServer } = require("ws") //importando o ws
const dovenv = require("dotenv") //importando o dotenv

dovenv.config() //inicializando as variaveis globais do .env    

const wss = new WebSocketServer({port: process.env.PORT || 8080})

wss.on("connection", (ws) => { //conectando ao servidor
    ws.on("error", console.error) //caso de error

    ws.on("message", (data) => { //sempre que uma mensagem foi enviada para o servidor executa essa função
        console.log(data.toString())
        wss.clients.forEach((client) => client.send(data.toString()))

    })

    console.log("client conected")
})

