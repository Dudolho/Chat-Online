
// Logins elements
const login = document.querySelector('.login')
const loginForm = login.querySelector('.login__form')
const loginInput = login.querySelector('.login__input')

//chat elements
const chat = document.querySelector('.chat')
const chatForm = chat.querySelector('.chat__form')
const chatInput = chat.querySelector('.chat__input')
const chatMessages = chat.querySelector('.chat__messages')

const user = { //criando o objeto do usuario
    id: "",
    name: "",
    color: ""

}

const colors = [ //lista de cores para ser atribuida ao user de forma aleatória
    "cadetblue",
    "green",
    "chocolate",
    "gold",
    "pink",
    "hotpink",
    "blue",
    "red",
]

let websocket

const createMessageSelfElement = (content) => { //criar a div da mensagem enviada pela própria pessoa
    const div = document.createElement("div") //criando a div
    div.classList.add("message--self") //adicionando a classe
    div.innerHTML = content //adicionando o conteudo

    return div //retornando a div
}

const createMessageOtherElement = (content, sender, senderColor) => { //criar a div da mensagem enviada pela outra pessoa
    const div = document.createElement("div") //criando a div
    const span = document.createElement("span") //criando o span
    div.classList.add("message--other") //adicionando a classe
    span.classList.add("message--sender") //adicionando a classe
    span.style.color = senderColor

    div.appendChild(span) //colocando o span como filho da div

    span.innerHTML = sender //adicionando o nome do usuario
    div.innerHTML += content //adicionando o conteudo (+= para agregar)
    
    return div //retornando a div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const processMessage = ({data}) => { //processar a mensagem enviada pelo servidor
    const { userId, userName, userColor, content } = JSON.parse(data)

    if (user.id == userId) { //case a mensagem seja do mesmo id
        const element = createMessageSelfElement(content) 
        chatMessages.appendChild(element) 
    } else { //caso seja de id's diferentes
        const element = createMessageOtherElement(content, userName, userColor)
        chatMessages.appendChild(element)
    }
    rollScreen() //rolar a pagina

    
}

const handleLogin = (event) => { //função a ser executada no submit
    event.preventDefault() //impedir de atualizar a pagina

    user.id = crypto.randomUUID() //cria um id aleatório
    user.name = loginInput.value // atualizanto o nome do usuario baseado no input
    user.color = getRandomColor() //seleciona uma cor aleatória

    login.style.display = 'none' //ocultando a tela de login
    chat.style.display = 'flex' //mostrando a tela de chat

    websocket = new WebSocket("wss://chat-backend-euly.onrender.com")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault() //evitar recarregar a pagina

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

const rollScreen = () => { //função para retornar para baixo no envio das mensagens
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

loginForm.addEventListener("submit", handleLogin) //escutador de eventos para o submit
chatForm.addEventListener("submit", sendMessage) //escutador de eventos para chat
