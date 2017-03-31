var db=require('../dbconnection');

var User={

  getAllUsers:function(callback){
    return db.query("SELECT * FROM user",callback);
  },
  getUserById:function(id,callback){
    return db.query("SELECT * FROM user WHERE userId=?",[id],callback);
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
    // return db.query("INSERT INTO users values(?,?,?,?)",[User.userId,User.userFirstName,User.userLastName,User.userPassword],callback);
    // return db.query("INSERT INTO user (userId=?, userFirstName=?, userLastName=?, userPassword=?)",[User.userId,User.userFirstName,User.userLastName,User.userPassword],callback);
    // return db.query("INSERT INTO user (userId, userFirstName, userLastName, userPassword) VALUES (?,?,?,?)",[User.userId,User.userFirstName,User.userLastName,User.userPassword],callback);
    return db.query("INSERT INTO user (userFirstName, userLastName, userEmail, userPassword) VALUES (?,?,?,?)",[User.userFirstName,User.userLastName,User.userEamil,User.userPassword],callback);
  },
  deleteUser:function(id,callback){
    return db.query("DELETE FROM user WHERE userId=?",[id],callback);
  },
  updateUser:function(id,User,callback){
    return db.query("UPDATE user SET userFirstName=?, userLastName=?, userPassword=? WHERE userId=?",[User.userFirstName,User.userLastName,User.userPassword,id],callback);
  }

};
module.exports=User;
