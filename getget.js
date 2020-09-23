var axios = require('axios');
var data = JSON.stringify("iiskonf");
const https = require('https');
var q = require('./db');
const express=require('express');
const app = express()
const port = 3000


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const agent = new https.Agent({  
    rejectUnauthorized: false
  });

app.get('/data',(req,res) => {



q.executequery("select token from ucmdbtoken", function(rows) {
    var ucmdbtoken= rows[0].token;

    //console.log (ucmdbtoken)

    var config = {
        method: 'post',
        url: 'rest api ucmdb ip si',
        headers: { 
          'Authorization': 'Bearer ' + ucmdbtoken, 
          'Content-Type': 'application/json'
        },
        httpsAgent: agent,
        data : data
      };

      axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));

        let data=response.data;
        res.send(data)
       // console.log(data.cis.length)

        q.executequery("TRUNCATE TABLE ucmdbiiskonfcis" , function(rows) {

           
            for(let i=0;i<data.cis.length;i++){
           // console.log("INSERT INTO ucmdbiiskonfcis (ucmdbid, name , label) VALUES ('" + data.cis[i].ucmdbId +"','"+ data.cis[i].properties.name + "','" + data.cis[i].label + "')" )
            q.executequery("INSERT INTO ucmdbiiskonfcis (ucmdbid, name , label) VALUES ('" + data.cis[i].ucmdbId +"','"+ data.cis[i].properties.name + "','" + data.cis[i].label + "')"  , function(rows) {
            })
        }


        })

        q.executequery("TRUNCATE TABLE ucmdbiiskonfrel" , function(rows) {

            for(let i=0;i<data.relations.length;i++){

                ///console.log("INSERT INTO ucmdbiiskonfrel (relid, end1id,end2id) VALUES ('" + data.relations[i].ucmdbId +"','"+ data.relations[i].end1Id + "','" + data.relations[i].end2Id + "')")
                q.executequery("INSERT INTO ucmdbiiskonfrel (relid, end1id,end2id) VALUES ('" + data.relations[i].ucmdbId +"','"+ data.relations[i].end1Id + "','" + data.relations[i].end2Id + "')" , function(rows) {
                })
        
            }


        })

  




      })
      .catch(function (error) {
        console.log(error);
      });

})


});



})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
