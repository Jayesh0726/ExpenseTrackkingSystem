const express = require('express');
const app = express();

const PORT = 8000;
app.get('/', (req , res)=>{
    res.send("Hello Server");
});

app.listen(PORT, (error)=>{
    console.log(`Server started on port ${PORT}`);
})