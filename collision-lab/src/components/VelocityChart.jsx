import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      title: { display: true, text: '时间 (s)' },
      ticks: { maxTicksLimit: 6 },
    },
    y: {
      title: { display: true, text: '数值' },
      min: -12,
      max: 12,
    },
  },
  animation: false,
  elements: { line: { borderWidth: 2 } },
};

export default function VelocityChart({ data }) {
  // 计算动能和动量
  const calculateKineticEnergy = (velocity, mass) => 0.5 * mass * velocity * velocity;
  const calculateMomentum = (velocity, mass) => mass * velocity;

  const chartData = {
    velocity: {
      labels: data.map((d) => d.t.toFixed(2)),
      datasets: [
        {
          label: 'A 速度 (m/s)',
          data: data.map((d) => d.vA),
          borderColor: '#4f8cff',
          backgroundColor: 'rgba(79,140,255,0.1)',
          tension: 0.2,
          pointRadius: 0,
        },
        {
          label: 'B 速度 (m/s)',
          data: data.map((d) => d.vB),
          borderColor: '#ffb84f',
          backgroundColor: 'rgba(255,184,79,0.1)',
          tension: 0.2,
          pointRadius: 0,
        },
      ],
    },
    kineticEnergy: {
      labels: data.map((d) => d.t.toFixed(2)),
      datasets: [
        {
          label: 'A 动能 (J)',
          data: data.map((d) => calculateKineticEnergy(d.vA, d.mA)),
          borderColor: '#4f8cff',
          backgroundColor: 'rgba(79,140,255,0.1)',
          tension: 0.2,
          pointRadius: 0,
        },
        {
          label: 'B 动能 (J)',
          data: data.map((d) => calculateKineticEnergy(d.vB, d.mB)),
          borderColor: '#ffb84f',
          backgroundColor: 'rgba(255,184,79,0.1)',
          tension: 0.2,
          pointRadius: 0,
        },
      ],
    },
    momentum: {
      labels: data.map((d) => d.t.toFixed(2)),
      datasets: [
        {
          label: 'A 动量 (kg·m/s)',
          data: data.map((d) => calculateMomentum(d.vA, d.mA)),
          borderColor: '#4f8cff',
          backgroundColor: 'rgba(79,140,255,0.1)',
          tension: 0.2,
          pointRadius: 0,
        },
        {
          label: 'B 动量 (kg·m/s)',
          data: data.map((d) => calculateMomentum(d.vB, d.mB)),
          borderColor: '#ffb84f',
          backgroundColor: 'rgba(255,184,79,0.1)',
          tension: 0.2,
          pointRadius: 0,
        },
      ],
    },
  };

  const velocityOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        title: { display: true, text: '速度 (m/s)' },
      },
    },
  };

  const kineticEnergyOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        title: { display: true, text: '动能 (J)' },
        min: 0,
        max: 50,
      },
    },
  };

  const momentumOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        title: { display: true, text: '动量 (kg·m/s)' },
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'center', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', padding: 12, width: '350px' }}>
        <Line data={chartData.velocity} options={velocityOptions} height={150} />
      </div>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', padding: 12, width: '350px' }}>
        <Line data={chartData.kineticEnergy} options={kineticEnergyOptions} height={150} />
      </div>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', padding: 12, width: '350px' }}>
        <Line data={chartData.momentum} options={momentumOptions} height={150} />
      </div>
    </div>
  );
} 