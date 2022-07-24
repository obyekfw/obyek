"use strict";

const {route,testRequest} = require("../index.js")


class Query extends route("/query"){
get(req,res){
    res.json(req.query)
  }
}

class App extends route("/"){
  constructor(){
    super()
    
    this.childRoute(new Query())
  }
  
}

test("query",async ()=>{
  let response = await testRequest(new App())
  .get("/query")
  .query({
    foo:"bar"
  });
   expect(response.body).toEqual({
     foo:"bar"
   })
  
})
