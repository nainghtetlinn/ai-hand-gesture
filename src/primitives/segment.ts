import Point from "./point"

export default class Segment {
  p1: Point
  p2: Point
  constructor(p1: Point, p2: Point) {
    this.p1 = p1
    this.p2 = p2
  }

  draw(
    ctx: CanvasRenderingContext2D,
    {
      width = 2,
      color = "black",
      dash = [],
    }: { width?: number; color?: string; dash?: number[] } = {}
  ) {
    ctx.beginPath()
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.setLineDash(dash)
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
    ctx.setLineDash([])
  }
}
