const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { Schema } = mongoose

const personsSchema = new Schema({
    name: { type: String, required: true, unique: false , minlength: 5},
    number: {type :String , required: true, unique: false}
})

personsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

personsSchema.plugin(uniqueValidator)
const Person = mongoose.model('Person', personsSchema)

module.exports = Person