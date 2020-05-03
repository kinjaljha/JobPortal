const express = require('express')
const app = express()

var cors = require('cors');


const port = 3001
const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");

const getAsync = promisify(client.get).bind(client);

var allowedOrigins = ['http://localhost:3000',
                      'http://localhost:3002'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
  
app.get('/jobs', async (req, res) => {
let jobs = await getAsync('github');
let jobs_length = JSON.parse(jobs).length;
console.log(jobs_length);
res.status(200).send(jobs);
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))