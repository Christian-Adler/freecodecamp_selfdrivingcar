class Camera {
  constructor({x, y, angle}, range = 100) {
    this.range = range;
    this.z = -20;
    this.move({x, y, angle});
  }

  move({x, y, angle}) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.center = new Point(this.x, this.y);
    this.tip = new Point(
        this.x - this.range * Math.sin(this.angle),
        this.y - this.range * Math.cos(this.angle)
    );
  }

  draw(ctx) {
    this.center.draw(ctx, {color: "red"});
    this.tip.draw(ctx);
  }
}