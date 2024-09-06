require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

const ChatRoute = require("./routes/Chat");
const InterviewRoute = require("./routes/InterviewQ");

app.use("/chat", ChatRoute);
app.use("/interview", InterviewRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    return res.status(500).json({
        message: "INTERNAL SERVER ERROR!",
        details: err.message
    })
});

require("./resources/db");
require("./models/JobOpening.model")
app.listen(process.env.PORT || 3000, async () => {
    // Mongoose
    console.log("Server has been started on PORT", process.env.PORT || 3000);
});