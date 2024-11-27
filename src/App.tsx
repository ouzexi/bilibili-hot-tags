import './App.css'
import { Form, Button, Input, Select, Spin, message } from 'antd'
import { Chart } from '@antv/g2';
import type { FormProps } from 'antd'
import type { SearchType } from './enum';
import { OrderOptions, ResponseEnum } from './enum'; 
import { useEffect, useState } from 'react';
import API from './api';
import { NoticeType } from 'antd/es/message/interface';
// import { TransferRes } from './utils';

type TCData = {
  item: string
  count: number
}

const mockData: Array<TCData> = [
  { item: '模拟0', count: 10 },
  { item: '模拟1', count: 10 },
  { item: '模拟2', count: 10 },
  { item: '模拟3', count: 10 },
  { item: '模拟4', count: 10 },
  { item: '模拟5', count: 10 },
  { item: '模拟6', count: 10 },
  { item: '模拟7', count: 10 },
  { item: '模拟8', count: 10 },
  { item: '模拟9', count: 10 }
]

function App() {
  const [chart, setChart] = useState<Chart>()

  const [loading, setLoading] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const showTips = (errMsg: string, type: NoticeType = 'error') => {
    messageApi.open({
      type,
      content: errMsg,
    });
  }

  const renderChart = (cData: Array<TCData>) => {
    const chartIns = new Chart({
      container: 'chart-container',
      type: 'view',
      autoFit: true
    });

    chartIns.coordinate({ type: 'theta', outerRadius: 0.8, innerRadius: 0.5 });
    chartIns
    .interval()
    // 接口失效，模拟数据
    .data(cData)
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
    
    chartIns.render();

    setChart(chartIns)
  }

  const rerenderChart = (cData: Array<TCData>) => {
    chart && chart.changeData(cData)
  }

  useEffect(() => {
    renderChart([])
  }, [])

  const onFinish: FormProps<SearchType>['onFinish'] = (params) => {
    setLoading(true)
    API.FetchVideos(params)
      .then(res => {
        if(res.status === ResponseEnum.SUCCESS && res.data) {
          const { data: cData } = res.data;
          rerenderChart(cData)
        } else {
          showTips(res.message)
          rerenderChart(mockData)
        }
      })
      .catch(err => {
        let errMsg = err.message
        if(err.status === ResponseEnum.BAD_GATEWAY) {
          errMsg = '访问来源不合法！'
        } else if(err.status === ResponseEnum.FAIL) {
          errMsg = '请求频繁，请10s后再试！'
        }
        showTips(errMsg)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const handleUpdateCookie = () => {
    const cookieVal = prompt('如果搜索失败且出现风控提示，则需要手动更新Cookie：\n\n1、请前往B站：https://www.bilibili.com/\n2、打开控制台输入：copy(document.cookie)\n3、点击回车后粘贴内容到此输入框点击确定')
    if(!cookieVal) {
      showTips('请输入cookie！')
      return
    }
    API.FetchUpdateCookie(cookieVal)
      .then(res => {
        if(res.status === ResponseEnum.SUCCESS) {
          showTips('更新Cookie成功', 'success')
        } else {
          showTips(res.message)
        }
      })
  }

  return (
    <>
      { contextHolder }
      <Button className='update-cookie-btn' size='small' onClick={handleUpdateCookie}>更新Cookie</Button>
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
