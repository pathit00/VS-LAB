const http = require('http')
const fs = require('fs');


const express = require("express");
const path = require("path");

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'verteiltesysteme'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Database!");
});

const app = express();

// http://localhost:3000/
app.get('/', function (request, response) {
    // Render login template
    response.sendFile(path.join(__dirname + '/welcome.html'));
});


// http://localhost:3000/todos/
// (returns a list of todos)
app.get('/todos', function (request, response) {
    connection.query("SELECT * FROM verteiltesysteme.todos", function (error, results) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        console.log(results);
    });
    
});

app.listen(3000);



