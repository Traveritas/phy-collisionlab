import React, { createContext, useState } from 'react';

export const ExperimentContext = createContext();

const defaultParams = {
  m1: 1,
  m2: 1,
  v1: 5,
  v2: 0,
  x1: 180,
  x2: 420,
  frictionAir: 0,
  restitution: 1,
  springStiffness: 0.001,  // 弹簧刚度
  springLength: 240,      // 弹簧自然长度
  hasSpring: false,       // 是否启用弹簧
};

export function ExperimentProvider({ children }) {
  const [params, setParams] = useState(defaultParams);
  const [running, setRunning] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const [feedback, setFeedback] = useState({ text: '', result: '', loading: false, error: null });

  return (
    <ExperimentContext.Provider value={{
      params, setParams,
      running, setRunning,
      taskIndex, setTaskIndex,
      feedback, setFeedback,
    }}>
      {children}
    </ExperimentContext.Provider>
  );
} 