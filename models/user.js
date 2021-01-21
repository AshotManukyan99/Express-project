const {Schema, model} = require('mongoose')


const user = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    bag: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})


user.methods.addToCart = function (course) {
    const items = [...this.bag.items]

    const idx = items.findIndex(c => c.courseId.toString() === course._id.toString())

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }
    this.bag = {items}
    return this.save()
}

user.methods.removeFromCart = function (id) {
    let items = [...this.bag.items]
    const idx = items.findIndex(c => c.courseId.toString() === id.toString())

    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.bag = {items}
    return this.save()
}


user.methods.clearBag = function () {
    this.bag = {items: []}
    return this.save()
}

module.exports = model('User', user)

























