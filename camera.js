class Camera {
  constructor({x, y, angle}, range = 1000) {
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
    this.left = new Point(
        this.x - this.range * Math.sin(this.angle - Math.PI / 4),
        this.y - this.range * Math.cos(this.angle - Math.PI / 4)
    );
    this.right = new Point(
        this.x - this.range * Math.sin(this.angle + Math.PI / 4),
        this.y - this.range * Math.cos(this.angle + Math.PI / 4)
    );
    this.poly = new Polygon([this.center, this.left, this.right]);
  }

  render(ctx, world) {
    const polys = world.buildings.map(b => b.base);
    for (const poly of polys) {
      poly.draw(carCtx);
    }
  }

  draw(ctx) {
    // this.center.draw(ctx, {color: "red"});
    // this.tip.draw(ctx);
    // this.left.draw(ctx);
    // this.right.draw(ctx);
    this.poly.draw(ctx);
  }

}