const { json } = require("express");
const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

router.get("/", function (req, res, next) {
  return res.json(db);
});

router.post("/", function (req, res, next) {
  let name = req.body.name;
  let price = req.body.price;
  db.items.push({name, price})
  
  return res.json({"added": {name, price}})
});

router.get("/:name", function (req, res, next){
  let items = db.items;
  for (let item of items){
    if (item.name === req.params.name){
      return res.json(item)
    }
  }
})

router.patch("/:name", function (req, res, next){
  let items = db.items;
  let name = req.params.name;
  let price = req.body.price;
  for (let item of items){
    if (item.name === name){
      item.name = req.body.name;
      item.price = price;
      return res.json({"updated": item})
  }}
})

router.delete("/:name", function (req, res, next){
  let items = db.items;
  let name = req.params.name;

  for (let i = 0; i<items.length; i++){
    if (items[i].name === name){
      items.splice(i,1);
      return res.json({"message": "Deleted"})
    }
  }
})




module.exports = router;
