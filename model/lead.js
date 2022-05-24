const uniqid = require('uniqid');

const STATUS = {
    unsorted: 'Неразобранное',
    active: 'В обработке',
    done: 'Обработан'
}

class LeadModel {
    constructor({name=null, tel=null, address=null, type=null, additional=null}) {
        this.name = name;
        this.tel = tel;
        this.address = address;
        this.type = type;
        this.additional = additional;
        this.status = STATUS.unsorted;
        this.id = uniqid();
    }
}

module.exports = LeadModel;