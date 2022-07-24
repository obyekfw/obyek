

```javascript

const {route}=require("obyek")
class App extends route("/"){
  constructor(){
    super()
    this.listen(3000)
  }
  get(req,res){
    res.send("Hello world")
  }
}
new App()
```


this is a rather opinionated framework. but maybe it can't be called opinionated nor can it be called unopinionated. that's because some libraries for doing things that are usually installed separately are available by default. using the OOP paradigm to make grouping easier and more


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
  get(req,res){
    res.send("Hello world")
  }
}
new App()
```

</details>




<details><summary>add child route</summary>

```javascript
const {route}=require("obyek")

class Foo extends route("/foo"){
  get(req,res){
    res.send("Foo")
  }
}

class Bar extends route("/bar") {
  get(req,res) {
    res.send("Bar")
  }
}
class App extends route("/") {
  constructor() {
    super()
    this.childRoute(new Foo())
    .childRoute(new Bar())
    .listen(3000)
  }
  get(req,res) {
    res.send("Hello world")
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
  get(req,res) {
    res.send("Hello world")
  }
  post(req,res){
    res.json(req.body)
  }
}
new App()
```

</details>



<details><summary>logger</summary>

```javascript
const {logger}=require("obyek")
//winston
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
        console.error(err)
        res.status(500)
        res.json({status:"error",message:"internal server error",
        error:{detail:err.stack}})
  }
})

class App extends route("/"){
  get(){
    throw new Error("error")
  }


  //config method is called after listen method
  config(cnfg){
        //default
        //set to false to disable middleware
        cnfg.json={}
        cnfg.cors = false //{}
        cnfg.helmet=false //{}
        cnfg.compression=false //{}
        cnfg.urlencoded={
          extended:false
        }
        cnfg.cookieParser=[] //[secret,options]
        cnfg.static = false //[root,options]
        
   }
}

new App().listen(3000)
```

</details>


<details>
  <summary>unit test</summary>
  
  
  ```javascript
  const {route,testRequest} = require("obyek")
  
  class App extends route("/"){
    get(req,res){
      res.send("testing")
    }
  }
  
  //i assume you are using jest
  test("example test",async ()=>{
    expect((
    await testRequest(new App())
    .get("/")
    ).text).toBe("testing")
  })
  
  ```
  
  
</details>
___
### Contributing

The obyek project welcomes all constructive contributions. Contributions take many forms, from code for bug fixes and enhancements, to additions and fixes to documentation, additional tests, triaging incoming pull requests and issues
