var db=require('../dbconnection');

var User={

  getAllUsers:function(callback){
    return db.query("SELECT * FROM user",callback);
  },
  getUserById:function(id,callback){
    return db.query("SELECT * FROM user WHERE userId=?",[id],callback);
  },
  addUser:function(firstname, lastname, password, callback){
    // var id = -1;
    // var firstname = req.body.firstname;
    // var lastname = req.body.lastname;
    // var password = req.body.password;
    // var confirm = req.body.confirm;
    // var record = [name, password];

    // return db.query("INSERT INTO user (userFirstName=?, userLastName=?, userPassword=?)",[firstname, lastname, password],callback);
    return db.query("INSERT INTO user (userFirstName, userLastName, userPassword) VALUES(?,?,?)",[firstname, lastname, password],callback);
  },
  deleteUser:function(id,callback){
    return db.query("DELETE FROM user WHERE userId=?",[id],callback);
  },
  updateUser:function(id,User,callback){
    return db.query("UPDATE user SET userFirstName=?, userLastName=?, userPassword=? WHERE userId=?",[user.firstname,user.lastname,user.password,id],callback);
  }

};
module.exports=User;
