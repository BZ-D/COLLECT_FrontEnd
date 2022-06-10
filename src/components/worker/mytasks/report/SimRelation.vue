<template>
  <div>

    <div style="margin-top: 20px; display: flex; justify-content: center;">
      <el-row type="flex" style="width: 60%;">
        <el-button type="info" icon="el-icon-back"
                   @click="returnReport" plain>
          返回报告
        </el-button>
      </el-row>
    </div>

    <el-main class="report-relation-outer-box">
      <div class="title">
        <img src="../../../../assets/image/sim-relation.png" alt="" style="width: 180px; margin-bottom: 20px;">
      </div>
      <el-row>
        <el-col class="chart-area" :span="15" v-loading="loading">
          <div id="chart"></div>
        </el-col>
        <el-col class="description-area" :span="8" v-loading="loading">
          <div class="title" style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">说明</div>
          <div class="description-content-area">
            <span class="sub-report-num">相似报告份数：<strong>{{ this.hasSimReports ? this.similarityList.length : 0 }}</strong></span><br><br>
            <span style="color: #bd0f0f">红色</span><span>表示当前报告节点</span><br><br>
            <span style="color: #6783ec">蓝色</span><span>表示相似报告节点</span><br><br>
            <span>相似报告节点半径越大</span><br><br>
            <span>表示其与当前报告相似度越高</span><br><br>
            <span>点击<span style="color: #397fea">相似报告</span>节点协作该报告</span><br><br>
            <span>您还可以进行缩放和拖拽</span>
          </div>
        </el-col>
      </el-row>
    </el-main>

  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "SimRelation",

  data() {
    return {
      loading: true,
      chart: null,
      username: '',
      similarityList: [],
      hasSimReports: false
    }
  },

  created() {
    this.getSimList();
  },

  mounted() {
    window.addEventListener('resize', this.resizeHandler);
    this.initEcharts();
    this.loading = false;
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

    getSimList() {
      const simList = JSON.parse(sessionStorage.getItem('simList'));
      for (const sim of simList) {
        this.similarityList.push(sim);
      }
      console.log(this.similarityList)

    },

    initEcharts() {
      const mainContainer = document.getElementById('chart');  // 设置dom
      mainContainer.style.width = window.innerWidth * 0.34 + 'px';
      mainContainer.style.height = '450px';
      this.chart = echarts.init(mainContainer);  // 初始化echarts

      let nodes = [
        {
          reportId: this.$route.query.reportid,
          id: "1",
          category: 0,  // 0: 当前报告，1: 其他报告
          symbolSize: 30,  // 节点大小
          url: `/worker/cooperation/supplement/detail?taskid=${this.$route.query.taskid}&reportid=${this.$route.query.reportid}`,
          itemStyle: {
            color: '#bb2727',
          }
        }
      ];
      let links = [];

      if (this.similarityList.length === 1 && this.similarityList[0].reportid.toString() === this.$route.query.reportid) {
        // 没有其他协作报告
      } else {
        this.hasSimReports = true;
        let id = 2;
        // 推入所有其他报告相似度
        for (const sim of this.similarityList) {
          nodes.push({
            textSim: sim.textSimilarity,
            imageSim: sim.picSimilarity,
            reportId: sim.reportid,
            allSim: (sim.textSimilarity + sim.picSimilarity) * 50,  // 综合相似度，目前是文本图像的平均
            id: id.toString(),
            url: `/worker/cooperation/supplement/detail?taskid=${this.$route.query.taskid}&reportid=${sim.reportid}`,
            category: 1,
            symbolSize: 5 + (sim.textSimilarity + sim.picSimilarity) * 35
          });
          id++;
        }

        for (let i = 1; i < nodes.length; i++) {
          links.push({
            source: "1",
            target: nodes[i].id,
            relation: {
              name: '相似',
              sim: nodes[i].allSim.toFixed(2) + '%'
            }
          })
        }
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
            data: nodes,
            links: links,
            edgeLabel: { //边的设置
              show: true,
              position: "middle",
              fontSize: 11,
              formatter: (params) => {
                return params.data.relation.sim;
              },
            },
            label: {
              show: true,
              position: "top",
              formatter: (params) => {
                if (params.data.id === '1') {
                  return '当前报告';
                }
                return '相似报告' + params.data.reportId;
              },
              distance: 5,
              fontSize: 12,
              color: '#4d4d4d',
              align: "center",
            },
            edgeSymbol: ["none", "arrow"], //边两边的类型
            force: {
              repulsion: 100,
              gravity: 0.01,
              edgeLength: 180,
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
          if (that.$route.query.qualified !== 'true') {
            if (params.data.id === '1') that.$message.error('当前报告审查未通过，无法补充，请选择修改您的报告或补充其他报告！')
            else that.$router.push(params.data.url + `&childid=${that.$route.query.reportid}`);
          } else {
            that.$router.push(params.data.url + `&childid=${-1}`);
          }
        }
      })
    },

    formatterHover(params) {
      // console.log(params)
      if (params.dataType === 'node') {
        const reportType = params.data.category === 0 ? '当前报告' : '相似报告';

        if (reportType === '当前报告') {
          return '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;">类型：'
              + '<span style="color:#bd0f0f">' + reportType + '</span><br>'
              + '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;color:#bd0f0f">点击进行报告补充</span>';
        } else {
          const text = params.data.textSim, image = params.data.imageSim;

          return '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;">类型：'
              + '<span style="color:#6783ec">' + reportType + '</span><br>'
              + '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;">文本相似度：<strong>' + (text * 100).toFixed(2) + '%</strong></span><br>'
              + '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;">图像相似度：<strong>' + (image * 100).toFixed(2) + '%</strong></span><br>'
              + '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;font-size: 14px;color:#6783ec">点击进行报告补充</span>';
        }
      }
    },

    returnReport() {
      this.$router.push('/worker/mytasks/report/' + this.$route.query.taskid);
    }

  }
}
</script>

<style scoped>

.report-relation-outer-box,
.chart-area,
.description-area {
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
