const json = require('./database.json');
const LeadModel = require('./model/lead');
const fs = require('fs');

const TEST_QUESTIONS = {
    "type-mat": 'Объект',
    "type-materia": 'Тип материала',
    "send-result-polzunok": 'Площадь',
    "type-object": 'Дата заказа?',
    "payment": "Рассчитывать доборные элементы?",
    "installation": "Нужен ли монтаж?",
    "social": "Соц-сети"
}

class Database {

    constructor() {
        this.database = json;
    }

    updateDatabase(data) {
        fs.writeFileSync('database.json', JSON.stringify(this.database));
    }

    getLeads() {
        return this.database.leads;
    }

    getLeadById(id) {
        return this.database.leads.filter(lead => lead.id == id)[0];
    }

    addLead(data) {
        const newLead = {...data};

        if(data.type === 'Опросник') {
            let additional = '';

            Object.keys(TEST_QUESTIONS).forEach(key => {
                console.log(key)
                additional = additional + `${TEST_QUESTIONS[key]}: ${data[key]} - `;
            });

            newLead.additional = additional;
        }

        const Lead = new LeadModel(newLead);

        this.database.leads.push(Lead);
        this.updateDatabase();

        return Lead;
    }

    updateLead({id, field, value}) {
        const leads = [...this.database.leads];
        let updatedLead = {};

        leads.forEach((lead, index) => {
            if(lead.id === id) {
                leads[index][field] = value;
                updatedLead = leads[index]; 
            }
        });

        this.database.leads = leads;
        return updatedLead;
    }

    removeLead(id) {
        let removedLead;

        const leads = this.database.leads.filter(lead => {
            if(lead.id !== id) {
                return true;
            }
            
            removedLead = lead;
            return false;
        });

        this.database.leads = leads;
        this.updateDatabase();

        return removedLead;
    }

}

module.exports = Database;