 Note: this framework is experimental
___
# Documentation
obyek is a framework that wraps expressjs and adds an OOP paradigm for route writing.
obyek by default adds frequently used express middleware such as express.json, express.urlencoded.

___
### basic usage

```javascript


const {createRoute}=require("obyek")

class User extends createRoute("/:name"){
  constructor(){
    /*
        this is optional if you want to test a route
        separately use this.
        
        */
    super()
    this.listen(8000)
  }
  get(){
    this.send(`Hello ${this.req.params.name}`)
  }
}

class Root extends createRoute("/"){
  constructor(){
    super()
    this.childRoute(new User())
    .listen(3000)
  }
  get(){
    this.send("Hello World")
  }
  
}

new Root()


```

make a http request to 
```
http://localhost:3000/john
```
and 
```
http://localhost:8000/john
```
see both have the same result

```
Hello john
```
