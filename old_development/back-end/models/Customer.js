  var db=require('../dbconnection');

  var Customer={

    getAllCustomers:function(callback){
      return db.query("SELECT * FROM customer",callback);
    },
    getCustomerById:function(id,callback){
      return db.query("SELECT * FROM customer WHERE customerId=?",[id],callback);
    },
    addCustomer:function(Customer,callback){
      var id = -1;
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var street1 = req.body.street1;
      var street2 = req.body.street2;
      var city = req.body.city;
      var county = req.body.county;
      var postcode = req.body.postcode;
      var phone = req.body.phone;
      var email = req.body.email;
      var password = req.body.password;
      var confirm = req.body.confrimPassword;
      var avatar = req.body.avatar;
      var active = 1;

      var record = [firstname, lastname, street1, street2, city, county, postcode, phone, email, password, avatar, active];

      // return db.query("INSERT INTO customer values(?,?,?)",[customer.id,customer.customerFirstName,Task.Status],callback);
      return db.query('INSERT INTO customer (customerFirstName, customerLastName, customerStreet1, customerStreet2, customerCity, customerCounty, customerPostcode, customerPhone, customerEmail, customerPassword, customerAvatar, customerActive) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', record, callback);
    },
    deleteCustomer:function(id,callback){
      return db.query("DELETE FROM customer WHERE customerId=?",[id],callback);
    },
    updateCustomer:function(id,Customer,callback){
      return db.query("UPDATE customer SET Title=?,Status=? WHERE customerId=?",[Task.Title,Task.Status,id],callback);
    }

  };
  module.exports=Customer;
