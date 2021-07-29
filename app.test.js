const request = require("supertest");

const app = require("./app");
let db = require("./fakeDb");

let popsicle;
let cheerios;

beforeEach(function() {
  popsicle = { "name": "popsicle", "price": 1.45 };
  cheerios = { "name": "cheerios", "price": 3.40 };
  
  db.items.push(popsicle);
  db.items.push(cheerios);
});

afterEach(function() {
  db.items = [];
});
// end

describe("GET /items", function() {
  it("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual({ items: [popsicle, cheerios] });
  });
  
  it("Responds with 404 if can't find route", async function() {
    const resp = await request(app).get(`/wrongroute`);

    expect(resp.statusCode).toEqual(404);
  });
});

describe("GET /items/:item", function() {
  it("Gets a specific item", async function() {
    const resp = await request(app).get(`/items/${popsicle.name}`);

    expect(resp.body).toEqual(popsicle);
  });
  
  it("Responds with 404 if can't find route", async function() {
    const resp = await request(app).get(`/items/pencil`);

    expect(resp.statusCode).toEqual(404);
  });
});

describe("POST /items", function() {
  it("Creates an item", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "candy",
        price: 2.45
      });

    expect(resp.body).toEqual({added: {name: "candy", price: 2.45}});
    expect(db.items.length).toEqual(3);
  });
  
  it("Responds with 400 if request data is missing inputs", async function() {
    const resp = await request(app)
    .post(`/items`)
    .send({
      price: 2.45
    });
    
    expect(resp.statusCode).toEqual(400);
    expect(db.items.length).toEqual(2);
  });
});

describe("PATCH /items/:name", function() {
  it("Updates an item", async function() {
    const resp = await request(app)
      .patch(`/items/${popsicle.name}`)
      .send({
        name: "candy",
        price: 2.45
      });
    
    expect(resp.body).toEqual({updated: {name: "candy", price: 2.45}});
    expect(db.items.length).toEqual(2);
  });
  
  it("Responds with 400 if request data is missing inputs", async function() {
    const resp = await request(app)
    .patch(`/items/${popsicle.name}`)
    .send({
      price: 2.45
    });
    
    expect(resp.statusCode).toEqual(400);
    expect(db.items[0].name).toEqual(popsicle.name);
    expect(db.items[1].name).toEqual(cheerios.name);
  });
});

describe("DELETE /items/:name", function() {
  it("Deletes an item", async function() {
    const resp = await request(app).delete(`/items/${popsicle.name}`);

    expect(resp.body).toEqual({message: "Deleted"});
    expect(db.items.length).toEqual(1);
  });
  
  it("Responds with 404 if item can't be found", async function() {
    const resp = await request(app).delete(`/items/wrongitem`);
    
    expect(resp.statusCode).toEqual(404);
    expect(db.items.length).toEqual(2);
  });
});