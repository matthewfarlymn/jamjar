var mysql=require('mysql');

var connection = mysql.createPool({

   host : 'localhost',
   user : 'root',
   password : 'root',
   database : 'jamjar',
   charset : 'utf8',
   port : 3306,
   socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'

 });
 
 module.exports=connection;
