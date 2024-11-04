import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.get('/', (req , res)=>{
    res.send("Welcome to expense tracker");
});

app.listen(PORT, (error)=>{
    console.log(`Server running on http://localhost:${PORT}`);
})