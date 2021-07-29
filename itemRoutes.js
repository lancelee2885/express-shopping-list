/** TODO: DOCSTRINGS */

const express = require("express");
const { BadRequestError, NotFoundError } = require("./expressErrors");

const db = require("./fakeDb");
const router = new express.Router();

router.get("/", function (req, res, next) {
  return res.json(db);
});

router.post("/", function (req, res, next) {
  let name = req.body.name;
  let price = req.body.price;
  if (!name || !price) throw new BadRequestError();
  
  // extract into new variable
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

  throw new NotFoundError();
})

router.patch("/:name", function (req, res, next){
  let items = db.items;
  let oldName = req.params.name;
  let newName = req.body.name;
  let newPrice = req.body.price;

  if (!newName || !newPrice) throw new BadRequestError();

  for (let item of items){
    if (item.name === oldName){
      item.name = newName;
      item.price = newPrice;
      return res.json({"updated": item})
  }}
  
  throw new NotFoundError();
})

router.delete("/:name", function (req, res, next){
  let items = db.items;
  let name = req.params.name;

  for (let i = 0; i<items.length; i++){
    if (items[i].name === name){
      items.splice(i,1); // Use array.filter()
      return res.json({"message": "Deleted"})
    }
  }

  throw new NotFoundError();
})


module.exports = router;
