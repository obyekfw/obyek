"use strict";
const http = require("http")

function request({hostname="localhost",port,path="/",method="GET",headers={},body=""}){

  return new Promise((resolve,reject)=>{
    const req = http.request({
      hostname,port,path,method,headers
    },(res)=>{
      let body=""
      res.on("error",()=>{
        reject("response error")
      })
      res.on("data",(c)=>{
        body+=c
      })
      res.on("end",(c)=>{
        if(c)body+=c;
        resolve({
          status:res.statusCode,
          body,
          headers:res.headers
        })
      })
    })
    req.on("error",(e="request error")=>{
      reject(e)
    })
    req.write(body)
    req.end()
    
  })
  
}

async function listen(app, initalPort) {
  try {
    app.listen(initalPort)
   
    return initalPort
  } catch (e) {
    initalPort++
    return listen(app, initalPort)
  }
}


module.exports = {listen,request}
