const http = require('http')
const fs = require('fs');
const express = require("express");
const path = require("path");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

var mysql = require('mysql');
const { response } = require('express');

var bodyParser = require('body-parser')

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Customer API",
            description: "Customer API Information",
            contact: {
                name: "Patrick und Dustin"
            },
            servers: ["http://localhost:3000"]
        }
    },
    apis: ["server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'verteiltesysteme'
});

connection.connect(function (err) {
    console.log("Connected to Database!");
});


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(bodyParser.json())


// http://localhost:3000/
app.get('/', function (request, response) {
    // Render login template
    response.sendFile(path.join(__dirname + '/welcome.html'));
});


// http://localhost:3000/todos/

//http://localhost:3000/api-docs/#/




/**
 * @swagger
 * /todos:
 *  get:
 *      summary: Get all todos
 *      responses:
 *       200:
 *         description: "Successful response"
 *       400:
 *          description: "Something went wrong"
 * 
 * /todos/{name}:
 *  get:
 *      summary: Get todos with specific name
 *      parameters:
 *        - in: path
 *          name: name
 *          schema:
 *              type: string
 *              required: true
 *              description: Name of a todo task
 *      responses:
 *          200:
 *              description: "Succesfull response"
 *          400:
 *              description: "Something went wrong"
 * 
 * /todos/{namedelete}:
 *  delete:
 *      summary: Delete todos with specific name
 *      parameters:
 *        - in: path
 *          name: name
 *          schema:
 *              type: string
 *              required: true
 *              description: Name of a todo task
 *      responses:
 *          200:
 *              description: "Succesfull response"
 *          400:
 *              description: "Something went wrong"
 * 
 * /todos/{id}/{priority}:
 *  put:
 *      summary: update todos with specific id
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *              required: true
 *              description: id of a todo task
 *        - in: path
 *          name: priority
 *          schema:
 *              type: integer
 *              required: true
 *              description: priority of a todo task
 *      responses:
 *          200:
 *              description: "Succesfull response"
 *          400:
 *              description: "Something went wrong"
 * 
 * /todos/:
 *  post:
 *      summary: Creates a new todo
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: user
 *            description: The todo to create
 *            schema:
 *              type: object
 *              required:
 *                  - id
 *              properties:
 *                  priority:
 *                      type: integer
 *                  todo:
 *                      type: string
 *      responses:
 *          200:
 *              description: Created
 *
 */

//POST /todos/ (send/receive JSON object)

app.post('/todos', function(req,res){
    
    connection.query("INSERT INTO verteiltesysteme.todos(priority,todo) VALUES ('"+req.body.priority+"','"+req.body.todo+"')" ,function (error, results) {
        if (error) throw error;
    });

    console.log(req.body.priority);
    res.send(req.body)
 });


// GET /todos/ (returns a list of todos)
app.get('/todos', function (request, response) {
    connection.query("SELECT * FROM verteiltesysteme.todos", function (error, results) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        response.send(results);
    });

});

// GET /todos/{name} (returns a todo if exists)
app.get('/todos/:name', function(req, res) {
    connection.query("SELECT * FROM verteiltesysteme.todos WHERE todo = '"+req.params.name + "'", function (error, results) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        res.send(results);
    });
  });

//DELETE  /todos/{name} (deletes a todo if exists)
app.delete('/todos/:name', function(req,res){
    connection.query("DELETE FROM verteiltesysteme.todos WHERE todo = '"+req.params.name + "'", function (error, results) {
        // Query Example: DELETE FROM verteiltesysteme.todos WHERE todo = "hallo"
        // If there is an issue with the query, output the error
        if (error) throw error;
        res.send("Successfully deleted todo");
    });
});


//PUT /todos/ (send/receive JSON object., e.g. can change priority)
// update todos in database
// filter by id
// parameters id of todo that should get updated
// parameter 2: priority
app.put('/todos/:id/:priority', function(req,res){
    // Query Example: UPDATE verteiltesysteme.todos SET priority = 1 WHERE id = 1;
    connection.query("UPDATE verteiltesysteme.todos SET priority ="+req.params.priority+" WHERE id="+req.params.id, function(error,results){
        if (error) throw error;
        res.send(results);
    });
});

app.listen(3000);



