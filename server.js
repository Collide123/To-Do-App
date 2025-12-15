const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Todo = require('./todoModel'); // Import the Todo model
const app = express();
const PORT = 5000;
// 🛑 IMPORTANT: REPLACE THIS WITH YOUR ACTUAL MONGODB CONNECTION STRING
const MONGO_URI = process.env.MONGO_URI; 

// --- Database Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- Middleware ---
const allowedOrigin = 'https://to-do-frontend-ebon-plvercel.app'; 

app.use(cors({
    allowedOrigin: ['https://to-do-frontend-ebon-plvercel.app', 'http://localhost:3000'], // Allowing both Vercel and localhost
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// --- API Endpoints (Using Mongoose) ---

// 1. GET /api/todos - Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. POST /api/todos - Add a new todo
app.post('/api/todos', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'Todo text is required' });
    }

    const newTodo = new Todo({ text });

    try {
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. PUT /api/todos/:id - Toggle todo completion status
app.put('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        todo.completed = !todo.completed;
        
        const updatedTodo = await todo.save(); 
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message }); 
    }
});

// 4. DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
