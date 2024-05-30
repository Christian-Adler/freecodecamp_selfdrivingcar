class MarkerDetector {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
  }

  detect(imgData) {
    const points = [];
    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i]; // +0
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      // +4 = alpha (always 255

      const blueness = b - Math.max(r, g);
      if (blueness > 0) {
        const pIndex = i / 4;
        const y = Math.floor(pIndex / imgData.width);
        const x = pIndex % imgData.width;
        points.push({x, y, blueness});
      }
    }

    this.canvas.width = imgData.width;
    this.canvas.height = imgData.height;
    for (const point of points) {
      this.ctx.fillRect(point.x, point.y, 1, 1,);
    }
  }
}