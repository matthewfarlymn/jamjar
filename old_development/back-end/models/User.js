var db=require('../dbconnection');

var User={

  getAllUsers:function(callback){
    return db.query("SELECT * FROM user",callback);
  },
  getUserById:function(id,callback){
    return db.query("SELECT * FROM user WHERE userId=?",[id],callback);
  },
  addCustomer:function(User,callback){
    // var id = -1;
    var name = req.body.username;
    var password = req.body.password;

    var record = [name, password];

    return db.query("INSERT INTO user values(?,?,?)",[user.id,user.name,user.password],callback);
  },
  deleteUser:function(id,callback){
    return db.query("DELETE FROM user WHERE userId=?",[id],callback);
  },
  updateUser:function(id,User,callback){
    return db.query("UPDATE user SET userName=?,userPassword=? WHERE userId=?",[user.name,user.password,id],callback);
  }

};
module.exports=User;
