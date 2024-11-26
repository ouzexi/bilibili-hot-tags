// pages/api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const url = 'http://139.9.177.72/ouzx'; // 目标 URL

    try {
        const response = await fetch(url, {
            method: req.method, // 使用相同的 HTTP 方法
            headers: {
                ...req.headers, // 转发请求头
                'Content-Type': 'application/json', // 设置内容类型
            },
            body: req.method === 'POST' ? JSON.stringify(req.body) : null, // 仅在 POST 请求中发送请求体
        });

        const data = await response.json(); // 获取响应数据
        res.status(response.status).json(data); // 返回响应
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // 错误处理
    }
}