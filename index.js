const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const TGbot = require('node-telegram-bot-api');
const DB = require('./database');

//5334206041:AAGh5_thgBbu4wO04P9laxKjlfeLeYHy8_4 - bot api

const app = express();
const Database = new DB();
const bot = new TGbot('5334206041:AAGh5_thgBbu4wO04P9laxKjlfeLeYHy8_4', {polling: true});

app.use(cors());
app.use(bodyParser.json())

bot.on('message', (msg) => {
    // console.log(msg)

    const [command, value] = msg.text.split(' ');

    switch (command) {
        case "/start":
            bot.sendMessage(msg.chat.id, 'Пожалуйста войдите в систему.');
            break;
        
        case "/login":
            if(Database.getCrmPassword() === value) {
                const newUser = Database.addCrmUser(msg.chat);

                bot.sendMessage(msg.chat.id, 'Здравствуйте, вы вошли в систему!');
            }
            else bot.sendMessage(msg.chat.id, 'Неверный пароль');
            break;
    }
});

app.use((req, res, next) => {
    console.log(' -- REQUEST');
    console.log( req.body );
    next();
});

const categories = {
    tel: 'Телефон',
    additional: 'Опросник',
    type: 'Название сделки',
    name: 'Имя',
    address: 'Адрес',
    "type-mat": 'Объект',
    "type-materia": 'Тип материала',
    "send-result-polzunok": 'Площадь',
    "type-object": 'Дата заказа?',
    "payment": "Рассчитывать доборные элементы?",
    "installation": "Нужен ли монтаж?",
    "social": "Как связаться",
    "type-of-material": "Материал",
    "range": "Площадь"
}

TEST_QUESTIONS = {
    "type-mat": 'Объект',
    "type-materia": 'Тип материала',
    "send-result-polzunok": 'Площадь',
    "type-object": 'Дата заказа?',
    "payment": "Рассчитывать доборные элементы?",
    "installation": "Нужен ли монтаж?",
    "social": "Как связаться"
}

app.get('/', (req, res) => {
    res.json({
        status: 'Server is running'
    });
});

app.get('/api', (req, res) => {
    res.json({
        status: 'Server is running'
    });
});

app.post('/api/form', (req,res) => {
    const data = req.body;
    let message = '';

    Object.keys(data).forEach(item => {
        console.log(categories[item]);
        message = message + `${categories[item]}: ${data[item]}\n`
    });

    try {
        Database.getCrmUsers().forEach((user) => {
            bot.sendMessage(user.id, message);
        });
    } catch(err) {
        console.log(err)
        res.json({status: 500});
    }

    Database.addLead(data);

    res.json({
        status: 200
    });
});


const port = process.env.PORT || 5000;

console.log(port)

app.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`--[Server started ( Listening to ${port} )]--`);
});

//restart

