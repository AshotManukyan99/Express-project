const fs = require('fs')
const uuid = require('uuid')
const path = require('path')



class Cousres {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuid.v4()
    }

    toJson() {

        return JSON.stringify({
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
        )
    }

    async save() {
        const courses = await Cousres.getAll()
        courses.push(this.toJson())
        console.log(courses);

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'data.json'),
                JSON.stringify(courses),
                err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'data.json'),
                'utf-8',
                (err, content) => {
                    if (err) reject(err)
                    resolve(JSON.parse(content))
                }
            )
        })
    }


}


module.exports = Cousres