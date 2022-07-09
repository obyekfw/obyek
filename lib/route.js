"use strict";
const {defaultApp,router,defaultResponse}=require("./default.js")
const express = require("express")
const compression = require("compression")
const helmet = require("helmet")
const cors = require("cors")
function rewriteWarning(className,prop){
  console.warn(`WARNING: you can't rewrite ${className}.${prop}`)
}
//create unoverridable methods to route
function defineRouteMethods(route, obj) {
  
  function listen(...args){
    const app = express()
    for(let k in obj.app.locals.settings){
      app.set(k,obj.app.locals.settings[k])
    }
    const cnfg = {
      json:{},
      compression:false,
      cors:false,
      helmet:false,
      urlencoded:{
        extended:false
      }
    }
    route.config(cnfg)
    
    if(cnfg.json){
    app.use(express.json(cnfg.json))
    }
    
    if(cnfg.urlencoded){
      app.use(express.urlencoded(cnfg.urlencoded))
    }
    if(cnfg.cors){
      app.use(cors(cnfg.cors))
    }
    if (cnfg.helmet) {
      app.use(helmet(cnfg.helmet))
    }
    if (cnfg.compression) {
      app.use(compression(cnfg.compression))
    }
    
    
    
    app.use(route.route())
    app.use(
      global.__obyek__.config.notFoundMiddleware
    )
    app.use(
      global.__obyek__.config.errorMiddleware
    )
    
    try {
      let serv = app.listen(...args)
      function stopServer(){
        return serv.close(...arguments)
      }
      Object.defineProperty(route, "$stopServer", {
        get: function() {
          return stopServer
        },
        set:function(){
          rewriteWarning(route.constructor.name,"$stopServer")
          return
        },
        enumerable:true
      })
      
      Object.defineProperty(route, "stopServer", {
        get: function() {
          return stopServer
        },
        set: function() {
          rewriteWarning(route.constructor.name, "stopServer")
          return
        },
        enumerable:true
      })
      return serv
    } catch (e) {
      throw new e.constructor(e.message)
    }
  }

  if(route.__proto__.listen!==undefined){
    rewriteWarning(route.constructor.name,"listen")
  }
  if (route.__proto__.$listen !== undefined) {
    rewriteWarning(route.constructor.name, "$listen")
  }
  Object.defineProperty(route, "$listen", {
    get:function(){
      return listen
    },
    set:function(){
      rewriteWarning(route.constructor.name,"$listen")
      return
    },
    enumerable:true
  })
  Object.defineProperty(route, "listen", {
    get: function() {
      return listen
    },
    set: function() {
      rewriteWarning(route.constructor.name, "listen")
      return
    },
    enumerable:true
  })
  
  
  
  let afterCallFinalHandler=false
  //route method for add http handlers to app
  //and make handlers middleware position relative to firstly this method execute
  function _route(){
    if (afterCallFinalHandler) {
      return obj.app
    } else {
      afterCallFinalHandler = true
    }
    
    obj.app.all("/", async (req, res, next) => {
      obj.req = req
      obj.res = res
      obj.next = next
      if (typeof route[req.method.toLowerCase()] == "function") {
        route[req.method.toLowerCase()](req)
      } else {
        defaultResponse(req, res)
      }
    
    })
    return obj.app
  }
  
  
  Object.defineProperty(route,"$route",{
    get: function() {
      return _route
    },
    set:function(){
      rewriteWarning(route.constructor.name,"$route")
      return
    },
    enumerable:true
  })
  
  Object.defineProperty(route, "route", {
    get:function(){
      return _route
    },
    set: function() {
      rewriteWarning(route.constructor.name, "route")
      return
    },
    enumerable:true
  })
  
  
  
  
  let objProps=["req","res","app"]
  
  objProps.forEach((p)=>{
    if(route.__proto__[p]!==undefined){
      rewriteWarning(route.constructor.name,p)
    }
    if(route.__proto__["$"+p]!==undefined){
      rewriteWarning(route.constructor.name,"$"+p)
    }
    Object.defineProperty(route, "$"+p, {
      get: function() {
        return obj[p]
      },
      set:function(){
        rewriteWarning(route.constructor.name,"$"+p)
        return
      },
      enumerable:true
    })
    
    Object.defineProperty(route,p, {
      get: function() {
        return obj[p]
      },
      set:function(){
        rewriteWarning(route.constructor.name,p)
        return
      },
      enumerable:true
    })
  })
  
 
 
  if(route.__proto__.next!==undefined){
      rewriteWarning(route.constructor.name,"next")
  }
  if(route.__proto__.$next!==undefined){
    rewriteWarning(route.constructor.name,"$next")
  }
  
  Object.defineProperty(route, "$next", {
    value: (...args) => {
      obj.next(...args)
    },
    enumerable:true
  })
  Object.defineProperty(route, "next", {
    value: (...args) => {
      obj.next(...args)
    },
    enumerable:true
  })
  
  
  //sortcuts
  let requestProps =["cookies",
  "headers","params","body","query"]
  requestProps.forEach(p=>{
    if(route.__proto__[p]!==undefined){
      rewriteWarning(route.constructor.name,p)
    }
    if(route.__proto__["$"+p]!==undefined){
      rewriteWarning(route.constructor.name,"$"+p)
    }
    Object.defineProperty(route, p, {
      get: function() {
    
        return obj.req[p]
      },
      set: function(v) {
        if (obj.req === null || obj.req === undefined) {
            rewriteWarning(route.constructor.name,p)
          return
        }
        return obj.req[p] = v
      },
      enumerable:true
    })
    Object.defineProperty(route,"$"+p,{
      get:function(){
        
        return obj.req[p]
      },
      set:function(v){
        if(obj.req===null||obj.req===undefined){
          rewriteWarning(route.constructor.name,"$"+p)
          return
        }
        return obj.req[p]=v
      },
      enumerable:true
    })
  })
  
 let responsesMethods= ["send","sendFile","json","jsonp","render","cookie","redirect","download","write","end","status"
  ]
  responsesMethods.forEach(m=>{
    if (route.__proto__[m]!==undefined) {
      rewriteWarning(route.constructor.name,m)
    }
    if (route.__proto__["$" + m]!==undefined) {
      rewriteWarning(route.constructor.name,"$"+m)
    }
    
    Object.defineProperty(route,m, {
      value: function(...args) {
    
        try {
          obj.res[m](...args)
          return route
        } catch (e) {
          throw new e.constructor(e.message)
        }
      },
      enumerable:true
    })
    
    Object.defineProperty(route, "$"+m, {
      value: function(...args) {
        
        try{
        obj.res[m](...args)
        return route
        }catch(e){
          throw new e.constructor(e.message)
        }
      },
      enumerable:true
    })
  })
  
  
  //add childRoute method to router
  //for add child route to current route
  
  if (route.__proto__.childRoute !== undefined) {
    rewriteWarning(route.constructor.name, "childRoute")
  }
  if (route.__proto__.$childRoute !== undefined) {
    rewriteWarning(route.constructor.name, "$childRoute")
  }
  
  
  Object.defineProperty(route, "$childRoute", {
    value: function(childRoute) {
      if(!afterCallFinalHandler){
        route.route()
      }
      const child=childRoute.route()
      obj.app.use(async (req,res,next)=>{
        child(req,res,next)
      })
      
      return route
    },
    enumerable:true
  })
  
  Object.defineProperty(route, "childRoute", {
    value: function(childRoute) {
      if (!afterCallFinalHandler) {
        route.route()
      }
      const child = childRoute.route()
      
       for(let k in obj.app.locals.settings){
         child.set(k,obj.app.locals.settings[k])
       }
      
      obj.app.use(async (req, res, next) => {
        child(req, res, next)
      })
  
      return route
    },
    enumerable:true
  })
}


function rute(path="/") {

  
  class Route {
    constructor() {
        
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

  
      Object.defineProperty(obj, "app", {
       get: function() {
         return app
       }
      })
      //make router method for this object
      defaultApp(app,path)
      defineRouteMethods(this, obj)


    }
    //make default response to all http method
  async get() {
      this.next()
    }

  async post() {
      this.next()
    }

   async put() {
      this.next()
    }

   async patch() {
      this.next()
    }

   async delete() {
     this.next()
    }
    
    config(cnfg){
      cnfg.json={}
      cnfg.cors = false
      cnfg.helmet=false
      cnfg.compression=false
      cnfg.urlencoded={
        extended:false
      }
      
    }
  }


  return Route
}
function route(path){
  return rute(path)
}
module.exports=route
