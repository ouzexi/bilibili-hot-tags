import './App.css'
import { Form, Button, Input, Select, Spin, message } from 'antd'
import { Chart } from '@antv/g2';
import type { FormProps } from 'antd'
import type { SearchType } from './enum';
import { OrderOptions, ResponseEnum } from './enum'; 
import { useEffect, useState } from 'react';
import FetchVideos from './api';
import { TransferRes } from './utils';

const mockData = [
  { item: '标签1', count: 10 },
  { item: '标签2', count: 10 },
  { item: '标签3', count: 10 },
  { item: '标签4', count: 10 },
  { item: '标签5', count: 10 },
  { item: '标签6', count: 10 },
  { item: '标签7', count: 10 },
  { item: '标签8', count: 10 },
  { item: '标签9', count: 10 },
  { item: '标签10', count: 10 }
]

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<Array<any>>([])

  const [messageApi, contextHolder] = message.useMessage();

  const showErrorTips = (errMsg: string) => {
    messageApi.open({
      type: 'error',
      content: errMsg,
    });
  }

  const renderChart = () => {
    const chart = new Chart({
      container: 'chart-container',
      type: 'view',
      autoFit: true
    });
    chart.coordinate({ type: 'theta', outerRadius: 0.8, innerRadius: 0.5 });
  
    chart
    .interval()
    // 接口失效，模拟数据
    .data(chartData)
    .transform({ type: 'stackY' })
    .encode('y', 'count')
    .encode('color', 'item')
    .legend('color', { position: 'bottom', layout: { justifyContent: 'center' } })
    .label({
      position: 'outside',
      text: (data: {item: string, count: number}) => `${data.item}: ${data.count}`,
    })
    .tooltip((data) => ({
      name: data.item,
      value: data.count,
    }));
    
    chart.render();
  }

  const onFinish: FormProps<SearchType>['onFinish'] = (params) => {
    setLoading(true)
    FetchVideos(params)
      .then(res => {
        if(res.data?.code === ResponseEnum.SUCCESS) {
          const { message } = res.data;
          const fetchData = JSON.parse(message);
          const cData = TransferRes(fetchData)
          setChartData(cData)
        } else {
          showErrorTips(res.message)
          setChartData(mockData)
        }
      })
      .catch(err => {
        showErrorTips(err.message)
        setChartData(mockData)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  useEffect(() => {
    renderChart()
  })

  return (
    <>
      { contextHolder }
      <h1>B站视频热门标签👀</h1>
      <h4>Tips: 根据关键词进行搜索前20项视频，聚合统计次数最多的10个视频标签~🥳</h4>
      <div className="card">
      <Form size="large" initialValues={{ order: 'totalrank' }} onFinish={onFinish}>
        <Form.Item<SearchType> name="keyword" rules={[{ required: true, message: '请输入视频关键词😅' }]}>
          <Input placeholder='请输入视频关键词👀'/>
        </Form.Item>
        <Form.Item<SearchType> name="order">
          <Select options={OrderOptions} />
        </Form.Item>
        <Spin spinning={loading}>
          <Form.Item>
            <Button type="primary" htmlType="submit">搜索🔍</Button>
          </Form.Item>
        </Spin>
      </Form>
      </div>
      <div id="chart-container" />
      <p className="read-the-docs">
        Made by Ouzx
        <a href="http://139.9.177.72/">👉点我联系作者</a>
      </p>
    </>
  )
}

export default App
