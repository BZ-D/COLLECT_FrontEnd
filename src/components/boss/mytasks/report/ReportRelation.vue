<template>
  <div>

    <div style="margin-top: 20px; display: flex; justify-content: center;">
      <el-row type="flex" style="width: 60%;">
        <el-button type="info" icon="el-icon-back"
                   @click="returnReportList" plain>
          返回报告列表</el-button>
      </el-row>
    </div>

    <el-main class="report-relation-outer-box">
      <div class="title">
        <img src="../../../../assets/image/report-relation.png" alt="" style="width: 150px; margin-bottom: 20px;">
      </div>
      <el-row>
        <el-col class="chart-area" :span="15" v-loading="loading">
          <div id="chart"></div>
        </el-col>
        <el-col class="description-area" :span="8" v-loading="loading">
          <div class="title" style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">说明</div>
          <div class="description-content-area">
            <span class="main-report-author">主报告作者：<span style="color: #bd0f0f">{{ this.username }}</span></span><br><br>
            <span class="sub-report-num">协作报告份数：<strong>{{ this.subReportList.length }}</strong></span><br><br>
            <span style="color: #bd0f0f">红色</span><span>表示主报告节点</span><br><br>
            <span style="color: #6783ec">蓝色</span><span>表示协作报告节点</span><br><br>
            <span>若关系图中没有蓝色节点</span><br><br>
            <span>说明目前还没有协作者</span><br><br>
            <span><strong>点击</strong>对应的节点查看详情</span><br><br>
            <span>点击<span style="color: #bd0f0f">主报告</span>节点查看报告评价</span><br><br>
            <span>您还可以进行缩放和拖拽</span>
          </div>
        </el-col>
      </el-row>
    </el-main>

  </div>
</template>

<script>
import * as echarts from 'echarts';
import {getReportByReportID, getSubReportsByReportID} from "@/api/report";

export default {
  name: "ReportRelation",

  data() {
    return {
      loading: true,
      chart: null,
      reportId: -1,
      username: '',
      subReportList: []
    }
  },

  created() {
    this.getReport();
    this.getSubReports();
    this.reportId = this.$route.params.reportid;
    this.loading = false;
  },

  mounted() {
    window.addEventListener('resize', this.resizeHandler);
  },

  activated() {
    if (this.reportId !== this.$route.params.reportid) {
      this.chart.dispose();
      this.subReportList = [];
      this.getReport();
      this.getSubReports();
      this.reportId = this.$route.params.reportid;
    }
  },

  beforeDestroy() {
    // 销毁监听事件
    window.removeEventListener('resize', this.resizeHandler)
    // 销毁 Echarts 实例
    this.chart.dispose();
  },

  methods: {
    resizeHandler() {
      let mainContainer = document.getElementById('chart');
      mainContainer.style.width = window.innerWidth * 0.34 + 'px';
      mainContainer.style.height = '450px';
      this.chart.resize();
    },

    async getReport() {
      await getReportByReportID(this.$route.params.reportid).then(res => {
        console.log(res)
        this.username = res.data['workername'];
      })
    },

    async getSubReports() {
      await getSubReportsByReportID(this.$route.params.reportid).then(res => {
        res.data.forEach(obj => {
          let tmp = {};
          for (let key of Object.keys(obj)) {
            if (key !== 'type') {
              tmp[key] = obj[key];
            }
          }
          this.subReportList.push(tmp);
        })
        // const list = res.data.array();
        // for (const r of list) {
        //   this.subReportList.push(r);
        // }
        console.log(this.subReportList)
      }).then(() => {
        this.initEcharts();
      })
    },

    initEcharts() {
      const mainContainer = document.getElementById('chart');  // 设置dom
      mainContainer.style.width = window.innerWidth * 0.34 + 'px';
      mainContainer.style.height = '450px';
      this.chart = echarts.init(mainContainer);  // 初始化echarts

      let nodes = [
        {
          username: this.username,
          reportId: this.$route.params.reportid,
          id: "1",
          url: '/boss/mytasks/report/' + this.$route.params.reportid,
          category: 0,  // 0: 主报告，1: 协作报告
          symbolSize: 60,  // 节点大小
          itemStyle: {
            color: '#bb2727',
          }
        }
      ];
      console.log(nodes)
      let id = 2;
      // 推入所有子报告
      for (const r of this.subReportList) {
        nodes.push({
          username: r.userName,
          reportId: r.reportId,
          id: id.toString(),
          url: '/boss/mytasks/subreport/' + r.reportId,
          category: 1,
          symbolSize: 40
        });
        id++;
      }

      let links = [];
      for (let i = 1; i < nodes.length; i++) {
        links.push({
          source: "1",
          target: nodes[i].id,
          relation: {
            name: '协作'
          }
        })
      }

      let option = {
        tooltip: {
          formatter: this.formatterHover,
          enterable: true
        },

        series: [
          {
            type: 'graph',
            layout: 'force',
            focus: 'adjacency',
            data: nodes,
            links: links,
            autoCurveness: 0.01, //多条边的时候，自动计算曲率
            edgeLabel: { //边的设置
              show: true,
              position: "middle",
              fontSize: 14,
              formatter: (params) => {
                return params.data.relation.name;
              },
            },
            label: {
              show: true,
              position: "top",
              formatter: (params) => {
                return params.data.username;
              },
              distance: 5,
              fontSize: 12,
              color: '#4d4d4d',
              align: "center",
            },
            edgeSymbol: ["none", "arrow"], //边两边的类型
            force: {
              repulsion: 100,
              gravity: 0.008,
              edgeLength: 160,
              layoutAnimation: false,
            },
            roam: true,  // 水平漫游 + 缩放
          }
        ]
      };
      this.chart.setOption(option);

      const that = this;
      this.chart.on('click', function (params) {
        if (params.dataType === 'node') {
          that.$store.commit('setReportIdOfSubReport', that.$route.params.reportid);
          that.$router.push(params.data.url);
        }
      })
    },

    formatterHover(params) {
      if (params.dataType === 'node') {
        const reportType = params.data.category === 0 ? '主报告' : '协作报告';
        const author = params.data.username;

        if (reportType === '主报告') {
          return '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;">类型：'
              + '<span style="color:#bd0f0f">' + reportType + '</span><br>'
              + '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;">创作者：' + author + '</span><br>'
              + '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;color:#bd0f0f">点击查看报告详情</span>';
        } else {
          return '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;">类型：'
              + '<span style="color:#6783ec">' + reportType + '</span><br>'
              + '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;">创作者：' + author + '</span><br>'
              + '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;color:#6783ec">点击查看报告详情</span>';
        }
      }
    },

    returnReportList() {
      if (this.$store.state.taskIdOfReportList !== -1) {
        this.$router.push('/boss/mytasks/reportlist/' + this.$store.state.taskIdOfReportList);
      } else {
        this.$router.push('/boss/mytasks/executing');
      }
    }

  }
}
</script>

<style scoped>

.report-relation-outer-box,
.chart-area,
.description-area
{
  border-radius: 24px;
  box-shadow: rgba(90, 106, 140, 0.3) 0px 0px 6px;
}

.report-relation-outer-box {
  width: 60%;
  background: #fff;
  min-height: 600px;

  padding: 2% 2.5%;
  margin: 25px auto 20px;

  display: flex;
  flex-direction: column;
}

.chart-area {
  min-height: 450px;
  background: #f8f8f8;
}

.description-area {
  margin-left: 2%;
  background: #f8f8f8;
  padding: 20px 20px 30px;
}

.description-content-area span {
  margin-bottom: 20px;
}

</style>
