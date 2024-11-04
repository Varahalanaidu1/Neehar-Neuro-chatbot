const mongoose = require("mongoose")
const { Schema } = mongoose

// Creates a session of required params and previous filled params
// author - author's phone no. including country code
// need - next parameter expected from author
// function - function that needs the "need" parameter
const sessionSchema = Schema(
    {
        author: {
            type: String,
            required: true
        },
        store: [{
            parameter: String,
            value: String
        }],
        need: String,
        function: String
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Session', sessionSchema)

