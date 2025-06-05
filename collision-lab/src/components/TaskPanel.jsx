import React, { useContext } from 'react';
import { Card, Steps, Button } from 'antd';
import { ExperimentContext } from './context.jsx';

const tasks = [
  {
    title: '任务一：等质量碰撞',
    description: '设置两物体质量相等（如2kg），观察碰撞后速度交换现象。验证动量守恒和能量守恒。',
    lock: { m1: 2, m2: 2 },
  },
  {
    title: '任务二：质量不同',
    description: '设置A质量为2kg，B质量为4kg，观察碰撞后速度变化。分析质量差异对碰撞结果的影响。',
    lock: { m1: 2, m2: 4 },
  },
  {
    title: '任务三：非弹性碰撞',
    description: '设置恢复系数为0.3，观察碰撞过程中的能量损失。分析非弹性碰撞的特点。',
    lock: { restitution: 0.3 },
  },
  {
    title: '任务四：摩擦影响',
    description: '设置阻力为0.02，观察物体运动过程中的速度衰减。分析摩擦力对运动的影响。',
    lock: { frictionAir: 0.02 },
  },
  {
    title: '任务五：弹簧碰撞',
    description: '启用弹簧连接，设置弹簧长度为4m，观察弹性势能与动能的相互转化。',
    lock: { hasSpring: true, springLength: 4 },
  },
  {
    title: '任务六：综合探究',
    description: '自由设置参数，设计并验证你的物理猜想。可以尝试不同的质量比、恢复系数和弹簧参数。',
    lock: {},
  },
];

export default function TaskPanel() {
  const { taskIndex, setTaskIndex, setParams } = useContext(ExperimentContext);

  const handleTaskChange = (idx) => {
    setTaskIndex(idx);
    setParams((p) => ({ ...p, ...tasks[idx].lock }));
  };

  return (
    <Card title="实验任务" size="small" bordered={false} style={{ marginBottom: 16 }}>
      <Steps
        direction="vertical"
        size="small"
        current={taskIndex}
        items={tasks.map((t, i) => ({ title: t.title, description: t.description }))}
        onChange={handleTaskChange}
      />
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        {taskIndex < tasks.length - 1 && (
          <Button type="link" onClick={() => handleTaskChange(taskIndex + 1)}>下一个任务</Button>
        )}
      </div>
    </Card>
  );
} 