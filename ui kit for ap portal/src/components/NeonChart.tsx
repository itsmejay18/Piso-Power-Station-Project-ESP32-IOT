import { useEffect, useRef } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface NeonChartProps {
  data: ChartData[];
  color?: string;
  height?: number;
  type?: 'line' | 'bar';
}

export default function NeonChart({ data, color = '#00d4ff', height = 80, type = 'line' }: NeonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = canvas.offsetWidth;
    const h = height;
    const max = Math.max(...data.map(d => d.value));
    const padding = 10;

    ctx.clearRect(0, 0, w, h);

    if (type === 'line') {
      const points = data.map((d, i) => ({
        x: padding + (i / (data.length - 1)) * (w - padding * 2),
        y: h - padding - (d.value / max) * (h - padding * 2),
      }));

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '00');

      ctx.beginPath();
      ctx.moveTo(points[0].x, h);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, h);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const cp1x = (points[i - 1].x + points[i].x) / 2;
        ctx.bezierCurveTo(cp1x, points[i - 1].y, cp1x, points[i].y, points[i].x, points[i].y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Dots
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();
      });
    } else {
      const barWidth = (w - padding * 2) / data.length - 4;
      data.forEach((d, i) => {
        const bh = (d.value / max) * (h - padding * 2);
        const x = padding + i * ((w - padding * 2) / data.length) + 2;
        const y = h - padding - bh;

        const gradient = ctx.createLinearGradient(0, y, 0, h);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '30');

        ctx.fillStyle = gradient;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.fillRect(x, y, barWidth, bh);
      });
    }
  }, [data, color, height, type]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
}
