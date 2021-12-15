var express = require("express");
var apiServer = express();
var fs = require("fs");

var port=3000;
var host="localhost";
apiServer.listen(port, host, ()=>{
    console.log("server running at http://%s:%d", host, port);
});

apiServer.get("/", (request, response)=>{
    console.log("richiesta GET /", request);
    response.send("<h1>Sei in home</h1>");
});

var cognome = "Galimberti";
apiServer.get("/nome", (request, response)=>{
    console.log("richiesta GET /nome");
    response.send("Il mio cognome è: "+cognome);
});

apiServer.get("/mioNome", (request, response)=>{
    console.log("richiesta GET /mioNome", request.query);
    response.send('Ciao, il tuo nome è: ' + request.query.nome);
});

// https://localhost:3000/student?a=1&b=2
apiServer.get("/somma", (request, response)=>{
    console.log("somma request", request.query);
    var a=parseInt(request.query.a);
    var b=parseInt(request.query.b);
    response.send('Risultato: ' + (a+b));
});

// https://localhost:3000/student?id=1
apiServer.get("/student", (request, response)=>{
    console.log("student id: ", request.query.id);

    // Lettura file
    fs.readFile("studenti.json", (err, data) => {
        if (err) {
            console.log("error: "+err);
        } else {
            var students = JSON.parse(data);
            console.log(students[(request.query.id)-1]);
            response.send(students.find(x => x.id === request.query.id));
        }
    });
});

apiServer.get("/newStudent", (request, response)=>{
    console.log("new student: ", request.query.surname, request.query.name, request.query.id);
    
    // Write on a file
    fs.readFile("studenti.json", (err, data) => {
        if (err) {
            console.log("error: "+err);
        } else {
            var students = JSON.parse(data);
            students.push({"surname":request.query.surname,"name":request.query.name,"id":request.query.id});
            fs.writeFile("studenti.json", JSON.stringify(students), (err) => {
                if (err) {
                    console.log("error: "+err);
                }
            });
        }
    });
});