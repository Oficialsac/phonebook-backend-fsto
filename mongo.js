const mongoose = require('mongoose')

const conectString = process.env.MONGO_DB_URI

mongoose.connect(conectString)  
    .then(res => {
        console.log(`Database conected`);
    }).catch(err => console.error(err))





