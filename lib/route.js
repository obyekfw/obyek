"use strict";
const {defaultApp,defaultResponse}=require("./default.js")
const express = require("express")
let compression;
let helmet;
let cors;
let cookieParser;
function rewriteWarning(className,prop){
  console.warn(`WARNING: you can't rewrite ${className}.${prop}`)
}

function defineRouteMethods(route, app) {
  
  function listen(...args){
    const _app = route.route.wrap()
    try {
      let serv = _app.listen(...args)
      function stopServer(){
        return serv.close(...arguments)
      }
      
      Object.defineProperty(route, "stopServer", {
        get: function() {
          return stopServer
        },
        set: function() {
          rewriteWarning(route.constructor.name, "stopServer")
        },
        enumerable:true
      })
      return serv
    } catch (e) {
      throw new e.constructor(e.message)
    }
  }
  


  if(route.listen!==undefined){
    rewriteWarning(route.constructor.name,"listen")
  }

  Object.defineProperty(route, "listen", {
    get: function() {
      return listen
    },
    set: function() {
      rewriteWarning(route.constructor.name, "listen")
    },
    enumerable:true
  })
  
  
  let afterCallFinalHandler=false
  
  function _route(){
    if (afterCallFinalHandler) {
      return app
    } else {
      afterCallFinalHandler = true
    }
    
    app.all("/", async (req, res, next) => {
  
      if (typeof route[req.method.toLowerCase()] == "function") {
        route[req.method.toLowerCase()](req,res,next)
      } else {
        defaultResponse(req, res)
      }
    
    })
    return app
  }
  
  Object.defineProperty(_route,"wrap",{
    value:function() {
      const _app = express()
      for (let k in app.locals.settings) {
        _app.set(k, app.locals.settings[k])
      }
      const cnfg = {
        json: {},
        compression: false,
        cors: false,
        helmet: false,
        urlencoded: {
          extended: false
        },
        cookieParser: []
      }
      cnfg.static = false
      route.config(cnfg)
    
      if (cnfg.cookieParser != false) {
        if (!cookieParser) {
          cookieParser = require("cookie-parser")
        }
        _app.use(cookieParser(...cnfg.cookieParser))
      }
    
      if (cnfg.static != false) {
        _app.use(express.static(...cnfg.static))
      }
    
      if (cnfg.json != false) {
        _app.use(express.json(cnfg.json))
      }
    
      if (cnfg.urlencoded != false) {
        _app.use(express.urlencoded(cnfg.urlencoded))
      }
      if (cnfg.cors != false) {
        if (!cors) {
          cors = require("cors")
        }
        _app.use(cors(cnfg.cors))
      }
      if (cnfg.helmet != false) {
        if (!helmet) {
          helmet = require("helmet")
        }
        _app.use(helmet(cnfg.helmet))
      }
      if (cnfg.compression != false) {
        if (!compression) {
          compression = require("compression")
        }
        _app.use(compression(cnfg.compression))
      }
    
    
      _app.use(route.route())
      _app.use(
        global.__obyek__.config.notFoundMiddleware
      )
      _app.use(
        global.__obyek__.config.errorMiddleware
      )
      return _app
    }
  })
  
  if (route.route !== undefined) {
    rewriteWarning(route.constructor.name, "route")
  }
  
  Object.defineProperty(route, "route", {
    get:function(){
      return _route
    },
    set: function() {
      rewriteWarning(route.constructor.name, "route")
    },
    enumerable:true
  })
  

    if(route.app!==undefined){
      rewriteWarning(route.constructor.name,"app")
    }
    
    Object.defineProperty(route,"app", {
      get: function() {
        return app
      },
      set:function(){
        rewriteWarning(route.constructor.name,"app")
      },
      enumerable:true
    })
  
 
  if (route.childRoute !== undefined) {
    rewriteWarning(route.constructor.name, "childRoute")
  }
  
  function addChildRoute(childRoute){
          if (!afterCallFinalHandler) {
            route.route()
          }
          const child = childRoute.route()
          const defaultSetting = express().locals.settings;
          for (let k in app.locals.settings) {
            if(defaultSetting.hasOwnProperty(k)){
              if(typeof defaultSetting[k]!="function"
               && defaultSetting[k]!==child.locals.settings[k]){
                continue;
              }
              if(typeof defaultSetting[k]=="function"
              && typeof child.locals.settings[k]=="function"
              &&defaultSetting[k].toString()!==child.locals.settings[k].toString()){
                continue;
              }
            }
            child.set(k, app.locals.settings[k])
          }
    
          app.use(async (req, res, next) => {
            child(req, res, next)
          })
    
          return route
  }
  
  
  Object.defineProperty(route, "childRoute", {
    get: function() {
     return addChildRoute
    },
    set(){
      rewriteWarning(route.constructor.name, "childRoute")
    },
    enumerable:true
  })
}


function rute(path="/") {

  
  class Route {
    constructor() {
        
      const app = express()
  
    
      defaultApp(app,path)
      defineRouteMethods(this, app)


    }
   
  async get(req,res,next) {
      next()
    }

  async post(req,res,next) {
      next()
    }

   async put(req,res,next) {
      next()
    }

   async patch(req,res,next) {
      next()
    }

   async delete(req,res,next) {
     next()
    }
    
    config(cnfg){
      /*
      cnfg.json={}
      cnfg.cors = false
      cnfg.helmet=false
      cnfg.compression=false
      cnfg.urlencoded={
        extended:false
      }
      cnfg.cookieParser= []
      cnfg.static= false
      */
    }
  }


  return Route
}
function route(path){
  return rute(path)
}
module.exports=route
