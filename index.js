import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import linkRouter from "./routes/linkRoute.js"
import { initDB } from "./db/init.js"
import db from "./db/database.js"

const port = process.env.PORT || 8000
const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials:true
}))
app.use(express.json())

app.use('/api', linkRouter)

initDB()

app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.get('/api/health', (req, res) => {
    try {
        db.prepare("SELECT 1").get()

        let llmStatus = "Available"
        try {
            if(!process.env.GEMINI_API_KEY){
                llmStatus = "Missing Key"
            }
        } catch (error) {
            llmStatus = "error"
        }
        res.json({
            backend:"Healthy",
            database:"Connected",
            llm:llmStatus
        })
    } catch (error) {
        res.status(500).json({
            backend:"error",
            database:"error",
            llm:"unknown"
        })
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
});