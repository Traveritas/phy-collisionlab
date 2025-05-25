import React, { useContext } from 'react';
import { Card, Steps, Button } from 'antd';
import { ExperimentContext } from './context.jsx';

const tasks = [
  {
    title: '任务一：等质量碰撞',
    description: '设置两物体质量相等，观察碰撞后速度变化。',
    lock: { m1: 2, m2: 2 },
  },
  {
    title: '任务二：质量不同',
    description: '设置A质量为2kg，B质量为4kg，观察碰撞现象。',
    lock: { m1: 2, m2: 4 },
  },
  {
    title: '任务三：非弹性碰撞',
    description: '选择小于1的恢复系数，体验非弹性碰撞。',
    lock: { restitution: 0.3 },
  },
  {
    title: '任务四：摩擦影响',
    description: '调高摩擦力，观察能量损失。',
    lock: { friction: 0.15 },
  },
  {
    title: '任务五：弹簧碰撞',
    description: '设置弹簧，体验弹簧碰撞。',
    lock: { hasSpring: true },
  },
  {
    title: '任务六：自定义探究',
    description: '自由设置参数，设计你自己的碰撞实验。',
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