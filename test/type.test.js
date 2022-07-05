"use strict";

const {type} = require("obyek")

test("primitive types",()=>{
  //scope
  const S= type.strongly()
  S.name="Rian"
  S.age = 18
  S.isMarried=false
  
  try{
    S.name=18
   }catch(e){}
   try{
    S.age="Rian"
   }catch(e){}
   try{
    S.isMarried="true"
   }catch(e){}
  expect(S.name).toBe("Rian")
  expect(S.age).toBe(18)
  expect(S.isMarried).toBe(false)
  S.name="Rian Wahid"
  S.age = 25
  S.isMarried=true
  expect(S.name).toBe("Rian Wahid")
  expect(S.age).toBe(25)
  expect(S.isMarried).toBe(true)
  
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
