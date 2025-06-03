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
  Title,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  Title
);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: '时间 (s)'
      },
      ticks: {
        callback: function(value) {
          // 将帧数转换为时间（秒）
          return (value * 0.03).toFixed(1);
        },
        maxTicksLimit: 6
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: '数值'
      }
    }
  },
  animation: false,
  elements: { line: { borderWidth: 2 } },
};

export default function VelocityChart({ data }) {
  // 计算动能和动量
  const calculateKineticEnergy = (velocity, mass) => 0.5 * mass * velocity * velocity;
  const calculateMomentum = (velocity, mass) => mass * velocity;

  // 计算数据的最大最小值，并添加边距
  const calculateRange = (values, margin = 0.1) => {
    if (values.length === 0) return { min: -10, max: 10 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const padding = range * margin;
    return {
      min: Math.floor(min - padding),
      max: Math.ceil(max + padding)
    };
  };

  // 计算速度范围
  const velocityValues = data.flatMap(d => [d.vA, d.vB]);
  const velocityRange = calculateRange(velocityValues);

  // 计算动能范围
  const kineticEnergyValues = data.flatMap(d => [
    calculateKineticEnergy(d.vA, d.mA),
    calculateKineticEnergy(d.vB, d.mB)
  ]);
  const kineticEnergyRange = calculateRange(kineticEnergyValues);

  // 计算动量范围
  const momentumValues = data.flatMap(d => [
    calculateMomentum(d.vA, d.mA),
    calculateMomentum(d.vB, d.mB)
  ]);
  const momentumRange = calculateRange(momentumValues);

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
        min: velocityRange.min,
        max: velocityRange.max,
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
        min: Math.max(0, kineticEnergyRange.min),
        max: kineticEnergyRange.max,
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
        min: momentumRange.min,
        max: momentumRange.max,
      },
    },
  };

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 8, 
      boxShadow: '0 1px 4px #e0e0e0', 
      padding: 12,
      margin: '0 auto',
      width: '100%',
      maxWidth: '1200px',
      overflowX: 'auto',
      overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{ 
        display: 'inline-flex', 
        flexDirection: 'row', 
        gap: '12px', 
        padding: '0 4px',
        width: 'max-content'
      }}>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', padding: 12, width: '350px', flexShrink: 0 }}>
          <Line data={chartData.velocity} options={velocityOptions} height={150} />
        </div>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', padding: 12, width: '350px', flexShrink: 0 }}>
          <Line data={chartData.kineticEnergy} options={kineticEnergyOptions} height={150} />
        </div>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', padding: 12, width: '350px', flexShrink: 0 }}>
          <Line data={chartData.momentum} options={momentumOptions} height={150} />
        </div>
      </div>
    </div>
  );
} 