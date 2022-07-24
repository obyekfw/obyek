"use strict";

const {type} = require("../index.js")
const {schema} = type
test("schema validation valid",()=>{
 let check= schema({
    name:String,
    age:Number
  })
  check({
    name:"rian",
    age:18
  })
})

test("schema validation invalid",()=>{
 let check= schema({
    name:String,
    age:Number,
  })
  try{
    check({
      age:"18",
      name:"Rian"
    })
    throw "number validation fail"
  }catch(e){
    if(!e.message){
      throw new Error(e)
    }
  }
  
  try {
    check({
      age: 18,
      name: 2903
    })
    throw "string validation fail"
  } catch (e) {
    if (!e.message) {
      throw new Error(e)
    }
  }
})

