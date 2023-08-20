const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config();


const URI = `mongodb+srv://drverma2704:12345@giftwala.x1ywjoh.mongodb.net/GiftWala?retryWrites=true&w=majority`



async function  ConnectDB () {
    try{
        await mongoose.connect(URI,{
            useNewUrlParser: true,
            useUnifiedTopology :true
        })

        console.log("Connected to DB");
    }
    catch(err){
        console.log('Error connecting to database', err);
    }
}

module.exports = ConnectDB;

