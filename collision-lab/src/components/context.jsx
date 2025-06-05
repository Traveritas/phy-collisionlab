import React, { createContext, useState } from 'react';

export const ExperimentContext = createContext();

const defaultParams = {
  m1: 1,
  m2: 1,
  v1: 5,
  v2: 0,
  x1: 3 * 60,  // 3米
  x2: 7 * 60,  // 7米
  frictionAir: 0,
  restitution: 1,
  springStiffness: 0.001,  // 弹簧刚度
  springLength: 4,      // 弹簧自然长度（米）
  hasSpring: false,       // 是否启用弹簧
};

export function ExperimentProvider({ children }) {
  const [params, setParams] = useState(defaultParams);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const [feedback, setFeedback] = useState({ text: '', result: '', loading: false, error: null });
  const [resetKey, setResetKey] = useState(0);

  return (
    <ExperimentContext.Provider value={{
      params, setParams,
      running, setRunning,
      paused, setPaused,
      taskIndex, setTaskIndex,
      feedback, setFeedback,
      resetKey, setResetKey,
    }}>
      {children}
    </ExperimentContext.Provider>
  );
} 