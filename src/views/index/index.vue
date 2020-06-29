<template>
  <div class="index-container">
    <el-row :gutter="15">
      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>访问量</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="fwl"
          />
          <div class="bottom">
            <span
              >日均访问量:

              <vab-count
                :start-val="config1.startVal"
                :end-val="config1.endVal"
                :duration="config1.duration"
                :separator="config1.separator"
                :prefix="config1.prefix"
                :suffix="config1.suffix"
                :decimals="config1.decimals"
              />
            </span>
          </div>
        </el-card>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>授权数</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="sqs"
          />
          <div class="bottom">
            <span
              >总授权数:
              <vab-count
                :start-val="config2.startVal"
                :end-val="config2.endVal"
                :duration="config2.duration"
                :separator="config2.separator"
                :prefix="config2.prefix"
                :suffix="config2.suffix"
                :decimals="config2.decimals"
            /></span>
          </div>
        </el-card>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card shadow="never">
          <div slot="header">
            <span>词云</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="cy"
            @zr:click="handleZrClick"
            @click="handleClick"
          />
          <div class="bottom">
            <span
              >词云数量:<vab-count
                :start-val="config3.startVal"
                :end-val="config3.endVal"
                :duration="config3.duration"
                :separator="config3.separator"
                :prefix="config3.prefix"
                :suffix="config3.suffix"
                :decimals="config3.decimals"
            /></span>
          </div>
        </el-card>
      </el-col> -->

      <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-col
          v-for="(item, index) in iconList"
          :key="index"
          :xs="12"
          :sm="6"
          :md="3"
          :lg="3"
          :xl="3"
        >
          <app-link :to="item.link" target="_blank">
            <el-card class="icon-panel" shadow="never">
              <vab-icon
                :style="{ color: item.color }"
                :icon="['fas', item.icon]"
              ></vab-icon>
              <p>{{ item.title }}</p>
            </el-card>
          </app-link>
        </el-col>
      </el-col> -->

      <!-- 网吧统计 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span class="card-title">网吧统计</span>
            <el-button style="float: right; padding: 3px 0;" type="text"
              >直属网吧</el-button
            >
          </div>
          <net-bar :gutter="15">
            <el-col
              v-for="(item, index) in cySensusList"
              :key="index"
              :xs="24"
              :sm="12"
              :md="6"
              :lg="6"
              :xl="6"
            >
              <net-bar-item
                :name="item.name"
                :number="item.number"
                :color="item.color"
                :border-right="index == cySensusList.length - 1 ? true : false"
              />
            </el-col>
          </net-bar>
        </el-card>
      </el-col>

      <!-- 图表展示 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card shadow="never" class="card">
          <div slot="header">
            <span class="card-title">终端统计</span>
            <el-button style="float: right; padding: 3px 0;" type="text"
              >渠道统计</el-button
            >
          </div>
          <net-bar :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3">
              <div class="netbar-item">
                <span>昨日在线终端数</span>
                <b>862</b>
              </div>
              <div class="netbar-item">
                <span>相比前日减少数</span>
                <b>
                  0
                  <el-tooltip
                    content="近二周终端统计"
                    placement="right-end"
                    effect="light"
                  >
                    <i class="iconfont icon-tubiaoxiajiangqushi"></i>
                  </el-tooltip>
                </b>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
              <vab-chart
                :autoresize="true"
                theme="vab-echarts-theme"
                :options="terminalDate"
              />
            </el-col>
          </net-bar>
        </el-card>
      </el-col>

      <!-- 联系我们 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
        <el-card shadow="never">
          <div slot="header">
            <span class="card-title">统计信息</span>
          </div>
          <net-bar :gutter="0">
            <el-col
              v-for="item in bottomLeftInfo"
              :key="item.id"
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
              :xl="8"
              class="info-item"
            >
              <h3 class="info-title">{{ item.name }}</h3>
              <ul>
                <li>
                  <span class="text-gray">联系人:</span>
                  {{ item.info.name }}
                </li>
                <li>
                  <span class="text-gray">联系电话:</span>
                  {{ item.info.phone }}
                </li>
                <li>
                  <span class="text-gray">联系邮箱:</span>
                  {{ item.info.email }}
                </li>
              </ul>
            </el-col>
          </net-bar>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span class="card-title">公告</span>
            <el-button style="float: right; padding: 3px 0;" type="text"
              >查看更多</el-button
            >
          </div>
          <ul class="dateList">
            <li>
              <a href="javascript:;" class="data-item"
                ><h5>公告1</h5>
                <span>2019-12-1</span></a
              >
            </li>
            <li>
              <a href="javascript:;" class="data-item"
                ><h5>公告2222222222222222222222222222222222222222222222222</h5>
                <span>2019-12-2</span></a
              >
            </li>
            <li>
              <a href="javascript:;" class="data-item"
                ><h5>公告3</h5>
                <span>2019-12-3</span></a
              >
            </li>
            <li>
              <a href="javascript:;" class="data-item"
                ><h5>公告4</h5>
                <span>2019-12-4</span></a
              >
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VabChart from '@/plugins/echarts'
// import VabCount from '@/plugins/vabCount'
import netBar from '@/components/content/NetBar'
import netBarItem from '@/components/content/NetBarItem'
import { dependencies, devDependencies } from '../../../package.json'
import { getList } from '@/api/changeLog'
import { getNoticeList } from '@/api/notice'
import { getRepos, getStargazers } from '@/api/github'

// 渐变图表颜色值
var data = {
  city: ['0', '4', '8', '12', '16', '20'],
  num: ['40', '60', '22', '85', '50', '40'],
}
// import AppLink from '@/layouts/components/Link'
export default {
  name: 'Index',
  components: {
    VabChart,
    // VabCount,
    netBar,
    netBarItem,
    // AppLink,
  },
  data() {
    return {
      updateTime: process.env.VUE_APP_UPDATE_TIME,
      nodeEnv: process.env.NODE_ENV,
      dependencies: dependencies,
      devDependencies: devDependencies,
      config1: {
        startVal: 0,
        endVal: this.$baseLodash.random(1000, 20000),
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      config2: {
        startVal: 0,
        endVal: this.$baseLodash.random(1000, 20000),
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      config3: {
        startVal: 0,
        endVal: this.$baseLodash.random(1000, 20000),
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      //更新日志
      reverse: true,
      activities: [],
      noticeList: [],
      //其他信息
      userAgent: navigator.userAgent,
      // 网吧统计
      cySensusList: [
        {
          id: 0,
          name: '累计网吧数',
          number: 24,
          color: '#67c23a',
        },
        {
          id: 1,
          name: '即将到期网吧',
          number: 0,
          color: '#1890ff',
        },
        {
          id: 3,
          name: '终端异常网吧',
          number: 3,
          color: '#f56c6c',
        },
        {
          id: 4,
          name: '登录异常网吧',
          number: 19,
          color: '#f56c6c',
        },
      ],
      // 近两周终端数
      terminalDate: {
        title: {
          textStyle: {
            color: '#303133',
            fontSize: 14,
          },
          text: '近两周终端统计',
          textAlign: 'left',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#588da8',
            },
            crossStyle: {
              color: 'rgba(0,0,0,.4)',
            },
            lineStyle: {
              color: 'rgba(0,0,0,.4)',
            },
          },
        },
        grid: {
          top: '13%',
          left: '0%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        legend: {
          right: 0,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [
              '06-12',
              '06-13',
              '06-14',
              '06-15',
              '06-16',
              '06-17',
              '06-18',
              '06-19',
            ],
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              formatter: '{value}',
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(31,142,241,.5)',
                width: 1,
                type: 'solid',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
            },
            splitLine: {
              lineStyle: {
                opacity: 0,
              },
            },
          },
        ],
        series: [
          {
            // name: '安装终端数',
            // type: 'line',
            // data: [10, 52, 20, 33, 39, 33, 22, 10, 22, 23, 13, 29],
            // smooth: true,
            // itemStyle:{
            //   color:'#1F8EF1',

            name: '安装终端数',
            type: 'line',
            smooth: true,
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 8,
            lineStyle: {
              normal: {
                color: '#D048B6', // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
              color: '#D048B6',
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: [' {a|{c}%}'].join(','),
                rich: {
                  a: {
                    color: '#fff',
                    align: 'center',
                  },
                },
              },
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(124, 128, 244,.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(124, 128, 244, 0)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: [10, 52, 20, 33, 39, 33, 22, 10, 22, 23, 13, 29],
          },
          // {
          //   name: '在线终端数',
          //   type: 'line',
          //   data: [20, 12, 30, 23, 31, 13, 32, 12, 12, 13, 13, 29],
          //   smooth: true,
          // },

          {
            name: '在线终端数',
            type: 'line',
            smooth: true,
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 8,
            lineStyle: {
              normal: {
                color: '#1F8EF1', // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
              color: '#1F8EF1',
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: [' {a|{c}%}'].join(','),
                rich: {
                  a: {
                    color: '#fff',
                    align: 'center',
                  },
                },
              },
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(124, 128, 244,.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(124, 128, 244, 0)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: [20, 12, 30, 23, 31, 13, 32, 12, 12, 13, 13, 29],
          },
        ],
      },
      bottomLeftInfo: [
        {
          id: 0,
          name: '渠道经理',
          info: {
            name: '妹子1',
            phone: 16638245952,
            email: '',
          },
        },
        {
          id: 1,
          name: '技术支持',
          info: {
            name: '妹子2',
            phone: 16638245952,
            email: '1131634405@qq.com',
          },
        },
        {
          id: 2,
          name: '投诉处理',
          info: {
            name: '妹子3',
            phone: 16638245952,
            email: '1131634405@qq.com',
          },
        },
      ],
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {},
  methods: {
    handleClick(e) {
      this.$baseMessage(`点击了${e.name},这里可以写跳转`)
    },
    handleZrClick(e) {},
    handleChangeTheme() {
      this.$baseEventBus.$emit('theme')
    },
    fetchData() {
      getList().then((res) => {
        res.data.map((item, index) => {
          if (index === res.data.length - 1) {
            item.color = '#0bbd87'
          }
        })
        this.activities = res.data
      })
      getNoticeList().then((res) => {
        this.noticeList = res.data
      })
      /* getRepos({
        token: "1061286824f978ea3cf98b7b8ea26fe27ba7cea1",
      }).then((res) => {
        const per_page = Math.ceil(res.data.stargazers_count / 100);
        alert(per_page);
        getStargazers({
          token: "1061286824f978ea3cf98b7b8ea26fe27ba7cea1",
          page: 1,
          per_page: res.per_page,
        }).then((res) => {
          alert(JSON.stringify(res));
        });
      }); */
    },
  },
}
</script>
<style lang="scss" scoped>
.index-container {
  ::v-deep {
    .el-card__body {
      .echarts {
        width: 100%;
        height: 140px;
      }
    }
  }

  .card {
    min-height: 395px;

    ::v-deep {
      .el-card__body {
        .echarts {
          width: 100%;
          height: 305px;
        }
      }
    }
  }
  .first-row {
    height: 170px;
  }
  .bottom {
    height: 40px;
    padding-top: 20px;
    margin-top: 5px;
    color: #595959;
    text-align: left;
    border-top: 1px solid $base-border-color;
  }

  .table {
    width: 100%;
    color: #666;
    border-collapse: collapse;
    background-color: #fff;

    td {
      position: relative;
      min-height: 20px;
      padding: 9px 15px;
      font-size: 14px;
      line-height: 20px;
      border: 1px solid #e6e6e6;

      &:first-child {
        width: 30%;
        text-align: left;
      }
    }
  }

  .icon-panel {
    text-align: center;
    cursor: pointer;

    svg {
      font-size: 40px;
    }

    p {
      margin-top: 20px;
    }
  }

  .bottom-btn {
    float: right;
    margin-top: 5px;

    button {
      margin: 5px 0 5px 10px;
    }
  }
  .el-timeline {
    height: 300px;
    overflow-x: hidden;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }
  .header-container {
    display: flex;
    justify-content: space-between;
  }
  .header-part {
    flex: 1;
    font-size: 18px;
  }
  .header-part h2 {
    font-size: 32px;
    color: #333;
    padding-top: 18px;
  }
  .cart-tips {
    text-align: right;
    padding-right: 30px;
  }
  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: $base-color-default2;
  }
  .netbar-item {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    text-align: left;
    color: $base-color-default2;
    padding-bottom: 40px;
  }
  .netbar-item b {
    font-size: 24px;
    line-height: 2;
    color: $base-color-default2;
    font-weight: normal;
  }
  .netbar-item b i {
    font-size: 24px;
  }
  .netbar-item b .icon-tubiaoxiajiangqushi {
    color: $base-color-red;
  }
  .netbar-item b .icon-tubiaoshangshengqushi {
    color: $base-color-green;
  }
  .info-item {
    position: relative;
  }
  .info-title {
    font-weight: 700;
    line-height: 40px;
    font-size: 15px;
  }
  .info-item ul {
    list-style: none;
  }
  .info-item ul li {
    line-height: 2;
  }
  .info-item:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 1px;
    height: calc(100% + 30px);
    right: 20px;
    top: -15px;
    display: block;
  }
  .dateList {
    background: #272a3d;
    height: 124px;
  }
  .dateList li {
    transition: all 0.3s;
    cursor: pointer;
    line-height: 1;
    padding-bottom: 19px;
  }
  .data-item {
    display: flex;
    justify-content: space-between;
    color: #989ba9;
    align-items: center;
  }
  .data-item h5 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-bottom: 1px;
    border-bottom: 1px solid transparent;
    font-weight: normal;
    font-size: 14px;
  }
  .data-item span {
    text-align: right;
    opacity: 0.7;
    font-size: 12px;
    -ms-flex-preferred-size: 66px;
    flex-basis: 66px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }
  .dateList li:hover h5 {
    color: #ffffff;
    text-decoration: underline;
  }
}
</style>
