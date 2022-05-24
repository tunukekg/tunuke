const express = require('express');
const AmoCRM = require('amocrm-js');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const TGbot = require('node-telegram-bot-api');
const DB = require('./database');

//5334206041:AAGh5_thgBbu4wO04P9laxKjlfeLeYHy8_4 - bot api

const app = express();
const Database = new DB();
const bot = new TGbot('5334206041:AAGh5_thgBbu4wO04P9laxKjlfeLeYHy8_4', {polling: true});
let CHAT_ID = '650567115';

app.use(cors());
app.use(bodyParser.json())

bot.on('message', (msg) => {
    CHAT_ID = msg.chat.id;
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
    "social": "Соц-сети"
}

TEST_QUESTIONS = {
    "type-mat": 'Объект',
    "type-materia": 'Тип материала',
    "send-result-polzunok": 'Площадь',
    "type-object": 'Дата заказа?',
    "payment": "Рассчитывать доборные элементы?",
    "installation": "Нужен ли монтаж?",
    "social": "Соц-сети"
}

app.get('/api/leads', (req, res) => {
    const leads = Database.getLeads();

    res.json({
        leads, status: 200
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
        bot.sendMessage(CHAT_ID, message);
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

app.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`--[Server started ( Listening to ${port} )]--`);
});

