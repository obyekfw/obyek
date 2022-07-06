
const cluster = require("cluster")

if(cluster.isMaster){
 let reqs = 0
 let ilt=0.1
 const obyek = require("obyek")
 
 class C4 extends obyek.route("/a") {
   get() {
     let cilt=Date.now()-this.$req._startTimeInternal
     ilt=(ilt<cilt)?cilt:ilt
     reqs++
     this.$send(`${Date.now()}`)
   }
 }
 
 class C3 extends obyek.route("/a") {
   constructor() {
     super()
     this.$childRoute(new C4())
   }
 }
 
 class C2 extends obyek.route("/a") {
   constructor() {
     super()
     this.$childRoute(new C3())
   }
 }
 
 class C1 extends obyek.route("/a"){
   constructor(){
     super()
     this.$childRoute(new C2())
   }
 }
class App extends obyek.route("/"){
  constructor(){
    super()
    this.$app.use((req,res,next)=>{
      req._startTimeInternal=Date.now()
      next()
    })
    this.$childRoute(new C1())
    this.$listen(3000)
  }
  
}
new App()

setInterval(()=>{
  console.info(reqs,
  (process.memoryUsage().rss/1000000).toFixed(2)+"MB",
  ilt
  )
  reqs=0
  ilt=0.1
},8000)
for(let i=0; i<1; i++){
  cluster.fork()
}
}else{
  const {request}= require("./test-util.js");
  let errors =0
  setInterval(()=>{
    console.log(errors)
    errors=0
  },8000);
  
  
  (function bench(){
    
    request({
      method:"GET",
      path:"/a/a/a/a",
      port:3000
    }).then(()=>{}).catch(() => {
      errors++
    })
    
    request({
      method: "GET",
      path: "/a/a/a/a",
      port: 3000
    }).then(() => {}).catch(() => {
      errors++
    })
    
    request({
      method: "GET",
      path: "/a/a/a/a",
      port: 3000
    }).then(() => {}).catch(() => {
      errors++
    })
    
    
    request({
      method: "GET",
      path: "/a/a/a/a",
      port: 3000
    }).then(() => {}).catch(() => {
      errors++
    })
    
    request({
      method:"GET",
      path:"/a/a/a/a",
      port:3000
    }).then(()=>{}).catch(() => {
      errors++
    })
    
    request({
      method: "GET",
      path: "/a/a/a/a",
      port: 3000
    }).then(() => {}).catch(() => {
      errors++
    })
    
    request({
      method: "GET",
      path: "/a/a/a/a",
      port: 3000
    }).then(() => {}).catch(() => {
      errors++
    })
    
    
    request({
      method: "GET",
      path: "/a/a/a/a",
      port: 3000
    }).then(() => {}).catch(() => {
      errors++
    })
    
    
    
    request({
      method: "GET",
      path: "/a/a/a/a",
      port: 3000
    }).then(bench).catch(()=>{
      errors++
    })
  })()
}
