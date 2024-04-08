const mongoose = require("mongoose");
function connectDB() {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "chatapp"
    });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
        console.log("Database connected successfully!!");
    });
}

module.exports = connectDB;