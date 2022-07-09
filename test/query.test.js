"use strict";

const {request,listen}= require("./test-util.js")
const {route} = require("../index.js")


class Query extends route("/query"){
get(){
    this.json(this.query)
  }
}

class App extends route("/"){
  constructor(){
    super()
    
    this.childRoute(new Query())
  }
  
}

test("query",async ()=>{
  let app = new App()
  
  try{
    let port = await listen(app,3002)
    let response = await request({
      path:"/query?foo=bar",
      port
    })
   // console.info(response.body)
    expect(JSON.parse(response.body).foo).toBe("bar")
  }catch(e){
    throw e
  }finally{
    app.stopServer()
  }
})
