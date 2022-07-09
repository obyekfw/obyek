"use strict";

const express = require("express")
const winston = require("winston")
const TransportStream = require("winston-transport")
const path = require("path")
const fs = require("fs")
const {EOL} = require("os")


//file transport for configurable logger
class FileTransport extends TransportStream{
  constructor(opt){
    super(opt)
    
  }
  log(info,next){
    if(global.__obyek__.config.logDirName!==this.dirName){
      this.file_applog.close()
      this.file_error.close()
      this.dirName = global.__obyek__.config.logDirName
      if (!fs.existsSync(this.dirName)) {
        fs.mkdirSync(this.dirName)
      }
      this.createLogFile()
    }
    let message = info[Symbol.for("message")]
    this.file_applog.write(message+EOL)
    if(info[Symbol.for("level")]==="error"){
      this.file_error.write(message+EOL)
    }
    next()
  }
  createLogFile(){
    this.file_applog = fs.createWriteStream(path.join(this.dirName, "app.log"), {
      flags: "a"
    })
    this.file_error = fs.createWriteStream(path.join(this.dirName, "error.log"), {
      flags: "a"
    })
  }
}

//make a default logger
const defaultLogger=()=>{
  
  const logger = winston.createLogger({
    format : winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => {
        
        return `${info.timestamp}: ${info.level.toUpperCase()}: ${info.message}`
      })
      ),
    transports:[
      new FileTransport({}),
      new winston.transports.Console({ 
        format:winston.format.combine(
            winston.format.printf(info=>{
              info.level = info.level.toUpperCase()
            }),
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(info=>{
              return `${info.timestamp}: ${info.level}: ${info.message}`
            })
          )
      })
      ]
  })
  return logger
}

//make a default express app
const defaultApp=(app,path)=>{
  app.use((req,res,next)=>{
     if(app.get("x-powered-by")){
       res.setHeader("X-Powered-By","obyek")
     }
     next()
  })
  if(path!="/"){
    app.all("/",async (req,res)=>{
      defaultResponse(req,res)
    })
  }
  app.use(async (req,res,next)=>{

    if(req._params){
      req.__paramsTemp={}
      let i=0;
      while(req._params[`${i}`]){
        req.__paramsTemp[`${i}`]=req._params[`${i}`]
        i++
      }
    }
    next()
  })
  app.use(path,async (req,res,next)=>{
    req._url=req.url
    if(req._params){
      req.params = {...req.params,...req._params}
    }else{
      req._params=req.params
      Object.defineProperty(req,"params",{
        get:function(){
          return req._params
        },
        set:function(params={}){
          if(Object.getOwnPropertyNames(params).length>0){
            req._params={...req._params,...params}
          }
          return req._params
        }
      })
    }
    next()
  })
  app.all("*",async (req,res,next)=>{
    for(let i=0; req._params[`${i}`]!=undefined; i++){
      delete req._params[`${i}`]
    }
    req.params = req.__paramsTemp
    delete req.__paramsTemp
    req.url = req._url
    next()
  })
  
}



//make a default response
async function defaultResponse(req, res) {
  res.status(404)
  res.json({
    status:"error",
    message:"not found",
    error:{
      detail:`cannot ${req.method} ${req.originalUrl}`
    }
  })
}

async function defaultErrorHandler(err,req,res,next){
  res.status(500)
  res.json({message:"internal server error",
            error:{detail:err.stack}})
}

module.exports = {
  defaultApp,
  defaultResponse,
  defaultLogger,
  winston,
  defaultErrorHandler
}
