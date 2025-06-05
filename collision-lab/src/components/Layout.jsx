import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import CollisionScene from './CollisionScene';
import ControlPanel from './ControlPanel';
import TaskPanel from './TaskPanel';
import FeedbackPanel from './FeedbackPanel';

export default function Layout() {
  const [sideOpen, setSideOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const sideRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleToggle = () => {
    if (sideOpen) {
      setIsClosing(true);
      timeoutRef.current = setTimeout(() => {
        setSideOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setSideOpen(true);
      setIsOpening(true);
      timeoutRef.current = setTimeout(() => {
        setIsOpening(false);
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="main-layout">
      <div 
        className="scene-section" 
        style={{ 
          width: sideOpen ? 'calc(100% - 480px)' : 'calc(100% - 80px)'
        }}
      >
        <CollisionScene />
        <div className="control-section">
          <ControlPanel />
        </div>
      </div>
      {sideOpen && (
        <div 
          ref={sideRef}
          className={`side-section ${isClosing ? 'closing' : ''} ${isOpening ? 'opening' : ''}`}
        >
          <TaskPanel />
          <FeedbackPanel />
        </div>
      )}
      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{ position: 'absolute', top: 32, right: sideOpen ? 440 : 32, zIndex: 10, transition: 'right 0.3s' }}
        icon={sideOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={handleToggle}
        aria-label={sideOpen ? '收起右侧面板' : '展开右侧面板'}
      />
    </div>
  );
} 