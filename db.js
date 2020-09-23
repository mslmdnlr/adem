var sql = require("mssql");
  
 // config for your database
 var config = {
    user: '',
    password: '',
    server: '',
    port:,
    database: '' ,
    "options": {
        "encrypt": true,
        "enableArithAbort": true
        }
 };
 
 function executequery(query, callback) 
 {   
     sql.connect(config, function (err) {
     
         if (err) console.log(err);
         // create Request object
         var request = new sql.Request();
                    
        // query to the database and get the records
        request.query(query, function (err, recordset) {
         if (err) console.log(err)
         return callback(recordset.recordset);
         });
     });
 }
 
 module.exports = {
     executequery
 }
