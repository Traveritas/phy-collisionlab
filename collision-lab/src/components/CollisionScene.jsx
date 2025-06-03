import React, { useEffect, useRef, useContext, useState } from 'react';
import Matter from 'matter-js';
import { ExperimentContext } from './context.jsx';
import VelocityChart from './VelocityChart';

export default function CollisionScene() {
  const sceneRef = useRef();
  const engineRef = useRef();
  const runnerRef = useRef();
  const { params, setParams, running, paused, resetKey } = useContext(ExperimentContext);
  const [velHistory, setVelHistory] = useState([]);
  const runningRef = useRef(running);
  const pausedRef = useRef(paused);
  const blocksRef = useRef({ blockA: null, blockB: null });

  // 采样定时器
  const sampleTimer = useRef(null);

  // 监听 running 状态变化，重置曲线
  useEffect(() => {
    runningRef.current = running;
    if (running) {
      setVelHistory([]);
    } else {
      // 停止采样
      if (sampleTimer.current) {
        clearInterval(sampleTimer.current);
        sampleTimer.current = null;
      }
    }
  }, [running]);

  // 监听 paused 状态变化
  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      // 暂停时停止采样和物理引擎
      if (sampleTimer.current) {
        clearInterval(sampleTimer.current);
        sampleTimer.current = null;
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
    } else if (running && blocksRef.current.blockA && blocksRef.current.blockB) {
      // 继续时重新开始采样和物理引擎
      if (runnerRef.current) {
        Matter.Runner.start(runnerRef.current, engineRef.current);
      }
      let frameCount = 0;
      sampleTimer.current = setInterval(() => {
        frameCount++;
        setVelHistory((old) => [...old, { 
          t: frameCount, 
          vA: blocksRef.current.blockA.velocity.x, 
          vB: blocksRef.current.blockB.velocity.x,
          mA: params.m1,
          mB: params.m2
        }]);
      }, 30); // 约33fps
    }
  }, [paused, running, params.m1, params.m2]);

  // 监听 resetKey 变化，重置曲线
  useEffect(() => {
    setVelHistory([]);
  }, [resetKey]);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Body = Matter.Body;
    const Events = Matter.Events;
    const Constraint = Matter.Constraint;

    const width = 900;
    const height = 180;
    const blockWidth = 80;
    const blockHeight = 56;
    const minX = 60;
    const maxX = width - 60;
    const centerY = height / 2;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 0;

    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#f6f8fa',
      },
    });

    // 创建地面和墙壁
    const ground = Bodies.rectangle(width/2, centerY + blockHeight/2 + 10, width, 20, { 
      isStatic: true,
      render: { 
        fillStyle: '#e0e0e0',
        strokeStyle: '#999',
        lineWidth: 1
      }
    });

    const leftWall = Bodies.rectangle(0, centerY, 20, height, { 
      restitution: params.restitution,
      isStatic: true, 
      render: { 
        fillStyle: '#e0e0e0',
        strokeStyle: '#999',
        lineWidth: 1
      }
    });

    const rightWall = Bodies.rectangle(width, centerY, 20, height, { 
      restitution: params.restitution,
      isStatic: true, 
      render: { 
        fillStyle: '#e0e0e0',
        strokeStyle: '#999',
        lineWidth: 1
      }
    });

    const blockA = Bodies.rectangle(params.x1, centerY, blockWidth, blockHeight, {
      restitution: params.restitution,
      frictionAir: params.frictionAir,
      mass: params.m1,
      inertia: Infinity,
      angle: 0,
      render: { 
        fillStyle: '#4f8cff',
        strokeStyle: '#1e60d4',
        lineWidth: 2
      },
      label: 'A',
    });

    const blockB = Bodies.rectangle(params.x2, centerY, blockWidth, blockHeight, {
      restitution: params.restitution,
      frictionAir: params.frictionAir,
      mass: params.m2,
      inertia: Infinity,
      angle: 0,
      render: { 
        fillStyle: '#ffb84f',
        strokeStyle: '#d48a1e',
        lineWidth: 2
      },
      label: 'B',
    });

    // 保存块引用
    blocksRef.current = { blockA, blockB };

    World.add(engine.world, [ground, leftWall, rightWall, blockA, blockB]);

    // 添加弹簧约束
    let spring = null;
    if (params.hasSpring) {
      spring = Constraint.create({
        bodyA: blockA,
        bodyB: blockB,
        stiffness: params.springStiffness,
        length: params.springLength,
        render: {
          visible: true,
          type: 'line',
          anchors: false,
          lineWidth: 2,
          strokeStyle: '#666'
        }
      });
      World.add(engine.world, spring);
    }

    // 拖动设置初始位置
    let dragging = null;
    Matter.Events.on(render, 'afterRender', () => {
      // 绘制A/B标识
      const ctx = render.context;
      ctx.save();
      ctx.font = 'bold 28px Segoe UI, Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 4;
      ctx.fillText('A', blockA.position.x, blockA.position.y);
      ctx.fillText('B', blockB.position.x, blockB.position.y);

      // 绘制弹簧
      if (params.hasSpring && spring) {
        const start = spring.bodyA.position;
        const end = spring.bodyB.position;
        const segments = 10;
        const dx = (end.x - start.x) / segments;
        const dy = (end.y - start.y) / segments;
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        
        for (let i = 1; i < segments; i++) {
          const x = start.x + dx * i;
          const y = start.y + dy * i;
          const offset = (i % 2 === 0 ? 1 : -1) * 10;
          const perpX = -dy / Math.sqrt(dx * dx + dy * dy) * offset;
          const perpY = dx / Math.sqrt(dx * dx + dy * dy) * offset;
          ctx.lineTo(x + perpX, y + perpY);
        }
        
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();

      // 拖动
      if (!running) {
        [blockA, blockB].forEach((block, idx) => {
          const el = render.canvas;
          el.onmousedown = (e) => {
            const rect = el.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            if (Math.abs(mx - block.position.x) < blockWidth / 2 + 10) {
              dragging = block;
            }
          };
          el.onmousemove = (e) => {
            if (dragging === block) {
              const rect = el.getBoundingClientRect();
              let mx = e.clientX - rect.left;
              mx = Math.max(minX, Math.min(mx, maxX));
              Matter.Body.setPosition(block, { x: mx, y: centerY });
              setParams((p) => ({
                ...p,
                [idx === 0 ? 'x1' : 'x2']: mx,
              }));
            }
          };
          el.onmouseup = () => {
            dragging = null;
          };
        });
      }
    });

    // 启动/重置
    if (running) {
      Body.setVelocity(blockA, { x: params.v1, y: 0 });
      Body.setVelocity(blockB, { x: params.v2, y: 0 });
    } else {
      Body.setVelocity(blockA, { x: 0, y: 0 });
      Body.setVelocity(blockB, { x: 0, y: 0 });
    }

    // 只允许水平移动，锁定 y 坐标和角度
    Events.on(engine, 'beforeUpdate', () => {
      [blockA, blockB].forEach((block) => {
        Body.setPosition(block, { x: block.position.x, y: centerY });
        Body.setAngle(block, 0);
        Body.setAngularVelocity(block, 0);
        Body.setVelocity(block, { x: block.velocity.x, y: 0 });
      });
    });

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // 记录速度曲线（只在 running 且未暂停时采样）
    let t0 = performance.now();
    if (running && !paused) {
      sampleTimer.current = setInterval(() => {
        const now = performance.now();
        const t = ((now - t0) / 1000).toFixed(2) * 1;
        setVelHistory((old) => [...old, { 
          t, 
          vA: blockA.velocity.x, 
          vB: blockB.velocity.x,
          mA: params.m1,
          mB: params.m2
        }]);
      }, 30);
    }

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      if (sampleTimer.current) {
        clearInterval(sampleTimer.current);
        sampleTimer.current = null;
      }
      blocksRef.current = { blockA: null, blockB: null };
      runnerRef.current = null;
    };
    // eslint-disable-next-line
  }, [params, running, resetKey]); // 移除 paused 依赖

  return (
    <>
      <div ref={sceneRef} style={{ width: 900, height: 180, margin: '0 auto' }} />
      <VelocityChart data={velHistory} key={resetKey} />
    </>
  );
} 