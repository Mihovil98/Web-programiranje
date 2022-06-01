/*
express - starts the server
mysql - database
dotenv - storage for sensitive information like passwords
hbs - handlebars, template for html
nodemon - automatically restarts the server when changes occur in the code
*/

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env" });

const app = express();

const db = require("./database");
const { cookie } = require("express/lib/response");

db.connect( (error) => {
    if(error){
        console.log(error)
    } else{
        console.log("MYSQL Connected...")
    }
})

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
// Enables grabbing the data from any forms 
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
// The values that we are grabbing from the form will come as JSON
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "hbs");

//Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(5000, () => {
    console.log("Server started on Port 5000");
});