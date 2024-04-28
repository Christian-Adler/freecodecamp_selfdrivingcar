class Camera {
  constructor({x, y, angle}, range = 1000, distanceBehind = 150) {
    this.range = range;
    this.distanceBehind = distanceBehind;
    this.z = -40;
    this.move({x, y, angle});
  }

  move({x, y, angle}) {
    this.x = x + this.distanceBehind * Math.sin(angle);
    this.y = y + this.distanceBehind * Math.cos(angle);
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

  #filter(polys) {
    const filteredPolys = [];
    for (const poly of polys) {
      // too long straight lines don't have any point inside the camera triangle
      // if (!this.poly.containsPoly(poly))
      //   continue;

      if (poly.intersectsPoly(this.poly)) {
        const copy1 = new Polygon(poly.points);
        const copy2 = new Polygon(this.poly.points);
        Polygon.break(copy1, copy2, true);
        const points = copy1.segments.map(s => s.p1);
        const filteredPoints = points.filter(p => p.intersection || this.poly.containsPoint(p));
        filteredPolys.push(new Polygon(filteredPoints));
      } else if (this.poly.containsPoly(poly)) {
        filteredPolys.push(poly);
      }
    }
    return filteredPolys;
  }

  #extrude(polys, height = 10) {
    const extrudedPolys = [];
    for (const poly of polys) {
      const ceiling = new Polygon(
          poly.points.map(p => new Point(p.x, p.y, -height))
      );
      const sides = [];
      for (let i = 0; i < poly.points.length; i++) {
        sides.push(new Polygon([
          poly.points[i],
          poly.points[(i + 1) % poly.points.length],
          ceiling.points[(i + 1) % ceiling.points.length],
          ceiling.points[i],
        ]))

      }
      extrudedPolys.push(/*poly, */ ceiling, ...sides);
    }
    return extrudedPolys;
  }

  #getPolys(world) {
    const buildingPolys = this.#extrude(
        this.#filter(world.buildings.map(b => b.base)),
        200
    );

    const roadPolys = this.#extrude(
        this.#filter(world.corridor.borders.map(s => new Polygon([s.p1, s.p2]))),
        10
    );

    // const treePolys = this.#extrude(
    //     this.#filter(world.trees.map(b => b.base)),
    //     200
    // );

    const carPolys = this.#extrude(
        this.#filter(world.cars.map(c =>
                new Polygon(c.polygon.map(p => new Point(p.x, p.y)))
            )
        ),
        10
    );

    return [...buildingPolys, ...roadPolys, ...carPolys];
  }

  render(ctx, world) {
    const polys = this.#getPolys(world);

    const projPolys = polys.map(poly => new Polygon(
        poly.points.map(p => this.#projectPoint(ctx, p))
    ));

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const poly of projPolys) {
      poly.draw(ctx);
    }

    // soround polys on 2d for develop
    // for (const poly of polys) {
    //   poly.draw(carCtx);
    // }
  }


  #projectPoint(ctx, p) {
    const seg = new Segment(this.center, this.tip);
    const {point: p1} = seg.projectPoint(p);
    const c = cross(subtract(p1, this), subtract(p, this));
    const x = Math.sign(c) * distance(p, p1) / distance(this, p1);
    const y = (p.z - this.z) / distance(this, p1);

    const cX = ctx.canvas.width / 2;
    const cY = ctx.canvas.height / 2;
    const scaler = Math.max(cX, cY);
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