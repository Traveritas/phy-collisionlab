import axios from 'axios';

// 你可以将此处的 URL 替换为实际大模型 API 地址
const API_URL = '/api/ai-feedback';

export async function getAIFeedback(text) {
  // 模拟请求，实际可用如下代码：
  // const res = await axios.post(API_URL, { text });
  // return res.data.result;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        resolve('【AI总结】你认真完成了实验，描述了现象并进行了反思，具备良好的科学探究能力。');
      } else {
        reject(new Error('timeout'));
      }
    }, 1200);
  });
} 