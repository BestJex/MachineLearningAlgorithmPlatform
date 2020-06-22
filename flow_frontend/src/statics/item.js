import okSvg from '@/assets/icons/ok.svg'
import bgImg from '@/assets/bg.jpg'
export default {
  tree_list: [
    {
      is_menu: true,
      name: '文件处理',
      children: [
        {
          name: '上传文件',
          size: '170*34',
          type: 'node',
          shape: 'customNode',
          color: '#1890ff',
          image: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
          stateImage: okSvg,
          node_detail: [
            {
              type: 'input',
              name: 'name',
              label: '名称',
              value: '上传文件'
            },
            {
              type: 'upload',
              name: 'upload',
              label: '上传',
              value: []
            }
          ],
          point_detail: [
            {
              type: 'output',
              proportion: 0.5,
              func: ''
            }
          ]
        }
      ]
    },
    {
      is_menu: true,
      name: '聚类算法',
      children: [
        {
          name: 'K-means',
          size: '170*34',
          type: 'node',
          shape: 'customNode',
          color: '#1890ff',
          image: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
          stateImage: okSvg,
          node_detail: [
            {
              type: 'input',
              name: 'name',
              label: '名称',
              value: 'K-means'
            },
            {
              type: 'inputNumber',
              name: 'k_size',
              label: 'K（簇数）',
              value: 1
            }
          ],
          point_detail: [
            {
              type: 'input',
              proportion: 0.5,
              func: ''
            },
            {
              type: 'output',
              proportion: 0.5,
              func: ''
            }
          ]
        }
      ]
    },
    {
      is_menu: true,
      name: '图形化',
      children: [
        {
          name: 'csv显示',
          size: '170*34',
          type: 'node',
          shape: 'customNode',
          color: '#1890ff',
          image: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
          stateImage: okSvg,
          node_detail: [
            {
              type: 'input',
              name: 'name',
              label: '名称',
              value: 'csv显示'
            }
          ],
          point_detail: [
            {
              type: 'input',
              proportion: 0.5,
              func: ''
            }
          ]
        }
      ]
    }
  ],
  _tree_list: [
    {
      name: '朴素贝叶斯',
      label: '朴素贝叶斯',
      is_menu: true,
      children: [
        {
          name: '背景图片节点',
          label: '背景图片节点',
          size: '170*34',
          type: 'node',
          x: 0,
          y: 0,
          shape: 'customNode',
          color: '#1890ff',
          image:
            'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
          stateImage: okSvg,
          backImage: bgImg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          node_detail: [
            {
              type: 'input',
              name: 'name',
              label: '名称',
              value: '背景图片节点'
            },
            {
              type: 'input',
              name: 'path',
              label: '路径',
              value: 'C:/Users/Chris/Document'
            },
            {
              type: 'slider',
              name: 'size',
              label: '大小',
              value: 0
            }
          ],
          point_detail: [
            {
              type: 'input',
              proportion: 0.5,
              func: 'select-all'
            },
            {
              type: 'output',
              proportion: 0.5,
              func: 'select-all'
            }
          ]
        }
      ]
    },
    {
      name: '文件处理',
      label: '文件处理',
      is_menu: true,
      children: [
        {
          name: '上传文件',
          label: '上传文件',
          size: '170*34',
          type: 'node',
          x: 0,
          y: 0,
          shape: 'customNode',
          color: '#1890ff',
          image:
            'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          isDoingStart: true,
          node_detail: [
            {
              type: 'input',
              name: 'name',
              label: '名称',
              value: '上传文件'
            },
            {
              type: 'input',
              name: 'path',
              label: '路径',
              value: 'C:/Users/Chris/Document'
            },
            {
              type: 'slider',
              name: 'size',
              label: '大小',
              value: 0
            },
            {
              type: 'upload',
              name: 'upload',
              label: '上传',
              value:
                [{
                  name: 'IMG_3857.JPG',
                  path: 'C:/Users/Chris/Document/IMG_3857.JPG'
                }]
            }
          ],
          point_detail: [
            {
              type: 'input',
              proportion: 0.5,
              func: 'select-all'
            },
            {
              type: 'output',
              proportion: 0.5,
              func: 'select-all'
            }
          ]
        },
        {
          name: '双输出节点',
          label: '双输出节点',
          size: '170*34',
          type: 'node',
          x: 0,
          y: 0,
          shape: 'customNode',
          color: '#1890ff',
          image:
            'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.4], [1, 0.6]],
          node_detail: [
            {
              type: 'input',
              name: 'name',
              label: '名称',
              value: '双输出节点'
            },
            {
              type: 'input',
              name: 'path',
              label: '路径',
              value: 'C:/Users/Chris/Document'
            },
            {
              type: 'slider',
              name: 'size',
              label: '大小',
              value: 0
            }
          ],
          point_detail: [
            {
              type: 'input',
              proportion: 0.5,
              func: 'select-all'
            },
            {
              type: 'output',
              proportion: 0.4,
              func: 'select-all'
            },
            {
              type: 'output',
              proportion: 0.6,
              func: 'select-all'
            }
          ]
        },
        {
          name: '大型节点',
          label: '大型节点',
          size: '340*34',
          type: 'node',
          x: 0,
          y: 0,
          shape: 'customNode',
          color: '#1890ff',
          image:
            'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          node_detail: [
            {
              type: 'input',
              name: 'name',
              label: '名称',
              value: '大型节点'
            },
            {
              type: 'input',
              name: 'path',
              label: '路径',
              value: 'C:/Users/Chris/Document'
            },
            {
              type: 'slider',
              name: 'size',
              label: '大小',
              value: 0
            }
          ],
          point_detail: [
            {
              type: 'input',
              proportion: 0.5,
              func: 'select-all'
            },
            {
              type: 'output',
              proportion: 0.5,
              func: 'select-all'
            }
          ]
        }
      ]
    }
  ],
}