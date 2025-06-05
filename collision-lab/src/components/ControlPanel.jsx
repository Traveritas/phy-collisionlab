import React, { useContext } from 'react';
import { Slider, InputNumber, Row, Col, Select, Button, Switch } from 'antd';
import { ExperimentContext } from './context.jsx';

const restitutionOptions = [
  { label: '1.0（理想物块）', value: 1 },
  { label: '0.8', value: 0.8 },
  { label: '0.3', value: 0.3 },
  { label: '0.0（粘性物块）', value: 0.0 },
];

export default function ControlPanel() {
  const { params, setParams, running, setRunning, paused, setPaused, setResetKey } = useContext(ExperimentContext);

  const handleChange = (key, value) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const handlePause = () => {
    setPaused(p => !p);
  };

  const handleReset = () => {
    setRunning(false);
    setPaused(false);
    setParams(p => ({ ...p }));
    setResetKey(k => k + 1);
  };

  return (
    <div>
      <div style={{ 
        background: '#f0f2f5', 
        borderRadius: 8, 
        padding: '12px 16px', 
        marginBottom: 12 
      }}>
        <div style={{ 
          fontSize: 14, 
          fontWeight: 'bold', 
          color: '#4f8cff', 
          marginBottom: 8 
        }}>物块A参数</div>
        <Row gutter={16} align="middle">
          <Col span={6}>质量(kg):</Col>
          <Col span={6}>
            <InputNumber min={0.1} max={100} step={0.1} value={params.m1} onChange={v => handleChange('m1', v)} disabled={running} />
          </Col>
          <Col span={6}>速度(m/s):</Col>
          <Col span={6}>
            <InputNumber min={-10} max={10} step={0.1} value={params.v1} onChange={v => handleChange('v1', v)} disabled={running} />
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ marginTop: 12 }}>
          <Col span={6}>位置(m):</Col>
          <Col span={18}>
            <Slider 
              min={1} 
              max={13} 
              step={0.1} 
              value={params.x1 / 60} 
              onChange={v => handleChange('x1', v * 60)} 
              disabled={running} 
            />
          </Col>
        </Row>
      </div>

      <div style={{ 
        background: '#f0f2f5', 
        borderRadius: 8, 
        padding: '12px 16px', 
        marginBottom: 12 
      }}>
        <div style={{ 
          fontSize: 14, 
          fontWeight: 'bold', 
          color: '#ffb84f', 
          marginBottom: 8 
        }}>物块B参数</div>
        <Row gutter={16} align="middle">
          <Col span={6}>质量(kg):</Col>
          <Col span={6}>
            <InputNumber min={0.1} max={100} step={0.1} value={params.m2} onChange={v => handleChange('m2', v)} disabled={running} />
          </Col>
          <Col span={6}>速度(m/s):</Col>
          <Col span={6}>
            <InputNumber min={-10} max={10} step={0.1} value={params.v2} onChange={v => handleChange('v2', v)} disabled={running} />
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ marginTop: 12 }}>
          <Col span={6}>位置(m):</Col>
          <Col span={18}>
            <Slider 
              min={1} 
              max={13} 
              step={0.1} 
              value={params.x2 / 60} 
              onChange={v => handleChange('x2', v * 60)} 
              disabled={running} 
            />
          </Col>
        </Row>
      </div>

      <div style={{ 
        background: '#f0f2f5', 
        borderRadius: 8, 
        padding: '12px 16px', 
        marginBottom: 12 
      }}>
        <div style={{ 
          fontSize: 14, 
          fontWeight: 'bold', 
          color: '#666', 
          marginBottom: 8 
        }}>环境参数</div>
        <Row gutter={16} align="middle">
          <Col span={6}>阻力:</Col>
          <Col span={6}>
            <Slider min={0} max={0.03} step={0.001} value={params.frictionAir} onChange={v => handleChange('frictionAir', v)} disabled={running} style={{ width: 100 }} />
          </Col>
          <Col span={6}>恢复系数:</Col>
          <Col span={6}>
            <Slider 
              min={0} 
              max={1} 
              step={0.1} 
              value={params.restitution} 
              onChange={v => handleChange('restitution', v)} 
              disabled={running} 
              style={{ width: 100 }} 
            />
          </Col>
        </Row>
      </div>

      <div style={{ 
        background: '#f0f2f5', 
        borderRadius: 8, 
        padding: '12px 16px', 
        marginBottom: 12 
      }}>
        <div style={{ 
          fontSize: 14, 
          fontWeight: 'bold', 
          color: '#666', 
          marginBottom: 8 
        }}>弹簧设置</div>
        <Row gutter={16} align="middle">
          <Col span={6}>启用弹簧:</Col>
          <Col span={6}>
            <Switch checked={params.hasSpring} onChange={v => handleChange('hasSpring', v)} disabled={running} />
          </Col>
          <Col span={6}>弹簧刚度:</Col>
          <Col span={6}>
            <Slider 
              min={0.0001} 
              max={0.01} 
              step={0.0001} 
              value={params.springStiffness} 
              onChange={v => handleChange('springStiffness', v)} 
              disabled={running || !params.hasSpring} 
              style={{ width: 100 }} 
            />
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ marginTop: 12 }}>
          <Col span={6}>弹簧长度:</Col>
          <Col span={18}>
            <Slider 
              min={0.1} 
              max={8} 
              step={0.1} 
              value={params.springLength} 
              onChange={v => handleChange('springLength', v)} 
              disabled={running || !params.hasSpring} 
            />
          </Col>
        </Row>
      </div>

      <Row style={{ marginTop: 16 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={() => setRunning(true)} disabled={running} style={{ marginRight: 12 }}>开始实验</Button>
          <Button onClick={handlePause} disabled={!running} style={{ marginRight: 12 }}>
            {paused ? '继续' : '暂停'}
          </Button>
          <Button onClick={handleReset} disabled={!running}>重置</Button>
        </Col>
      </Row>
    </div>
  );
} 