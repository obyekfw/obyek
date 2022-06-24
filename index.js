
const route = require("./lib/route.js")
const {defaultLogger,defaultResponse} = require("./lib/default.js")
const path = require("path")
const cors = require("cors")
function config({
  logDirName="log",
  errorMiddleware=(err,req,res,next)=>{
    res.status(500)
    res.json({status:"error",message:"internal server error",
    error:{detail:err.stack}})
  },
  notFoundMiddleware=(req,res)=>{
    defaultResponse(req,res)
  }
}){
  global.__obyek__.config.logDirName=path
    .join(path.parse(module.parent.filename).dir, logDirName)
  global.__obyek__.config.errorMiddleware=errorMiddleware
  global.__obyek__.config.notFoundMiddleware=notFoundMiddleware
  
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
    .join(path.parse(module.parent.filename).dir, "log"),
  errorMiddleware:(err,req,res,next)=>{
    res.status(500)
    res.json({message:"internal server error",
    error:{detail:err.stack}})
  },
  notFoundMiddleware:(req,res)=>{
    defaultResponse(req,res)
  }
}
  })
}


const exp={
  route,cors,config,logger:defaultLogger()
}

module.exports=exp
