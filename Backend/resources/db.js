const mongoose = require('mongoose');
 console.log(process.env.DB_URL);
 mongoose.connect(process.env.DB_URL, {}).then(() => console.log("Db connected")).catch((err) => console.log('MongoDB connection error:', err));
 

 module.exports = mongoose;
