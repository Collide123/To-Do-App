const mongoose = require('mongoose');

// Define the structure of a Todo document
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;