const mongoose = require("mongoose")
const { Schema } = mongoose

// author - author phone in format - countrycode + phone e.g. "+917002022910"
// agenthash - unique hash of agent an author is chatting to
const chatSchema = Schema(
    {
        author: String,
        agenthash: String,
        messages: [
            {
                from: {
                    type: String,
                    enum: ["author", "agent"]
                },
                to: {
                    type: String,
                    enum: ["author", "agent"]
                },
                kind: {
                    type: String,
                    enum: ["text", "image"],
                    default: "text"
                },
                message: String,
                timestamp: Date
            }
        ]
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Chat', chatSchema)

