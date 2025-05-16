<template>
    <div class="app-container">
      <!--    左边的按钮组-->
      <!-- <div class="button-wrapper">
        <div v-for="button in buttonGroup" :key="button.label">
          <div class="button" @click="click(button.type)">
            <div class="icon"><img class="btnIcon" :src="button.icon" alt="button.label"/></div>
            {{ button.label }}
          </div>
        </div>
      </div> -->
      <!--    右边的绘制区域-->
      <div id="flowWrap" ref="flowWrap" class="flow-wrapper">
        <div id="table-flow">
          <!--        对齐辅助线-->
          <div v-show="auxiliaryLine.isShowXLine" class="auxiliary-line-x"
               :style="{width: auxiliaryLinePos.width, top:auxiliaryLinePos.y + 'px', left: auxiliaryLinePos.offsetX + 'px'}"></div>
          <div v-show="auxiliaryLine.isShowYLine" class="auxiliary-line-y"
               :style="{height: auxiliaryLinePos.height, left:auxiliaryLinePos.x + 'px', top: auxiliaryLinePos.offsetY + 'px'}"></div>
          <TableNode
              :ref="node.name"
              v-for="node in json.nodes"
              :id="node.name"
              :key="node.name"
              :node="node"
              :seletedTable="seletedTable"
              @clickNode="clickTableNode"
              @clickclearNode="clearhighlightConnections"

          />
        </div>
        <div class="selected">
          <Select clearable v-model="seletedTable" style="width:300px" @on-change="changeSeleteValue">
              <Option :value="item.name" :label="item.name" v-for="(item,index) in json.nodes" :key="index">
                  <span>{{ item.name }}</span>
                  <span class="tableType" :style="{background:getTableTypeColor(item.type)}">{{ item.type }}</span>
              </Option>
          </Select>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import jsplumbModule from 'jsplumb'
  import commConfig from './config/jsplumbConfig'
  import buttonGroup from './config/buttonGroup'
  import buttonMethods from './methods/buttonMethods'
  import colorFields from './config/tableTypeMappingColor'
  import comm from './methods/comm'
  import $ from 'jquery'
  import TableNode from './components/TableNode'
  import sampleData from './config/sampleData.json'
import { Switch } from 'element-ui'
  
  const jsplumb = jsplumbModule.jsPlumb
  export default {
    name: 'Index',
    components: {
      TableNode
    },
    data() {
      return {
        seletedTable:'',
        jsplumbInstance: null,
        json: {
          nodes: [],
          edges: []
        },
        buttonGroup: buttonGroup,
        commConfig: commConfig,
        auxiliaryLine: {isShowXLine: false, isShowYLine: false},  //对齐辅助线是否显示
        auxiliaryLinePos: {width: '100%', height: '100%', offsetX: 0, offsetY: 0, x: 20, y: 20},
        minus: '-', //表名和列名的分割符号
        anchorArr: ['Left', 'Right'],//specified anchor
        commGrid: [5, 5],//节点移动最小距离
        activeConnections:[],
        activeConnectionsTo:[],
        pushTofileds:[],
        pushFromfileds:[],
        isSeek:true,
        isSeekFrom:true,
        activeFields:[],
        activeFieldsUp:[]
      };
    },
    mounted() {
      this.renderDefaultLineage()
    },
    beforeDestroy() {
      this.jsplumbInstance.reset()
    },
    methods: {
      changeSeleteValue(){
        console.log( this.$refs.flowWrap.offsetHeight)
        var topNum = this.$refs[this.seletedTable][0].node.top
        if(topNum <this.$refs.flowWrap.offsetHeight) return
        this.$refs.flowWrap.scrollTo({
          top: topNum,
        });
  
      },
      renderDefaultLineage() {
        this.json.nodes = sampleData.nodes
        this.json.edges = sampleData.edges
        this.init();
      },
      //初始化
      init() { 
        this.fixNodesPosition()
        //nextTick 立即更新DOM
        this.$nextTick(() => {
          this.initialize()
        })
      },
      //真正的初始化
      initialize() {
        jsplumb.ready(() => {
          //设置jsplumb实例、设置jsplumb默认配置、设置jsplumb容器
          this.jsplumbInstance = jsplumb.getInstance().importDefaults(commConfig)
          this.jsplumbInstance.setContainer('table-flow')
          // 先清除一下画布,防止缓存
          this.jsplumbInstance.reset();
  
          this.drawing(this.anchorArr)
  
          // 会使整个jsPlumb立即重绘。
          this.jsplumbInstance.setSuspendDrawing(false, true);
          // this.initPanZoom()
        })
      },
      // 绘制
      drawing(anchorArr) {
        if (this.json.nodes.length !== 0 && this.json.edges.length !== 0) {
          //1 绘制节点信息
          this.json.nodes.forEach(node => {

            //使节点可拖动
            this.draggableNode(node.name)
            node.fields.forEach(field => {
              //表字段添加端点
              this.addEndpoint(node.name.concat(this.minus, field.name), anchorArr)
              //表头添加端点
              this.addEndpoint(node.name.concat(this.minus,), anchorArr)
            })
          })
          //2 绘制节点间连线
          this.json.edges.forEach(edge => {
            let from = edge.from.name.concat(this.minus, edge.from.field, this.minus, "Right"),
                to = edge.to.name.concat(this.minus, edge.to.field, this.minus, "Left")
            this.connectEndpoint(from, to);
            //绑定事件 鼠标移到连线高亮关联列、线 ，暂时注释
            // this.jsplumbInstance.unbind("mouseover");
            // this.jsplumbInstance.bind("mouseover", conn => {
            //   const to = conn.targetId.split(this.minus)
            //   let activeNodes = this.findActiveNode(this.json.edges, to[0], to[1])
            //   activeNodes.forEach(an => {
            //     const full = an.tbName + this.minus + an.column
            //     console.log()
            //     this.jsplumbInstance.getConnections({
            //       source: full
            //     }).map(c => {
            //       c.setPaintStyle({
            //         stroke: '#1b1b1b'
            //       })
            //     })
            //     $("#" + an.tbName + "-cols")
            //         .find("#" + full)
            //         .css("background-color", '#1b1b1b');
            //      const connections = this.jsplumbInstance.getAllConnections()//How stupid！
            //     connections.map(c => {
            //       if (an.tbName === c.sourceId.split(this.minus)[0]) {
            //         if (full === c.sourceId) {
            //           c.setPaintStyle({
            //             stroke:'#1b1b1b'
            //           })
            //         }
            //       }
            //     })
            //   })
            // });
            //鼠标移走后恢复
          //   this.jsplumbInstance.unbind('mouseout');
          //   this.jsplumbInstance.bind("mouseout", conn => {
          //     const to = conn.targetId.split(this.minus)
          //     let activeNodes = this.findActiveNode(this.json.edges, to[0], to[1])
          //     //将所有相关字段恢复默认显示
          //     activeNodes.forEach(an => {
          //       const full = an.tbName + this.minus + an.column
          //       this.jsplumbInstance.getConnections({
          //         source: full
          //       }).map(c => {
          //         c.setPaintStyle({
          //           stroke: '#bbbbbb'
          //         })
          //       })
          //       $("#" + an.tbName + "-cols")
          //           .find("#" + full)
          //           .css("background-color", '#fff');
          //     })
          //   });
          })
        }
      },
      ...comm,
      ...buttonMethods,
      clickTableNode(value){
        this.activeConnections = []
        this.activeConnectionsTo = []
        this.activeFields = []
        this.activeFieldsUp = []
        this.clearhighlightConnections() 
        this.getRelateconnections(value)
        // 获取所有连接
          const connections = this.jsplumbInstance.getConnections()
          var allfilterConnections = []
          if(this.activeConnections.length !== 0){
              this.activeConnections.forEach(item => {
                var filterConnections = connections.filter(el => {
                  return  el.sourceId == item.sourceId && el.targetId == item.targetId
                })
                allfilterConnections.push(...filterConnections)
              })
              this.activeConnections.forEach(item => {
                if(this.activeFields.indexOf(item.sourceId) == -1 ){
                  this.activeFields.push(item.sourceId)
                }
                if(this.activeFields.indexOf(item.targetId) == -1 ){
                  this.activeFields.push(item.targetId)
                }
                
              })
            
           
          }
          if(this.activeConnectionsTo.length !== 0){
             this.activeConnectionsTo.forEach(item => {
                var filterConnections = connections.filter(el => {
                  return  el.sourceId == item.sourceId && el.targetId == item.targetId
                })
                allfilterConnections.push(...filterConnections)
              })
              this.activeConnectionsTo.forEach(item => {
                if(this.activeFieldsUp.indexOf(item.sourceId) == -1 ){
                  this.activeFieldsUp.push(item.sourceId)
                }
                if(this.activeFieldsUp.indexOf(item.targetId) == -1 ){
                  this.activeFieldsUp.push(item.targetId)
                }
                
              })
          }
          var allActiveFields = [...this.activeFields,...this.activeFieldsUp]
          allActiveFields.forEach(item => {
              var node_filed = item.split('-')
              this.json.nodes.forEach(el => {
                if(node_filed[0] == el.name){
                    el.fields.forEach(ite => {
                      if(ite.name == node_filed[1]){
                        ite.isHover = true
                      }
                    })
                }

              })
            })
        
          this.highlightConnections(allfilterConnections)

      },

      getRelateconnections(value){
          this.loopUp(value)
          this.loopDown(value)
      },
      loopDown(value){
            this.pushTofileds = []
            this.json.edges.forEach( item => {
                if(item.from.name == value.nodeName && item.from.field == value.fieldName){
                      this.isSeek = true
                      var sourceId = item.from.name +'-' + item.from.field
                      var targetId = item.to.name +'-' + item.to.field
                      this.activeConnections.push({sourceId,targetId})
                      this.pushTofileds.push({sourceId,targetId})
                }
            })
            if(this.isSeek &&  this.pushTofileds.length !== 0){
                  this.isSeek = false
                  this.pushTofileds.forEach( item => {
                    var toArr = item.targetId.split('-')
                    var obj = {nodeName:toArr[0],fieldName:toArr[1]}
                     this.loopDown(obj)
                  })
            }
      },
      loopUp(value){
           this.pushFromfileds = []
           this.json.edges.forEach( item => {
                if(item.to.name == value.nodeName && item.to.field == value.fieldName){
                      this.isSeekFrom = true
                      var sourceId = item.from.name +'-' + item.from.field
                      var targetId = item.to.name +'-' + item.to.field
                      this.activeConnectionsTo.push({sourceId,targetId})
                      this.pushFromfileds.push({sourceId,targetId})
                }
            })
            if(this.isSeekFrom &&  this.pushFromfileds.length !== 0){
                  this.isSeekFrom = false
                  this.pushFromfileds.forEach( item => {
                    var toArr = item.sourceId.split('-')
                    var obj = {nodeName:toArr[0],fieldName:toArr[1]}
                     this.loopUp(obj)
                  })
            }
      },
      highlightConnections(connections) {
        connections.forEach(conn => {
          conn.setPaintStyle({ stroke: '#1b1b1b', strokeWidth: 2 }); // 红色高亮
        });
      },
      clearhighlightConnections() {
        this. clearNodeFiledHover()
        const connections = this.jsplumbInstance.getConnections()
        connections.forEach(conn => {
          conn.setPaintStyle({ stroke: '#bbbbbb', strokeWidth: 2 }); // 红色高亮
        });
      },
      clearNodeFiledHover(){
            this.json.nodes.forEach(el => {
                  el.fields.forEach(ite => {
                       ite.isHover = false
                  })
            })
      },
      getTableTypeColor(type){
        var color
          switch(type){
             case 'Origin':
                   color = '#91C051';
                   break;
             case 'Middle':
                   color = '#39C5BB';
                   break;
             case 'RS':
                   color = '#EF8014';
                   break;
              default:
                   color = '#419A5F';
          }
          return color
            
      }

    }
  
  }
  ;
  </script>
  
  <style lang="less" scoped>
  
  .app-container {
    // display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: relative;
    .selected{
      position: absolute;
      top:20px;
      left:30px;
      z-index: 10000;
      .tableType{
        float: right;
        color: #ffff;
        padding: 2px 5px;
        border-radius: 5px;
      }
    }
    .button-wrapper {
      width: 150px;
      height: 100%;
      border-right: 1px solid #ccc;
  
      .icon {
        width: 40px;
        height: 40px;
      }
  
      .button {
        display: flex;
        height: 40px;
        width: 80%;
        margin: 15px auto;
        border: 1px solid #ccc;
        border-radius: 5px;
        line-height: 40px;
        font-size: 11px;
  
        &:hover {
          cursor: pointer;
        }
  
        .log {
          width: 40px;
          height: 40px;
        }
  
        .name {
          width: 0;
          flex-grow: 1;
        }
      }
  
      .btnIcon {
        width: 40px;
        height: 40px;
      }
    }
  
    .flow-wrapper {
      height:100%;
      width: 100%;
      position: relative;
      overflow: auto;
      outline: none !important;
      // background-image: url("./assets/point.png");
  
      #table-flow {
        position: relative;
        // 调大width目的是暂时解决节点拖动到table-flow区域外时(如flow-wrapper)节点宽度自动变窄的问题
        width: 100%;
        height: 100%;
  
        .auxiliary-line-x {
          position: absolute;
          border: .5px dashed #2ab1e8;
          z-index: 9999;
        }
  
        .auxiliary-line-y {
          position: absolute;
          border: .5px dashed #2ab1e8;
          z-index: 9999;
        }
      }
    }
  }
  </style>
  
  <style lang="less">
  // 下面是鼠标移动到连线上时激活的样式
  .jtk-connector.jtk-hover {
    z-index: 9999;
  
    path {
      cursor: pointer !important;
    }
  }
  </style>
  