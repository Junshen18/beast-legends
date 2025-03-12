"use client";
import React, { useEffect } from "react";

type AnimatedLineArrowProps = {
  className?: string;
  width?: number;
  height?: number;
};

class AnimatedLineArrow {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lineLength: number = 0;
  private opacity: number = 0;
  private readonly maxLineLength: number = 600;
  private readonly startX: number = 100;
  private readonly startY: number = 100;

  constructor(container: HTMLDivElement, className = "", width = 800, height = 200) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 800;
    this.canvas.height = 200;

    if (className) this.canvas.className = className;
    container.appendChild(this.canvas);

    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("Failed to get canvas context");
    this.ctx = context;

    this.animate();
  }

  private drawDiamond(x: number, y: number) {
    this.ctx.globalAlpha = this.opacity / 100;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + 10, y - 10);
    this.ctx.lineTo(x + 20, y);
    this.ctx.lineTo(x + 10, y + 10);
    this.ctx.closePath();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalAlpha = this.opacity / 100;
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(this.startX + this.lineLength, this.startY);
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;

    this.drawDiamond(this.startX + this.lineLength, this.startY);

    if (this.lineLength < this.maxLineLength) {
      this.lineLength += 5;
      if (this.opacity < 100) this.opacity += 1;
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

const AnimatedLineArrowComponent: React.FC<AnimatedLineArrowProps> = ({ className }) => {
  useEffect(() => {
    const container = document.getElementById("animationContainer") as HTMLDivElement;
    if (container) {
      new AnimatedLineArrow(container, className);
    }
  }, [className]);

  return <div id="animationContainer" />;
};

export default AnimatedLineArrowComponent;
