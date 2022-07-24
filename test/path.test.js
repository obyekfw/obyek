"use strict";

const {route,testRequest} = require("../index.js")





test("path params test",async ()=>{
  
  
  class ParamsEnum extends route("/:p(a|b)") {
    get(req,res) {
    
      res.send(req.params.param+req.params.p)
    }
  }
  
  class OptionalParams extends route("/opt/:param?"){
    get(req,res){
      res.send(req.params.param)
    }
  }
  class Params extends route('/:param') {
    constructor(){
      super()
      
      this.childRoute(new ParamsEnum())
    }
    get(req,res) {
    
      res.send(req.params.param)
    }
  }
  
  class App extends route("/") {
    constructor() {
      super()
      this.childRoute(new OptionalParams())
      .childRoute(new Params())
    
    }
  }
 let app = testRequest(new App())
 
 
 expect((await app.get("/")).status).toBe(404)
  expect((await app.get("/arg")).text).toBe("arg")
  expect((await app.get("/foo")).text).toBe("foo")
  expect((await app.get("/arg/a")).text).toBe("arga")
  expect((await app.get("/arg/b")).text).toBe("argb")
  expect((await app.get("/arg/c")).status).toBe(404)
  expect((await app.get("/opt/foo")).text).toBe("foo")
  expect((await app.get("/opt/")).status).toBe(200)
 
})

test("star pattern",async ()=>{
  class SingleStar extends route("*"){
    get(req,res){
      res.send("single star")
    }
  }
  
  class EndStar extends route("/a*") {
    get(req,res) {
      res.send("end star")
    }
  }
  class MiddleStar extends route("/a*b") {
    get(req,res) {
      res.send("middle star")
    }
  }
  class App extends route(){
    constructor(){
      super()
      
      this.childRoute(new MiddleStar())
      .childRoute(new EndStar())
      .childRoute(new SingleStar())
    }
    
    
  }
  let app = testRequest(new App())
 
   expect((await app.get("/")).status).toBe(404)
   expect((await app.get("/cc")).text).toBe("single star")
    expect((await app.get("/aab")).text).toBe("middle star")
   expect((await app.get("/aa")).text).toBe("end star")
   expect((await app.get("/a")).text).toBe("end star")
 
})
