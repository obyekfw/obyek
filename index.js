"use strict";

const route = require("./lib/route.js")
const {defaultLogger,
       defaultResponse,
       winston,
       defaultErrorHandler
} = require("./lib/default.js")
const path = require("path")

/**
 * for cors and helmet utils will be added soon
 */
const cors = require("cors")
const helmet = require("helmet")
const type = require("./lib/type.js")

//config function for override default config
function config({
  logDirName="log",
  errorMiddleware=defaultErrorHandler,
  notFoundMiddleware=defaultResponse
}){
  global.
  __obyek__
  .config
  .logDirName=path.join(process.cwd(), logDirName)
  
  global.__obyek__
  .config.errorMiddleware=errorMiddleware
  
  global.__obyek__
  .config.notFoundMiddleware=notFoundMiddleware
  
}


//define global config
if(!global.__obyek__){
  Object.defineProperty(global,"__obyek__",{
    value:{}
  })
}
if(!global.__obyek__.config){
  Object.defineProperty(global.__obyek__,"config",{
    value:{
  logDirName:path
    .join(process.cwd(), "log"),
  errorMiddleware:defaultErrorHandler,
  notFoundMiddleware:defaultResponse
 }
})
}


const obyek={
  winston,helmet,type,
  route,cors,config,logger:defaultLogger()
}

module.exports=obyek
