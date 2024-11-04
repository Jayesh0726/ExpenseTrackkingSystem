import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();

app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT;
app.get('/', (req , res)=>{
    res.send("Welcome to expense tracker");
});

app.get('/dashboard', (req, res)=>{
    res.send('Expense tracker dashboard');
})

app.listen(PORT, (error)=>{
    console.log(`Server running on http://localhost:${PORT}`);
})