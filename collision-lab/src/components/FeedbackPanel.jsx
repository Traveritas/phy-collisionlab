import React, { useContext, useState } from 'react';
import { Card, Input, Button, Spin, Alert } from 'antd';
import { ExperimentContext } from './context.jsx';
import { getAIFeedback } from '../api/aiFeedback';

const template =
  '请简要描述你的实验过程、观察到的现象和你的收获。例如：本次实验我设置了……，观察到……，我认为……。';

export default function FeedbackPanel() {
  const { feedback, setFeedback } = useContext(ExperimentContext);
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    setFeedback({ ...feedback, loading: true, error: null });
    try {
      const result = await getAIFeedback(input);
      setFeedback({ text: input, result, loading: false, error: null });
    } catch (e) {
      setFeedback({ text: input, result: '', loading: false, error: 'AI反馈超时或出错' });
    }
  };

  return (
    <Card title="实验反馈与总结" size="small" bordered={false}>
      <div style={{ marginBottom: 8, color: '#888', fontSize: 13 }}>{template}</div>
      <Input.TextArea
        rows={4}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="请输入你的实验过程与收获..."
        disabled={feedback.loading}
        style={{ marginBottom: 8 }}
      />
      <Button type="primary" onClick={handleSubmit} loading={feedback.loading} block>
        提交反馈
      </Button>
      {feedback.loading && <Spin style={{ marginTop: 12 }} />}
      {feedback.result && !feedback.loading && (
        <Alert
          message="AI学习总结与能力分析"
          description={feedback.result}
          type="success"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
      {feedback.error && (
        <Alert
          message="反馈失败"
          description={feedback.error}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Card>
  );
} 