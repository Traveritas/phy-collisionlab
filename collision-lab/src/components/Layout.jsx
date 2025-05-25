import React, { useState } from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import CollisionScene from './CollisionScene';
import ControlPanel from './ControlPanel';
import TaskPanel from './TaskPanel';
import FeedbackPanel from './FeedbackPanel';

export default function Layout() {
  const [sideOpen, setSideOpen] = useState(true);

  return (
    <div className="main-layout">
      <div className="scene-section">
        <CollisionScene />
        <div className="control-section">
          <ControlPanel />
        </div>
      </div>
      <AnimatePresence>
        {sideOpen && (
          <motion.div
            className="side-section"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
          >
            <TaskPanel />
            <FeedbackPanel />
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{ position: 'absolute', top: 32, right: sideOpen ? 440 : 32, zIndex: 10, transition: 'right 0.3s' }}
        icon={sideOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={() => setSideOpen((v) => !v)}
        aria-label={sideOpen ? '收起右侧面板' : '展开右侧面板'}
      />
    </div>
  );
} 