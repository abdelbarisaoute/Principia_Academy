import React, { useState } from 'react';
import { DiagramData } from '../types';
import { MathRenderer } from './MathRenderer';
import { RotateCw, Play, Pause, RefreshCw } from 'lucide-react';

interface DiagramRendererProps {
  data: DiagramData;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ data }) => {
  if (data.type === 'freebody') {
    return <FreeBodyDiagram config={data.config} title={data.title} caption={data.caption} />;
  }

  if (data.type === 'projectile') {
    return <ProjectileDiagram config={data.config} title={data.title} caption={data.caption} />;
  }

  if (data.type === 'plot') {
    return <FunctionPlotDiagram config={data.config} title={data.title} caption={data.caption} />;
  }

  return null;
};

// --- 1. Free-Body Diagram on an Incline ---
const FreeBodyDiagram: React.FC<{ config: any; title?: string; caption?: string }> = ({
  config,
  title = 'Free-Body Force Diagram',
  caption
}) => {
  const [angle, setAngle] = useState<number>(config.angle || 30);
  const [mass, setMass] = useState<number>(config.mass || 5);
  const [mu, setMu] = useState<number>(config.mu || 0.2);
  const g = 9.81;

  // Physics calculations
  const rad = (angle * Math.PI) / 180;
  const weight = mass * g;
  const normalForce = weight * Math.cos(rad);
  const downhillGravity = weight * Math.sin(rad);
  const maxStaticFriction = mu * normalForce;
  const netDownhillForce = Math.max(0, downhillGravity - maxStaticFriction);
  const acceleration = netDownhillForce / mass;

  // Incline visual coordinates
  const cx = 200;
  const cy = 180;
  const length = 260;
  const x1 = cx - (length / 2) * Math.cos(rad);
  const y1 = cy + (length / 2) * Math.sin(rad);
  const x2 = cx + (length / 2) * Math.cos(rad);
  const y2 = cy - (length / 2) * Math.sin(rad);

  return (
    <div className="my-6 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Interactive Simulation</span>
          <h4 className="text-base font-medium text-neutral-900 dark:text-neutral-100">{title}</h4>
        </div>
        <div className="text-xs font-mono bg-white dark:bg-neutral-800 px-3 py-1.5 rounded border border-neutral-200 dark:border-neutral-700">
          <MathRenderer latex={`a = ${acceleration.toFixed(2)}\\,\\text{m/s}^2`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Drawing */}
        <div className="lg:col-span-2 flex justify-center bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 p-2 overflow-hidden">
          <svg viewBox="0 0 400 280" className="w-full max-w-[420px] h-auto select-none">
            {/* Ground */}
            <line x1="30" y1="240" x2="370" y2="240" stroke="#94a3b8" strokeWidth="2" />

            {/* Incline Triangle */}
            <polygon
              points={`60,240 ${340},240 ${340},${240 - 280 * Math.tan(rad)}`}
              fill="#f1f5f9"
              className="dark:fill-neutral-900"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Angle arc */}
            <path
              d={`M 100,240 A 40 40 0 0 0 ${60 + 40 * Math.cos(rad)} ${240 - 40 * Math.sin(rad)}`}
              fill="none"
              stroke="#d97706"
              strokeWidth="2"
            />
            <text x="110" y="234" fontSize="12" fill="#d97706" fontWeight="bold">θ = {angle}°</text>

            {/* Incline block */}
            <g transform={`translate(${cx}, ${cy}) rotate(${-angle})`}>
              <rect x="-30" y="-30" width="60" height="30" fill="#3b82f6" fillOpacity="0.8" stroke="#1d4ed8" strokeWidth="2" rx="3" />
              
              {/* Normal Force Arrow (Upwards perpendicular) */}
              <line x1="0" y1="-15" x2="0" y2="-75" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
              <text x="5" y="-80" fontSize="12" fill="#10b981" fontWeight="bold">N = {normalForce.toFixed(1)} N</text>

              {/* Friction Force Arrow (Backwards parallel) */}
              <line x1="0" y1="-15" x2="50" y2="-15" stroke="#ef4444" strokeWidth="2.5" />
              <text x="55" y="-12" fontSize="11" fill="#ef4444" fontWeight="bold">f_k = {maxStaticFriction.toFixed(1)} N</text>
            </g>

            {/* Gravity Vector (Straight down from center) */}
            <line x1={cx} y1={cy - 15} x2={cx} y2={cy + 65} stroke="#6366f1" strokeWidth="2.5" />
            <text x={cx + 8} y={cy + 70} fontSize="12" fill="#6366f1" fontWeight="bold">W = mg = {weight.toFixed(1)} N</text>
          </svg>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Incline Angle (θ)</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">{angle}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="65"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Mass (m)</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">{mass} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Friction Coeff (μ)</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">{mu.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={mu}
              onChange={(e) => setMu(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800/80 p-3 rounded text-[11px] space-y-1 text-neutral-600 dark:text-neutral-400">
            <div><strong>Normal force:</strong> <MathRenderer latex={`N = mg\\cos\\theta = ${normalForce.toFixed(1)}\\,\\text{N}`} /></div>
            <div><strong>Downhill gravity:</strong> <MathRenderer latex={`mg\\sin\\theta = ${downhillGravity.toFixed(1)}\\,\\text{N}`} /></div>
            <div><strong>Kinetic friction:</strong> <MathRenderer latex={`f_k = \\mu N = ${maxStaticFriction.toFixed(1)}\\,\\text{N}`} /></div>
          </div>
        </div>
      </div>

      {caption && (
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 text-center italic">
          {caption}
        </p>
      )}
    </div>
  );
};

// --- 2. Projectile Motion Diagram ---
const ProjectileDiagram: React.FC<{ config: any; title?: string; caption?: string }> = ({
  config,
  title = 'Projectile Motion Simulation',
  caption
}) => {
  const [v0, setV0] = useState<number>(config.v0 || 25);
  const [angle, setAngle] = useState<number>(config.angle || 45);
  const g = 9.81;

  const rad = (angle * Math.PI) / 180;
  const vx = v0 * Math.cos(rad);
  const vy = v0 * Math.sin(rad);
  const flightTime = (2 * vy) / g;
  const maxHeight = (vy * vy) / (2 * g);
  const totalRange = (v0 * v0 * Math.sin(2 * rad)) / g;

  // Generate trajectory path points
  const points: string[] = [];
  const svgWidth = 360;
  const svgHeight = 180;
  const scaleX = svgWidth / Math.max(70, totalRange * 1.1);
  const scaleY = svgHeight / Math.max(35, maxHeight * 1.3);

  for (let t = 0; t <= flightTime; t += flightTime / 40) {
    const x = vx * t * scaleX + 30;
    const y = svgHeight - (vy * t - 0.5 * g * t * t) * scaleY - 20;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <div className="my-6 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Kinematics Simulation</span>
          <h4 className="text-base font-medium text-neutral-900 dark:text-neutral-100">{title}</h4>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-mono bg-white dark:bg-neutral-800 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700">
            <MathRenderer latex={`R = ${totalRange.toFixed(1)}\\,\\text{m}`} />
          </span>
          <span className="text-xs font-mono bg-white dark:bg-neutral-800 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700">
            <MathRenderer latex={`H = ${maxHeight.toFixed(1)}\\,\\text{m}`} />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 flex justify-center bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 p-3 overflow-hidden">
          <svg viewBox="0 0 400 200" className="w-full max-w-[420px] h-auto select-none">
            {/* Axis */}
            <line x1="30" y1="180" x2="380" y2="180" stroke="#64748b" strokeWidth="1.5" />
            <line x1="30" y1="180" x2="30" y2="20" stroke="#64748b" strokeWidth="1.5" />
            <text x="385" y="184" fontSize="11" fill="#64748b">x</text>
            <text x="25" y="15" fontSize="11" fill="#64748b">y</text>

            {/* Trajectory curve */}
            {points.length > 1 && (
              <polyline
                points={points.join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeDasharray="4,2"
              />
            )}

            {/* Launch velocity vector */}
            <line
              x1="30"
              y1="180"
              x2={30 + 40 * Math.cos(rad)}
              y2={180 - 40 * Math.sin(rad)}
              stroke="#ef4444"
              strokeWidth="2"
            />
            <text x={35 + 40 * Math.cos(rad)} y={175 - 40 * Math.sin(rad)} fontSize="11" fill="#ef4444" fontWeight="bold">
              v₀ = {v0} m/s
            </text>

            {/* Apex marker */}
            <circle
              cx={30 + (totalRange / 2) * scaleX}
              cy={180 - maxHeight * scaleY - 20}
              r="4"
              fill="#d97706"
            />
          </svg>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Initial Speed ($v_0$)</span>
              <span className="font-mono">{v0} m/s</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={v0}
              onChange={(e) => setV0(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Launch Angle ($\theta$)</span>
              <span className="font-mono">{angle}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="85"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800/80 p-3 rounded text-[11px] space-y-1 text-neutral-600 dark:text-neutral-400 font-mono">
            <div>Time of flight: <MathRenderer latex={`T = ${flightTime.toFixed(2)}\\,\\text{s}`} /></div>
            <div>Max height: <MathRenderer latex={`H = ${maxHeight.toFixed(1)}\\,\\text{m}`} /></div>
            <div>Horizontal range: <MathRenderer latex={`R = ${totalRange.toFixed(1)}\\,\\text{m}`} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Epsilon-Delta Limit Function Plot ---
const FunctionPlotDiagram: React.FC<{ config: any; title?: string; caption?: string }> = ({
  config,
  title = 'Epsilon-Delta Limit Neighborhood',
  caption
}) => {
  const [epsilon, setEpsilon] = useState<number>(config.epsilon || 0.6);
  const c = config.c || 2;
  const L = config.L || 5;
  const slope = 2; // f(x) = 2x + 1
  const delta = epsilon / slope;

  return (
    <div className="my-6 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Analysis Visualization</span>
          <h4 className="text-base font-medium text-neutral-900 dark:text-neutral-100">{title}</h4>
        </div>
        <div className="text-xs font-mono bg-white dark:bg-neutral-800 px-3 py-1.5 rounded border border-neutral-200 dark:border-neutral-700">
          $\epsilon = {epsilon.toFixed(2)} \implies \delta = {delta.toFixed(2)}$
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 flex justify-center bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 p-3">
          <svg viewBox="0 0 360 220" className="w-full max-w-[380px] h-auto select-none">
            {/* Axis */}
            <line x1="40" y1="180" x2="340" y2="180" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="180" x2="40" y2="20" stroke="#64748b" strokeWidth="1.5" />
            
            {/* Epsilon horizontal band around L=5 */}
            {/* Y scale: 0 to 8 -> y_svg = 180 - y * 20 */}
            <rect
              x="40"
              y={180 - (L + epsilon) * 20}
              width="300"
              height={2 * epsilon * 20}
              fill="#3b82f6"
              fillOpacity="0.12"
            />
            {/* Delta vertical band around c=2 */}
            {/* X scale: 0 to 4 -> x_svg = 40 + x * 65 */}
            <rect
              x={40 + (c - delta) * 65}
              y="20"
              width={2 * delta * 65}
              height="160"
              fill="#10b981"
              fillOpacity="0.12"
            />

            {/* Function Line f(x) = 2x + 1 */}
            <line
              x1="40"
              y1={180 - 1 * 20}
              x2={40 + 3.5 * 65}
              y2={180 - (2 * 3.5 + 1) * 20}
              stroke="#0f172a"
              className="dark:stroke-neutral-200"
              strokeWidth="2.5"
            />

            {/* Center point (c, L) */}
            <circle cx={40 + c * 65} cy={180 - L * 20} r="4" fill="#ef4444" />
            <line x1={40 + c * 65} y1="180" x2={40 + c * 65} y2={180 - L * 20} stroke="#94a3b8" strokeDasharray="3,3" />
            <line x1="40" y1={180 - L * 20} x2={40 + c * 65} y2={180 - L * 20} stroke="#94a3b8" strokeDasharray="3,3" />

            <text x={40 + c * 65 - 10} y="195" fontSize="11" fill="#475569" fontWeight="bold">c = 2</text>
            <text x="15" y={180 - L * 20 + 4} fontSize="11" fill="#475569" fontWeight="bold">L = 5</text>
          </svg>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Tolerance Target ($\epsilon$)</span>
              <span className="font-mono">{epsilon.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.05"
              value={epsilon}
              onChange={(e) => setEpsilon(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            By choosing $\delta = \epsilon/2 = {delta.toFixed(2)}$, whenever $x$ is confined within $(2 - \delta, 2 + \delta)$, $f(x)$ is strictly confined within $(5 - \epsilon, 5 + \epsilon)$.
          </p>
        </div>
      </div>
    </div>
  );
};
