class StrongTypeError extends Error {
  
  constructor(assignType, currentType) {
    super(`type ${assignType} is not assignable to type ${currentType}`)
    this.name = "StrongTypeError"
  }
}



/**
 * @param {Object} initialProps
 * @param {Object} initialObject
 * @returns {Object}
 */
function strongType(
  initialProps,
  initialObject={}){
  
  for(let prop in initialProps){
    
   
  
  if(initialProps[prop].value !== null && initialProps.value !== undefined){
    if(initialProps[prop].type.toString()!==initialProps[prop].value.constructor.toString()){
      
      throw new StrongTypeError(
        initialProps[prop].value.constructor.name,
        initialProps[prop].type.name
        )
    }
  }
    Object.defineProperty(initialObject,prop,{
      get:function(){
        return initialProps[prop].value
      },
      set:function(value){
         if(value === null || value === undefined){
          return initialProps[prop].value=value
         }
        if(value.constructor.toString()
           ===initialProps[prop].type.toString()){
          return initialProps[prop].value=value
        }

        throw new StrongTypeError(
          initialProps[prop].value.constructor.name,
          initialProps[prop].type.name
        )
        
      }
    })
  }
  return initialObject
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


module.exports= {
  strongType,
  ArrayNumber,
  ArrayString,
  ArrayObject,
  ArrayFunction
}
