class MarkerDetector {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.threshold = document.createElement("input");
    this.threshold.type = 'range';
    this.threshold.min = '0';
    this.threshold.max = '255';
    this.threshold.value = '50';
    document.body.appendChild(this.threshold);
  }

  #averagePoints(points) {
    const center = {x: 0, y: 0};
    for (const point of points) {
      center.x += point.x;
      center.y += point.y;
    }
    center.x /= points.length;
    center.y /= points.length;

    return center;
  }

  detect(imgData) {
    const points = [];
    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i]; // +0
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      // +4 = alpha (always 255

      // const blueness = b - Math.max(r, g);
      const blueness = g - Math.max(r, b); // greenness - was much better detectable in my room
      if (blueness > this.threshold.value) {
        const pIndex = i / 4;
        const y = Math.floor(pIndex / imgData.width);
        const x = pIndex % imgData.width;
        points.push({x, y, blueness});
      }
    }

    const centroid = this.#averagePoints(points);
    const size = Math.sqrt(points.length);
    const radius = size / 2;

    this.canvas.width = imgData.width;
    this.canvas.height = imgData.height + 255;
    for (const point of points) {
      this.ctx.globalAlpha = point.blueness / 255;
      this.ctx.fillRect(point.x, point.y, 1, 1,);
    }

    this.ctx.globalAlpha = 1;

    this.ctx.beginPath();
    this.ctx.arc(centroid.x, centroid.y, radius, 0, Math.PI * 2);
    this.ctx.stroke();


    points.sort((a, b) => b.blueness - a.blueness);

    this.ctx.translate(0, imgData.height);
    for (let i = 0; i < points.length; i++) {
      const y = points[i].blueness;
      const x = this.canvas.width * i / points.length;
      this.ctx.fillRect(x, y, 1, 1,);
    }
  }
}