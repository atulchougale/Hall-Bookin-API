const express = require("express");
const cors = require("cors");  
const bodyParser = require("body-parser"); 
const hallRouter = require('./routers');


const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Homepage : Hall Bookiing API');
  });
  
  app.use("/hall", hallRouter);
  
  app.listen(PORT, console.log("Server running on port " + PORT));