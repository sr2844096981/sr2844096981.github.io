export class Point2d {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }
  clone() {
    return new Point2d(this.x, this.y)
  }

  equal(v) {
    return this.x === v.x && this.y === v.y
  }

  add2Map() {
    // 增加之前做一层过滤
    const isHas = pointMap.some((item) => item.equal(this))
    if (!isHas) {
      pointMap.push(this)
    }
    return this
  }

  add(v) {
    this.x += v.x
    this.y += v.y
    return this
  }

  min(v) {
    this.x = Math.min(this.x, v.x)
    this.y = Math.min(this.y, v.y)
    return this
  }

  max(v) {
    this.x = Math.max(this.x, v.x)
    this.y = Math.max(this.y, v.y)
    return this
  }

  abs() {
    return [Math.abs(this.x), Math.abs(this.y)]
  }

  sub(v) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  equal(v) {
    return this.x === v.x && this.y === v.y
  }

  rotate(center, angle) {
    const c = Math.cos(angle),
      s = Math.sin(angle)
    const x = this.x - center.x
    const y = this.y - center.y
    this.x = x * c - y * s + center.x
    this.y = x * s + y * c + center.y
    return this
  }

  distance(p) {
    const [x, y] = this.clone().sub(p).abs()
    return x * x + y * y
  }

  distanceSq(p) {
    const [x, y] = this.clone().sub(p).abs()
    return Math.sqrt(x * x + y * y)
  }

  static random(width, height) {
    return new Point2d(Math.random() * width, Math.random() * height)
  }

  cross(v) {
    return this.x * v.y - this.y * v.x
  }
}
