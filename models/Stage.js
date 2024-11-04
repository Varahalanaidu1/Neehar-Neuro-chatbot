const mongoose = require("mongoose");
const { Schema } = mongoose;

// stars - activeness of users [> 10 => medium, > 18 => high]
const stageSchema = Schema(
    {
        phone: {
            type: String,
            required: true
        },
        searched: {
            type: [{
                type: String,
                enum: ["Book an Appointment", "View Prescription", "Other Services"]
            }]
        },
        locations: [String],
        connect: {
            type: Number,
            default: 0
        },
        stage: {
            type: String,
            enum: ["Book an Appointment", "View Prescription", "Other Services"],
            default: "Book an Appointment"
        },
        stars: {
            type: Number,
            default: 0
        }
    },
    {
        id: false,
        timestamps: true,
        toJSON: { virtuals: true }
    }
)

stageSchema.virtual("__user", {
    ref: 'Author',
    localField: 'phone',
    foreignField: 'phone',
    justOne: true
})

module.exports = mongoose.model('Stage', stageSchema)
