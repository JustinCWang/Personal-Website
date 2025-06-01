const express = require("express")
const cors = require("cors")
const colors = require('colors')
const dotenv = require("dotenv").config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

connectDB()

const app = express()

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend origins
  credentials: true // Allow cookies/credentials to be sent
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/projects', require('./routes/projectRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
