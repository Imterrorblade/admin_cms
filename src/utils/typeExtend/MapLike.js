class MapLike {
  set(key, value) {
    this[key] = value
    return this
  }
  get(key) {
    return this[key]
  }
  merge(map) {
    this.keys().map(key => {
      if (map && map.hasOwnProperty(key)) {
        this.set(key, map.get(key))
      }
    })
    return this
  }
  remove(key) {
    delete this[key]
    return this
  }
  keys() {
    return Object.keys(this)
  }
  clear() {
    return this.keys().map(key => {
      this.remove(key)
    })
  }
}
export default MapLike
