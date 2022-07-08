"use strict";
class StrongTypeError extends Error {
  
  constructor(assignType, currentType) {
    super(`type ${assignType} is not assignable to type ${currentType}`)
    this.name = "StrongTypeError"
  }
}




class TypeStrong {
  constructor(){
    return new Proxy({},{
      get:function(o,p){
        return o[p]
      },
      set:function(o,p,v){
        if(v===null||v===undefined){
          if(o[p]===undefined || o[p]===null){
             o[p]=v
             return true
          }
          throw new StrongTypeError(typeof v,o[p].constructor.name)
        }
        if (o[p] === undefined) {
           o[p] = v
           return true
        }
        if(o[p].constructor.toString()!==v.constructor.toString()){
          throw new StrongTypeError(
            v.constructor.name,
            o[p].constructor.name
            )
        }
         o[p]=v
         return true
      }
      
      
    })
  }
}

function strongly(){
  return new TypeStrong()
}


class ArrayProxy{
  constructor(Type,...tArg){
    return new Proxy(new Array(...tArg),{
      get:function(a,p){
        return a[p]
      },
      set: function(a, p, v) {
        if (!isNaN(parseInt(p))) {
          if (v === null || v === undefined) {
            return a[p] = v
          }
          if (v.constructor.toString() != Type.toString()) {
            throw new StrongTypeError(
              v.constructor.name,
              Type.name
            )
          }
          return a[p] = v
        }
        return a[p] = v
      }
    })
  }
}

class ArrayNumber extends ArrayProxy{
  constructor(...arg){
    super(Number,...arg)
  }
}

class ArrayString extends ArrayProxy {
  constructor(...arg) {
    super( String, ...arg)
  }
}

class ArrayObject extends ArrayProxy {
  constructor(...arg) {
    super(Object, ...arg)
  }
}

class ArrayFunction extends ArrayProxy{
  constructor(...arg){
    super(Function,...arg)
  }
}

function schema(objTypes) {
  return function(objToCheck) {
    for (let prop in objTypes) {
      if (objToCheck[prop] === undefined) {
        throw new Error(prop + " is undefined")
      }
    }
    for (let prop in objToCheck) {
      if (objTypes[prop] === undefined) {
        throw new Error("type of " + prop + " is not defined")
      }

      if (objTypes[prop].toString() !== objToCheck[prop].constructor.toString()) {
        throw new Error("type of " + prop + " is not" + objTypes[prop].name)
      }
    }
  }
}

module.exports= {
  schema,
  strongly,
  ArrayNumber,
  ArrayString,
  ArrayObject,
  ArrayFunction
}
