var db=require('../dbconnection');

console.log("in User -- ");

var User={

  getAllUsers:function(callback){

    db(function(err, connection) {
      if(err) {
        console.log('error');
        throw err;
      } else {
        return connection.query("SELECT * FROM user",callback);
      }
    });
  },
  getUserById:function(id,callback){

    db(function(err, connection) {
      if(err) {
        console.log('error');
        throw err;
      } else {
        return connection.query("SELECT * FROM user WHERE userId=?",[id],callback);
      }
    });
  },
  addUser:function(User,callback){

    // User.userId = 5;
    // User.userFirstName = 'First5';
    // User.userLastName = 'Last5';
    // User.userPassword = 'password';

    console.log("inside service");
    // console.log(User.userId);
    console.log(User.userFirstName);
    console.log(User.userLastName);
    console.log(User.userEmail);
    console.log(User.userPassword);

    db(function(err, connection) {
      if(err) {
        console.log('error');
        throw err;
      } else {
        return connection.query("INSERT INTO user (userFirstName, userLastName, userEmail, userPassword) VALUES (?,?,?,?)",[User.userFirstName,User.userLastName,User.userEamil,User.userPassword],callback);
      }
    });

  },
  deleteUser:function(id,callback){

    db(function(err, connection) {
      if(err) {
        console.log('error');
        throw err;
      } else {
        return connection.query("DELETE FROM user WHERE userId=?",[id],callback);
      }
    });
  },
  updateUser:function(id,User,callback){
    db(function(err, connection) {
      if(err) {
        console.log('error');
        throw err;
      } else {
      return connection.query("UPDATE user SET userFirstName=?, userLastName=?, userPassword=? WHERE userId=?",[User.userFirstName,User.userLastName,User.userPassword,id],callback);
      }
    });
  }

};
module.exports=User;
