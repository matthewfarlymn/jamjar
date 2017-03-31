var db=require('../dbconnection');

var RecentProduct={

  getRecentProducts:function(callback){
    return db.query("SELECT * FROM product ORDER BY id DESC",callback);
  }
};

var Product={

  getAllProducts:function(callback){
    return db.query("SELECT * FROM product",callback);
  },
  // getRecentProducts:function(callback){
  //   return db.query("SELECT * FROM product ORDER BY id DESC",callback);
  // },
  getProductById:function(id,callback){
    return db.query("SELECT * FROM product WHERE customerId=?",[id],callback);
  },
  addProduct:function(Product,callback){
    var id = -1;
    var title = req.body.title;
    var desc = req.body.desc;
    var size = req.body.size;
    var color = req.body.color;
    var stock = req.body.stock;
    var price = req.body.price;
    var saleprice = req.body.saleprice;
    var image1 = req.body.image1;
    var image2 = req.body.image2;
    var image3 = req.body.image3;
    var image4 = req.body.image4;
    var image5 = req.body.image5;
    var status = 1;

    var record = [title, desc, size, color, stock, price, saleprice, image1, image2, image3, image4, image5, active];

    // return db.query("INSERT INTO product values(?,?,?)",[customer.id,customer.customerFirstName,Task.Status],callback);
    return db.query('INSERT INTO product (productTitle, productDesc, productSize, productColor, productStock, productPrice, productSalePrice, productImage1, productImage2, productImage3, productImage4, productImage5, productStatus) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', record, callback);
  },
  deleteCustomer:function(id,callback){
    return db.query("DELETE FROM product WHERE customerId=?",[id],callback);
  },
  updateCustomer:function(id,Product,callback){
    return db.query("UPDATE product SET Title=?,Status=? WHERE customerId=?",[Task.Title,Task.Status,id],callback);
  }

};
module.exports=Product;
