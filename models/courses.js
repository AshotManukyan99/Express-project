const {Schema, model} = require('mongoose')


const course = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    url: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: 0
    }
})


module.exports = model('Course', course)