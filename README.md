 Note: this project is experimental
___
# Documentation

### overview
obyek is a framework that wraps expressjs and adds an OOP paradigm for route writing.
___
### installation
```
npm i obyek
```
___
### usage

hello world
```javascript

const {route}=require("obyek")
class App extends route("/"){
  constructor(){
    super()
    this.$listen(3000)
  }
  get(){
    this.$send("Hello world")
  }
}
new App()
```
___
sending json
```javascript

const {route}=require("obyek")
class App extends route("/"){
  constructor(){
    super()
    this.$listen(3000)
  }
  get(){
    this.$json({message:"Hello"})
  }
}
new App()
```

___
add child route
```javascript
const {route}=require("obyek")

class Foo extends route("/foo"){
  get(){
    this.$send("Foo")
  }
}

class Bar extends route("/bar") {
  get() {
    this.$send("Bar")
  }
}
class App extends route("/") {
  constructor() {
    super()
    this.$childRoute(new Foo())
    .$childRoute(new Bar())
    .$listen(3000)
  }
  get() {
    this.$send("Hello world")
  }
}
new App()
```
___
add middleware

```javascript
const {route}=require("obyek")
class App extends route("/") {
  constructor() {
    super()
    
    //for all 
    this.$app.all(this.$path,(req,res,next)=>{
      console.info("all")
      next()
    })
    
    //for post
    this.$app.post(this.$path,(req,res,next)=>{
      console.info("post")
      next()
    })
    this.$listen(3000)
    
  }
  get() {
    this.$send("Hello world")
  }
  post(){
    this.$json(this.$req.body)
  }
}
new App()
```
___
logger

```javascript
const {route,logger}=require("obyek")
class App extends route("/"){
  constructor(){
    super()
    this.$listen(3000)
  }
  get(){
    logger.info("request")
    this.$send("Hello world")
  }
}
new App()
```

___
cors
```javascript
const {route,cors}=require("obyek")
class App extends route("/"){
  constructor(){
    super()
    this.$app.use(cors())
    this.$listen(3000)
  }
  get(){
    this.$send("Hello world")
  }
}
new App()
```
___
config

```javascript
const {route,config}=require("obyek")

//default
config({
  logDirName:"log",
  notFoundMiddleware:(req,res)=>{
  res.status(404)
    res.json({
      status:"error",
      message:"not found",
      error:{
        detail:`cannot ${req.method} ${req.url}`
      }
    })
  },
  errorMiddleware:(err,req,res,next)=>{
        res.status(500)
        res.json({status:"error",message:"internal server error",
        error:{detail:err.stack}})
  }
})

class App extends route("/"){
  get(){
    throw new Error("error")
  }
}

new App().$listen(3000)
```
