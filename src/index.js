class DeepCloner{
  constructor(){
    this.cache = new WeakMap()
  }
  clone(source){
    if(source instanceof Object){
      let dist = this.findCache(source)
      if(dist) return dist
      dist = new Object()
      if(source instanceof Array){
        dist = new Array()
      }
      if(source instanceof Function){
        dist = function() {
          return source.apply(this, arguments)
        }
      }
      if(source instanceof RegExp){
        dist = new RegExp(source.source,source.flags)
      }
      this.cache.set(source,dist)
      for(let key in source){
        if(source.hasOwnProperty(key)){
          dist[key] = this.clone(source[key])
        }
      }
      return dist
    }
    return source
  }
  findCache(source){
    if(this.cache.has(source)){
      return this.cache.get(source)
    }
    return undefined
  }

}

module.exports = DeepCloner