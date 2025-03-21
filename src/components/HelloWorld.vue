<template>
  <div class="chart" id="china_map">
  </div>
</template>

<script>
// 按需引用
import * as echarts from 'echarts';

import chinaMap from './china'
echarts.registerMap('china', chinaMap);

export default {
  name: "china",
  data() {
    return {
      options: {
        tooltip: {
          show:false,
          triggerOn: "mousemove",   //mousemove、click
          padding:8,
          backgroundColor:'rgba(0,0,0,0.6)',
          borderWidth:0,
          textStyle:{
            color:'#fff',
            fontSize:12
          },
        },
       geo: {
          map: "china",
          roam: false,// 一定要关闭拖拽
          zoom: 1.0,
          center: [102, 36], // 调整地图位置
          aspectScale: 0.80, //长宽比
          label: {
            normal: {
              show: false, //关闭省份名展示
              fontSize: "10",
              color: "rgba(0,0,0,0.7)"
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#3c9ad2",
              borderColor: "#3c9ad2",
              borderWidth: 1, //设置外层边框
              shadowBlur: 6,
              shadowOffsetY: 12,
              shadowOffsetX: -5,
              shadowColor: "#3c9ad2"
            },
            emphasis: {
              areaColor: "#184cff",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 5,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },
        series:[
          {
            type: "map",
            map: "china",
            roam: false,
            zoom: 1.0,
            center: [102, 36],
            data:[],
            // geoIndex: 1,
            aspectScale: 0.80, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            itemStyle: {
              normal: {
                areaColor: "#3c9ad2",
                borderColor: "#3c9ad2",
                borderWidth: 0.5
              },
              emphasis: {
                areaColor: "#17008d",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 5,
                borderWidth: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      mapData:[]
    }
  },
  mounted() {
    this.$nextTick(()=> {
      this.initEchartMap()
      this.initChina()
    })
  
  },
  methods: {
    //初始化中国地图
    initEchartMap() {
      let mapDiv = document.getElementById('china_map');
      let myChart = echarts.init(mapDiv);
      myChart.setOption(this.options);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
          myChart.resize();
      });
    },
    initChina(){
      const result = [
        {countyName:'北京市', periodValue: "414",},
        {countyName:'山西省', periodValue: "440",},
        {countyName:'河北省', periodValue: "449"},
        {countyName:'河南省', periodValue: "448",},
        {countyName:'浙江省', periodValue: "448"},
        {countyName:'福建省', periodValue: "442"},
      ]
      result.forEach((item) => {
        if (item.countyName != undefined && item.countyName != ''&& item.periodValue!='0') {
          let countyName=item.countyName;
          countyName=countyName.replace("省","")
          countyName=countyName.replace("市","")
          let value = item.periodValue;
          countyName=countyName.replace("维吾尔自治区","")
          countyName=countyName.replace("回族自治区","")
          countyName=countyName.replace("壮族自治区","")
          countyName=countyName.replace("自治区","")
          this.mapData.push({"name":countyName, "count":value});
        }
      });
      console.log('11111',this.mapData)
      console.log('2222',chinaMap.features)
      var bb =  this.mapData.map(function(item) {
          return {
              name: item.name,
              count: item.count,
              itemStyle:item.itemStyle,
              // 需要为每个省份指定坐标，可以使用内置坐标库或自定义
              // 这里使用简单示例，实际需完善坐标数据
              value: chinaMap.features.find(
                  f => f.properties.name === item.name
              ).properties.cp
          };
      })
      console.log('---------===',bb)

     
      let mapDiv = document.getElementById('china_map');
      let myChart = echarts.init(mapDiv);
      var option = {
        series: [
          {
            type: "map",
            map: "china",
            roam: false,
            zoom: 1.0,
            center: [102, 36],
            aspectScale: 0.80, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 145, 180,1)',
                shadowColor: 'rgba(7, 65, 117,0.8)',
                shadowOffsetY:1,
                shadowBlur: 0,
                borderWidth: 2,
                areaColor: '#021543',
              },
              emphasis: {
                borderWidth: 0,
                borderColor: 'rgba(0, 145, 180,1)',
                shadowColor: 'rgba(255, 230, 175,0.5)',
                shadowBlur: 0,
                areaColor: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#1cfbfe',
                    },
                    {
                      offset: 1,
                      color: '#3348e7',
                    },
                  ],
                  false
                ),
              },
            }
          },
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', // 使用图钉形状
            symbolSize: [40, 50], // 调整图标大小
            label: {
                show: true,
                formatter: '', // 显示省份名称和数值
                color: '#fff',
                fontSize: 12,
                position: 'inside'
            },
            itemStyle: {
                color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(197,69,72,1)'
                        }, {
                            offset: 1, color: 'rgba(197,122,45,1)'
                        }],
                    },
            },
            data:bb
          }
        ]
      };
      myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
          myChart.resize();
      });
    },


  },
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
  background-color: beige;
  overflow: hidden;
  position: relative;
}

</style>
