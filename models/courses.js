const uuid = require('uuid/v4')
const fs = require('fs')
const path = require('path')
const { error } = require('console')



class Cousres {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuid()
    }

    save() {

    }
    static getAll() {
        fs.readFile(
            path.join(__dirname, '..'),
            (err, data) => {
                if (err) throw new Error('Error')
                console.log(data);
            }
        )
    }
}