let express = require("express");
let app = express();
const cors = require("cors");
app.use(express.json());
// app.use(cors)
app.options("*", cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow_Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept "
  );
  next();
});

const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { Client } = require("pg");
const connData = new Client({
  user: "postgres",
  password: "S9301122206y$",
  database: "postgres",
  port: 5432,
  host: "db.lcwgpxauwwaxrgohmzfs.supabase.co",
  ssl: { rejectUnauthorized: false },
});
connData.connect(function (res, error) {
  console.log(`Connected!!!`);
});

app.get("/shops", function (req, res, next) {
    console.log("Inside /shops get api");
    const query = "SELECT shopid, name FROM shops";
  
    connData.query(query, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

  app.post("/shops", function (req, res, next) {
    console.log("Inside post of shops");
    var values = Object.values(req.body);
    console.log(values);
    let sql = `insert into shops(name,rent) values($1,$2)`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} insection successful`);
    });
  });

  app.get("/products", function (req, res, next) {
    console.log("Inside /products get api");
    const query = "SELECT * from products";
    
    connData.query(query, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

  app.post("/products", function (req, res, next) {
    console.log("Inside post of products");
    var values = Object.values(req.body);
    console.log(values);
    let sql = `insert into products(productname,category,description) values($1,$2,$3)`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} insection successful`);
    });
  });

  app.put("/products/:id", function (req, res, next) {
    console.log("Inside put of products");
    let id = +req.params.id;
    let productname = req.body.productname;
    let category = req.body.category;
    let description = req.body.description;
    let values = [category,description,id];
    let sql = `update products set category=$1,description=$2 where productid=$3`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} updation successful`);
    });
  });

  app.get("/products/:id", function (req, res, next) {
    console.log("Inside /products/:id get api");
    let id = +req.params.id;
    let values = [id];
    let sql = `SELECT * from products where productid=$1`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

  app.get("/purchases", function (req, res, next) {
    console.log("Inside /purchases get api");
    const query = "SELECT * from purchases";
    let sort = req.query.sort;
    let shop = req.query.shop;
    let product = req.query.product;
    
    connData.query(query, function (err, result) {
      if (err) res.status(404).send(err);
      else {
        result.rows = filterParam(result.rows, "productid", product);
        result.rows = filterParam(result.rows, "shopid", shop);
        if(sort==="QtyAsc") result.rows.sort((st1,st2) => st1.quantity-st2.quantity);
        if(sort==="QtyDesc") result.rows.sort((st1,st2) => st2.quantity-st1.quantity);
        if(sort==="ValueAsc") result.rows.sort((st1,st2) => (st1.price*st1.quantity)-(st2.price*st2.quantity));
        if(sort==="ValueDesc") result.rows.sort((st1,st2) => (st2.price*st2.quantity)-(st1.price*st1.quantity));
        res.send(result.rows)
      };
    });
  });

  let filterParam = (arr, name, values) => {
    if (!values) return arr;
    let valuesArr = values.split(",");
    let arr1 = arr.filter((a1) => valuesArr.find((val) => +(val) === a1[name]));
    return arr1;
  };

  app.get("/purchases/shops/:id", function (req, res, next) {
    console.log("Inside /purchases/shops/:id get api");
    let id = +req.params.id;
    let values = [id];
    let sql = `SELECT * from purchases where shopid=$1`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

  app.get("/purchases/products/:id", function (req, res, next) {
    console.log("Inside /purchases/products/:id get api");
    let id = +req.params.id;
    let values = [id];
    let sql = `SELECT * from purchases where productid=$1`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

  app.post("/purchases", function (req, res, next) {
    console.log("Inside post of purchases");
    var values = Object.values(req.body);
    console.log(values);
    let sql = `insert into purchases(shopid,productid,quantity,price) values($1,$2,$3,$4)`;
    connData.query(sql, values, function (err, result) {
      console.log(result);
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} insection successful`);
    });
  });

  app.get("/totalPurchases/shop/:id", function (req, res, next) {
    console.log("Inside /totalPurchases/shop/:id get api");
    let id = +req.params.id;
    let values = [id];
    let sql = `SELECT * from purchases where productid=$1`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

