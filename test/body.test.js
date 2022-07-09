"use strict";

const {request,listen}= require("./test-util.js")
const {route} = require("../index.js")


class Body extends route("/body"){
  post(){
    this.json(this.body)
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
  let app = new App()
  try{
  let port= await listen(app,3001)
  let response = await request({
    method:"POST",
    path:"/body",
    port,
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(body)
  })
  expect(JSON.parse(response.body).foo).toBe(body.foo)
  }catch(e){
    throw e
  }finally{
    app.stopServer()
  }
})
