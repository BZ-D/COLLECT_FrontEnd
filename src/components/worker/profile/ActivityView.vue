<template>
  <div id="container" style=" width: 100%; height: 200px;"></div>
</template>

<script>
import {getActivityCount} from "@/api/worker";
import * as echarts from 'echarts'

export default {
  name: "ActivityView",
  mounted() {
    this.initDate();
  },
  data() {
    return {
      contributeDate: [],
      blogContributeCount: [],
    }
  },
  created() {

  },
  methods: {
    initDate: function() {

      getActivityCount(sessionStorage.getItem("userid")).then(response => {
        var max=0;
        if(response.code === 200) {
          var activityCount = response.data.activityCount;
          console.log(response.data);
          let chart = echarts.init(document.getElementById('container'))
          var x=['','','','','','','','','','','','','','','','','','','',''];
          var y=['','','','','',''];
          var dataInChart=[];
          for(var index=0;index<120;index++){
            var temp=[];
            temp.push(5-index%6);
            temp.push(Math.floor(index/6));
            if(activityCount[index][1]>max)
              max=activityCount[index][1];
            temp.push(activityCount[index][1]);
            temp.push(activityCount[index][0]);
            dataInChart.push(temp);
          }
          dataInChart=dataInChart.map(function (item){
            return [item[1],item[0],item[2]||'-',item[3],item[2]||'-'];
          });
          var option = {
            title: {
              top: 0,
              text: '您的活跃度',
              subtext: '120天内在COLLECT平台的总活跃度：'+response.data.sum,
              left: 'center',
              textStyle: {
                color: '#000'
              }
            },
            tooltip : {
              position: 'top',
              formatter:function(params){
                return (params.data[3] +  '<br>活跃度：' + params.data[2])
              }
            },
            animation: true,
            grid: {
              left:0,
              right:0,
              height: '70%',
              top: '25%'
            },
            xAxis: {
              type: 'category',
              data: x,
              splitArea: {
                show: true
              },
              "axisLine":{
                "show":false
              },
              axisTick: {
                show:false
              }
            },
            yAxis: {
              type: 'category',
              data: y,
              splitArea: {
                show: true
              },
              "axisLine":{
                "show":false
              },
              axisTick: {
                show:false
              }
            },
            visualMap: {
              min: 0,
              max: max,
              // grid 区域包含坐标轴的刻度标签
              calculable: true,
              orient: 'horizontal',
              left: 'center',
              bottom: '15%',
              show: false,
              inRange: {
                color: ['#b4eff8', '#3616c5']
              },
            },
            series: [{
              name: '活跃度',
              type: 'heatmap',
              data: dataInChart,
              label: {
                show: true
              },
              // 当鼠标移到某个值上强调显示的格式（通过visualMap可以明显的看出这个效果）
              emphasis: {
                itemStyle: {
                  // 图形阴影的模糊大小
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          };

          chart.setOption(option);

        }

      });
    }
  }
}
</script>

<style scoped>

</style>