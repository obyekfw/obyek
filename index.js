"use strict";

const route = require("./lib/route.js")
const {defaultLogger,
       defaultResponse,
       winston,
       defaultErrorHandler
} = require("./lib/default.js")
const path = require("path")

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
  winston,
  route,
  config,
}
let testRequest;
let cors;
let type;
let helmet;
let compression;
let logger;
let express;
let cookieParser;
let dotenv;

Object.defineProperty(obyek, "dotenv", {
  get: function() {
    if (!dotenv) {
      dotenv = require("dotenv")
    }
    return dotenv
  },
  enumerable: true
})

Object.defineProperty(obyek, "cookieParser", {
  get: function() {
    if (!cookieParser) {
      cookieParser = require("cookie-parser")
    }
    return cookieParser
  },
  enumerable: true
})

Object.defineProperty(obyek, "express", {
  get: function() {
    if (!express) {
      express = require("express")
    }
    return express
  },
  enumerable: true
})

Object.defineProperty(obyek,"cors",{
  get:function(){
    if(!cors){
      cors = require("cors")
    }
      return cors
  },
  enumerable: true
})
Object.defineProperty(obyek, "testRequest", {
  get: function() {
    if(!testRequest){
     testRequest=require("./lib/test-request.js")
    }
    return testRequest
  },
  enumerable: true
})

Object.defineProperty(obyek, "helmet", {
  get: function() {
      if(!helmet){
        helmet = require("helmet")
      }
      return helmet
  },
  enumerable:true
})

Object.defineProperty(obyek, "type", {
  get: function() {
    if(!type){
      type=require("./lib/type.js")
    }
    return type
  },
  enumerable: true
})

Object.defineProperty(obyek, "compression", {
  get: function() {
    if (!compression) {
     compression = require("compression")
    }
    return compression
  },
  enumerable: true
})

Object.defineProperty(obyek, "logger", {
  get: function() {
    if (!logger) {
      logger = defaultLogger()
    }
    return logger
  },
  enumerable: true
})

module.exports=obyek
