const express = require('express');
const connectDB = require('./config/db')

const app = express();

//connect DB
connectDB();

//init Middleware
app.use(express.json({ extended: false })); 

app.get('/', (req,res) => res.send('App Running..'));

//Define Routes
app.use('/api/users', require('./Routes/api/users'));
app.use('/api/auth', require('./Routes/api/auth'));
app.use('/api/posts', require('./Routes/api/posts'));
app.use('/api/profile', require('./Routes/api/profile'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
