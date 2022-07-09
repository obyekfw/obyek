because it is still in the development and refinement stage. don't use this for production

```javascript

const {route}=require("obyek")
class App extends route("/"){
  constructor(){
    super()
    this.listen(3000)
  }
  get(){
    this.send("Hello world")
  }
}
new App()
```
___
### features

<ul>
  <li>Scalable</li>
  <li>Express libraries compatible</li>
</ul>

___
### installation

```
npm i obyek
```
___
### usage

<details><summary>hello world</summary>

```javascript

const {route}=require("obyek")
class App extends route("/"){
  constructor(){
    super()
    this.listen(3000)
  }
  get(){
    this.send("Hello world")
  }
}
new App()
```

</details>


<details><summary>sortcuts</summary>

```javascript

const {route}=require("obyek")
class App extends route("/"){
  constructor(){
    super()
    this.$listen(3000)
  }
  get(){
    //this.$req -> request
    //this.$res -> response
    //this.req -> request
    //this.res -> response
    
    //this.$send -> response.send
    //this.$json -> response.json
    //this.$status -> response.status
    //this.$write -> response.write
    //this.$end -> response.end
    //this.$download -> response.download
    //this.$cookie -> response.cookie
    
    //this.send -> response.send
    //this.json -> response.json
    //this.status -> response.status
    //this.write -> response.write
    //this.end -> response.end
    //this.download -> response.download
    //this.cookie -> response.cookie
    
    //this.$headers -> request.headers
    //this.$body -> request.body
    //this.$params -> request.params
    //this.$query -> this.query
    
    //this.headers -> request.headers
    //this.body -> request.body
    //this.params -> request.params
    //this.query -> this.query
    this.json({message:"Hello"})
  }
}
new App()
```

</details>



<details><summary>add child route</summary>

```javascript
const {route}=require("obyek")

class Foo extends route("/foo"){
  get(){
    this.send("Foo")
  }
}

class Bar extends route("/bar") {
  get() {
    this.send("Bar")
  }
}
class App extends route("/") {
  constructor() {
    super()
    this.childRoute(new Foo())
    .childRoute(new Bar())
    .listen(3000)
  }
  get() {
    this.send("Hello world")
  }
}
new App()
```

</details>

<details><summary>add middleware</summary>

```javascript
const {route}=require("obyek")
class App extends route("/") {
  constructor() {
    super()
    
    
    //relative to current route path
    this.app.all("/",(req,res,next)=>{
      console.info("all")
      next()
    })
    
    
    this.app.post("/",(req,res,next)=>{
      console.info("post")
      next()
    })
    this.listen(3000)
    
  }
  get() {
    this.send("Hello world")
  }
  post(){
    this.json(this.$req.body)
  }
}
new App()
```

</details>

<details><summary>logger</summary>

```javascript
const {logger}=require("obyek")

logger.info("hello")
```

</details>


<details><summary>config</summary>

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

new App().listen(3000)
```

</details>

___
### Contributing

The obyek project welcomes all constructive contributions. Contributions take many forms, from code for bug fixes and enhancements, to additions and fixes to documentation, additional tests, triaging incoming pull requests and issues
