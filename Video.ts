export default class Video {
  private data: any
  [key: string]: any

  constructor(aHash: any) {
    this.data = aHash

    return new Proxy(this, {
      get(target, prop) {
        if (prop in target.data) return target.data[prop]
        return Reflect.get(target, prop)
      },
      set(target, prop, value) {
        target.data[prop] = value
        return true
      }
    })
  }

  toObj() {
    return this.data
  }
}