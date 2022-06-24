
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
    this.dirName=global.__obyek__.config.logDirName
    if(!fs.existsSync(this.dirName)){
      fs.mkdirSync(this.dirName)
    }
      this.createLogFile()
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
const defaultApp=()=>{
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({extended:false}))
  
  return app
}

//make a express router
const router=()=>{
  return express.Router()
}

//make a default response
function defaultResponse(req, res) {
  res.status(404)
  res.json({
    status:"error",
    message:"not found",
    error:{
      detail:`cannot ${req.method} ${req.url}`
    }
  })
}


module.exports = {
  defaultApp,
  router,
  defaultResponse,
  defaultLogger,
  winston
  
}
