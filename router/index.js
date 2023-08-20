const express = require('express')
const app = express();

app.post('/add', function(req,res){
  
    console.log("New employee has been added");
    res.send("New employee has been added into the database with ID = ");
    
    console.log(req.body);
  });
