const {defaultApp,router,defaultResponse}=require("./default.js")

//create a unwritable methods to route
function defineRouteMethods(route, obj) {
  //create listen method to add router http handler 
  //to app and listen app if port is defined
  //then return the router
  Object.defineProperty(route, "$listen", {
    value: (port, ...opt) => {
      if(obj.path=="/"){
        obj.app.use(obj.route2)
      }else{
        obj.route.use(obj.path,obj.route2)
      }
      obj.route.all(obj.path, (_req, _res, _next) => {
        obj.req = _req
        obj.res = _res
        obj.next = _next
        switch (_req.method) {
          case "GET":
          case "PUT":
          case "POST":
          case "PATCH":
          case "DELETE":
            route[_req.method.toLowerCase()]()
            break;
          default:
            defaultResponse(_req, _res)
        }
      })
      if (typeof port == "number") {
        obj.app.use(obj.path,obj.route)
        obj.app.use(global.__obyek__.config.errorMiddleware)
        obj.app.use(global.__obyek__.config.notFoundMiddleware)
        obj.app.listen(port,...opt)
      }
    return obj.route
    }
  })
  //create getter method to req
  Object.defineProperty(route, "$req", {
    get: function() {
      return obj.req
    }
  })
  //create getter method to app
  Object.defineProperty(route, "$app", {
    get: function() {
      return obj.route2
    }
  })
  //create getter method to res
  Object.defineProperty(route, "$res", {
    get:function() {
      return obj.res
    }
  })
 
 Object.defineProperty(route, "$download", {
   value: function(...arg) {
     
      obj.res.download(...args)
     return route
   }
 })
 
 Object.defineProperty(route, "$sendStatus", {
   value: function(...arg) {
 
     obj.res.sendStatus(...args)
     return route
   }
 })
 
 //create getter method for path
 Object.defineProperty(route, "$path", {
   get: function() {
     return obj.path
   }
 })
  //add next method to router
  Object.defineProperty(route, "$next", {
    value: (...args) => {
      obj.next(...args)
    }
  })
//add send method to router
  Object.defineProperty(route, "$send", {
    value: (...args) => {
      obj.res.send(...args)
      return route
    }
  })
  
  Object.defineProperty(route, "$sendFile", {
    value: (...args) => {
      obj.res.sendFile(...args)
      return route
    }
  })
  
  Object.defineProperty(route, "$jsonp", {
    value: (...args) => {
      obj.res.jsonp(...args)
      return route
    }
  })
  
//add json method to router
  Object.defineProperty(route, "$json", {
    value: (...args) => {
      obj.res.json(...args)
      return route
    }
  })

  Object.defineProperty(route,"$cookie",{
    value:function(...args){
      obj.res.cookie(...args)
      return route
    }
  })
  
  Object.defineProperty(route, "$cookies", {
    get: function() {
      return obj.req.cookies
    }
  })
  
  
  //add childRoute method to router
  //for add child route to current route
  Object.defineProperty(route, "$childRoute", {
    value: function(childRoute) {

      obj.route.use(obj.path,childRoute.$listen())
      return route
    }
  })
}


function rute(path="/") {
  //create default apo and router
  const app = defaultApp()
  const _route = router()
  const _route2 = router()
  //create variables for store request object
  //and response object and next function
  let req;
  let res;
  let next;
  
  //make req,res,next,app,_route,path
  //accessible to createRouterMethod function
  const obj = {}
  Object.defineProperty(obj, "res", {
    get: function() {
      return res
    },
    set: function(r) {
      res = r
    }
  })
  Object.defineProperty(obj, "req", {
    get: function() {
      return req
    },
    set: function(r) {
      req = r
    }
  })

  Object.defineProperty(obj, "next", {
    get: function() {
      return next
    },
    set: function(n) {
      next = n
    }
  })

  Object.defineProperty(obj, "path", {
    get: function() {
      return path
    }
  })
  
  Object.defineProperty(obj, "app", {
    get: function() {
      return app
    }
  })
  Object.defineProperty(obj, "route", {
    get: function() {
      return _route
    }
  })
  Object.defineProperty(obj, "route2", {
    get: function() {
      return _route2
    }
  })
  class Route {
    constructor() {
      //make router method for this object
      defineRouteMethods(this, obj)


    }
    //make response to all http method
    get() {
      this.$next()
    }

    post() {
      this.$next()
    }

    put() {
      this.$next()
    }

    patch() {
      this.$next()
    }

    delete() {
     this.$next()
    }
  }


  return Route
}
function route(path){
  return rute(path)
}
module.exports=route
