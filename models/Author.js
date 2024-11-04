const mongoose = require("mongoose")
const { Schema } = mongoose

// name - name provided by the person
// phone - phone number incl. country code
// whatsapp - person's name extracted from whatsapp
const authorSchema = Schema(
    {
        name: String,
        countrycode: String,
        phone: {
            type: String,
            required: true
        },
        customercare: {
            active: {
                type: Boolean,
                default: false
            },
            agenthash: String
        },

        blocked: {
            type: Boolean,
            default: false
        },
        whatsapp: String
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Author', authorSchema)
