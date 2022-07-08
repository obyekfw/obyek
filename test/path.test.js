"use strict";

const {route} = require("../index.js")

const {request,listen} = require("./test-util.js")



test("path params test",async ()=>{
  
  
  class ParamsEnum extends route("/:p(a|b)") {
    get() {
    
      this.send(this.$params.p)
    }
  }
  
  class OptionalParams extends route("/opt/:param?"){
    get(){
      this.send(this.$params.param)
    }
  }
  class Params extends route('/:param') {
    constructor(){
      super()
      
      this.childRoute(new ParamsEnum())
    }
    get() {
    
      this.send(this.$params.param||"null")
    }
  }
  
  class App extends route("/") {
    constructor() {
      super()
      this.childRoute(new OptionalParams())
      this.childRoute(new Params())
    
    }
  }
 let app = new App()
 const port = await listen(app,3000)
 try{
 expect((await request({path:"/",port})).status).toBe(404)
  expect((await request({path:"/arg",port})).body).toBe("arg")
  expect((await request({path:"/foo",port})).body).toBe("foo")
  expect((await request({path:"/arg/a",port})).body).toBe("a")
  expect((await request({path:"/arg/b",port})).body).toBe("b")
  expect((await request({path:"/arg/c",port})).status).toBe(404)
  expect((await request({path:"/opt/foo",port})).body).toBe("foo")
    expect((await request({path:"/opt/",port})).status).toBe(200)
 }catch(e){
   throw e
 }finally{
  app.stopServer()
 }
})

test("star pattern",async ()=>{
  class SingleStar extends route("*"){
    get(){
      this.send("single star")
    }
  }
  
  class EndStar extends route("/a*") {
    get() {
      this.send("end star")
    }
  }
  class MiddleStar extends route("/a*b") {
    get() {
      this.send("middle star")
    }
  }
  class App extends route(){
    constructor(){
      super()
      
      this.childRoute(new MiddleStar())
      this.childRoute(new EndStar())
      this.childRoute(new SingleStar())
    }
    
    
  }
  let app = new App()
 let port= await listen(app,3000)
 try{
   expect((await request({path:"/",port})).status).toBe(404)
   expect((await request({path:"/cc",port})).body).toBe("single star")
    expect((await request({path:"/aab",port})).body).toBe("middle star")
   expect((await request({path:"/aa",port})).body).toBe("end star")
   expect((await request({path:"/a",port})).body).toBe("end star")
 }catch(e){
   throw e
 }finally{
   app.stopServer()
 }
})
