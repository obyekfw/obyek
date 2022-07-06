const {defaultApp,router,defaultResponse}=require("./default.js")
const express = require("express")

//create unoverridable methods to route
function defineRouteMethods(route, obj) {
  
  Object.defineProperty(route, "$listen", {
    value: (...args) => {
        
         const app = express()
         app.use(express.json())
         app.use(express.urlencoded({extended:false}))
         app.use(route.$route())
         app.use(
           global.__obyek__.config.notFoundMiddleware
         )
         app.use(
           global.__obyek__.config.errorMiddleware
           )
         
        try{
        let serv = app.listen(...args)
        Object.defineProperty(route,"$stopServer",{
          value:function(){
            return serv.close(...arguments)
          }
        })
        return serv
        }catch(e){
          throw new e.constructor(e.message)
        }
    }
  })
  
  
  
  let afterCallFinalHandler=false
  //route method for add http handlers to app
  //and make handlers middleware position relative to firstly this method execute
  Object.defineProperty(route,"$route",{
    value:function(){
       if(afterCallFinalHandler){
         return obj.app
       }else{
         afterCallFinalHandler=true
       }
    
        obj.app.all("/",async (req, res, next) => {
          obj.req = req
          obj.res = res
          obj.next = next
          if(typeof route[req.method.toLowerCase()]=="function"){
              route[req.method.toLowerCase()]()
          }else{
              defaultResponse(req, res)
          }
          
        })
        return obj.app
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
      return obj.app
    }
  })
  
  
  
  //create getter method to res
  Object.defineProperty(route, "$res", {
    get:function() {
      return obj.res
    }
  })
 
 
  //add next method to router
  Object.defineProperty(route, "$next", {
    value: (...args) => {
      obj.next(...args)
    }
  })

  
  
  //sortcuts
  let requestProps =["cookies",
  "headers","params","body","query"]
  requestProps.forEach(p=>{
    Object.defineProperty(route,"$"+p,{
      get:function(){
        return obj.req[p]
      },
      set:function(v){
        return obj.req[p]=v
      }
    })
  })
  
 let responsesMethods= ["send","sendFile","json","jsonp","render","cookie","redirect","download","write","end","status"
  ]
  responsesMethods.forEach(m=>{
    Object.defineProperty(route, "$"+m, {
      value: function(...args) {
        try{
        obj.res[m](...args)
        return route
        }catch(e){
          throw new e.constructor(e.message)
        }
      }
    })
  })
  
  
  //add childRoute method to router
  //for add child route to current route
  Object.defineProperty(route, "$childRoute", {
    value: function(childRoute) {
      if(!afterCallFinalHandler){
        route.$route()
      }
      const child=childRoute.$route()
      obj.app.use(async (req,res,next)=>{
        child(req,res,next)
      })
      
      return route
    }
  })
}


function rute(path="/") {
  
  const app = express()
  
  //create variables for store request object
  //and response object and next function
  let req;
  let res;
  let next;
  
  //make req,res,next,app,path
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
  
  class Route {
    constructor() {
      //make router method for this object
      defaultApp(app,path)
      defineRouteMethods(this, obj)


    }
    //make default response to all http method
  async get() {
      this.$next()
    }

  async post() {
      this.$next()
    }

   async put() {
      this.$next()
    }

   async patch() {
      this.$next()
    }

   async delete() {
     this.$next()
    }
  }


  return Route
}
function route(path){
  return rute(path)
}
module.exports=route
