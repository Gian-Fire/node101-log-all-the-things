const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();

app.use(morgan("dev"));
app.use((req, res, next) => {
// write your logging code here
    var agent = req.headers['user-agent'].replace(',', '');
    var time =  new Date().toISOString();
    var method = req.method;
    var resource = req.originalUrl;
    var version = `HTTP/${req.httpVersion}`;
    var status = res.statusCode;
    var log =`${agent},${time},${method},${resource},${version},${status}\n`;
        console.log(log);
    fs.appendFile('log.csv', log, (err) => {
        if (!!err) throw err;
            console.log('Saved!');
    });
        next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send('OK')
});

app.get('/logs', (req, res) => {
// // write your code to return a json object containing the log data here
    fs.readFile('log.csv', 'utf8', (err, data) => {
        if (!!err) throw err;
        var logJson = [];
        var row = data.split('\n');
        for(var i = 0; i < row.length - 1; i++) {
            var rowData = row[i].split(',');
            var logData = {
                'Agent': rowData[0],
                'Time': rowData[1],
                'Method': rowData[2],
                'Resource': rowData[3],
                'Version': rowData[4],
                'Status': rowData[5]
            };
        logJson.push(logData);
        }
        res.status(200).json(logJson);
        res.end();
    });
});
module.exports = app;