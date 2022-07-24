"use strict";

const {route,testRequest} = require("../index.js")


class Body extends route("/body"){
  post(req,res){
    res.json(req.body)
  }
}

class App extends route("/"){
  constructor(){
    super()
    this.childRoute(new Body())
  }
}

test("json body",async ()=>{
  
  let body={
    foo:"bar"
  }
  
  let response = await testRequest(new App())
  .post("/body")
  .set("Content-Type","application/json")
  .send(body)
  
  expect(response.body).toEqual(body)
  
})
