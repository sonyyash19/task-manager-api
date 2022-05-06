const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'    // stablishing relationship with the user to access all its properties
    }
}, {
    timestamps: true
})

const Tasks = mongoose.model('Tasks',taskSchema)

module.exports = Tasks;