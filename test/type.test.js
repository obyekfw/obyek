"use strict";

const {type} = require("obyek")

test("primitive types",()=>{
let  l= type.strongType({
    prop1:{
      type:Number,
      value:1
    },
    prop2:{
      type:String
    },
    prop3:{
      type:Boolean,
    }
    
  })
  l.prop2="a string"
  l.prop3=false
  try{
    l.prop1="a string"
    
    throw new Error("failed to validate")
    
  }catch(e){
    expect(l.prop1).toBe(1)
    if(e.name!=="StrongTypeError"){
      throw e
    }
  }
  
  try {
    l.prop1 = {}
    
    throw new Error("failed to validate")
  
  } catch (e) {
    expect(l.prop1).toBe(1)
    if (e.name !== "StrongTypeError") {
      throw e
    }
  }
  
  try {
    l.prop1 = true
    
    throw new Error("failed to validate")
  
  } catch (e) {
    expect(l.prop1).toBe(1)
    if (e.name !== "StrongTypeError") {
      throw e
    }
  }
  
  try {
    l.prop2 = 1
    
    throw new Error("failed to validate")
  
  } catch (e) {
    expect(l.prop2).toBe("a string")
    if (e.name !== "StrongTypeError") {
      throw e
    }
  }
  
  try {
    l.prop2 = {}
  
    throw new Error("failed to validate")
  
  } catch (e) {
    expect(l.prop2).toBe("a string")
    if (e.name !== "StrongTypeError") {
      throw e
    }
  }
  
  try {
    l.prop2 = true
    
    throw new Error("failed to validate")
  
  } catch (e) {
    expect(l.prop2).toBe("a string")
    if (e.name !== "StrongTypeError") {
      throw e
    }
  }
  
  try {
    l.prop3 = "a string"
    
    throw new Error("failed to validate")
  
  } catch (e) {
    expect(l.prop3).toBe(false)
    if (e.name !== "StrongTypeError") {
      throw e
    }
  }
  
  try {
    l.prop3 = {}
    
    throw new Error("failed to validate")
  
  } catch (e) {
    expect(l.prop3).toBe(false)
    if (e.name !== "StrongTypeError") {
      throw e
    }
  }
  
  try {
    l.prop3 = 1
  
    throw new Error("failed to validate")
  
  } catch (e) {
     expect(l.prop3).toBe(false)
    if (e.name !== "StrongTypeError") {
      throw e
    }
  }
})

test("array types", () => {
 let _arrNum=[1,2,3]
 let arrNum=new type.ArrayNumber(0)
 arrNum.push(..._arrNum)
 try{
   arrNum[0]="a"
   arrNum[0]=function(){}
   arrNum[0]={}
   arrNum[0]=true
   
   throw new Error("failed to validate")
 }catch(e){
   expect(JSON.stringify(arrNum))
     .toBe(JSON.stringify(_arrNum))
   if(e.name!="StrongTypeError"){
     throw e
   }
 }
 
 let _arrStr = "Test".split("")
 let arrStr = new type.ArrayString(0)
 arrStr.push(..._arrStr)
 try {
   arrStr[0] = 1
   arrStr[0] = function() {}
   arrStr[0] = {}
   arrStr[0] = true
   
   throw new Error("failed to validate")
 } catch (e) {
   expect(JSON.stringify(arrStr))
     .toBe(JSON.stringify(_arrStr))
   if (e.name != "StrongTypeError") {
     throw e
   }
 }
})
