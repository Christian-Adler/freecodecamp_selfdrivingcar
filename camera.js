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

    const projPolys = polys.map(poly => new Polygon(
        poly.points.map(p => this.#projectPoint(ctx, p))
    ));

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const poly of projPolys) {
      poly.draw(ctx);
    }
    for (const poly of polys) {
      poly.draw(carCtx);
    }
  }

  #projectPoint(ctx, p) {
    const seg = new Segment(this.center, this.tip);
    const {point: p1} = seg.projectPoint(p);
    const c = cross(subtract(p1, this), subtract(p, this));
    const x = Math.sign(c) * distance(p, p1) / distance(this, p1);
    const y = (-this.z / distance(this, p1));

    const cX = ctx.canvas.width / 2;
    const cY = ctx.canvas.height / 2;
    const scaler = Math.min(cX, cY);
    return new Point(cX + x * scaler, cY + y * scaler);
  }

  draw(ctx) {
    // this.center.draw(ctx, {color: "red"});
    // this.tip.draw(ctx);
    // this.left.draw(ctx);
    // this.right.draw(ctx);
    this.poly.draw(ctx);
  }
}