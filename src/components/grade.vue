<style scoped>
.icon {
  height: 100px;
  display: block;
  margin: 0;
  padding: 0;
  outline: 0;
  list-style: none;
  color: #f4f7f9;
  font-size: 14px;
  position: relative;
  z-index: 900;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100vh;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Sider
        :style="{position:'fixed',left:'0', height:'100vh'}"
        breakpoint="md"
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
      >
        <Menu active-name="1-2" theme="dark" width="auto">
          <div class="icon">
            <Row type="flex" align="middle" class="code-row-bg">
              <Col span="8">
                <div style="height:100px"></div>
              </Col>
              <Col span="8">
                <Avatar :style="{background: color}" size="large">{{Stuname}}</Avatar>
              </Col>
              <Col span="8"></Col>
            </Row>
          </div>
          <MenuItem name="1-3" to="/courseselect">
            <Icon type="ios-navigate"></Icon>
            <span>课程管理</span>
          </MenuItem>
          <MenuItem name="1-2" to="/grade">
            <Icon type="ios-search"></Icon>
            <span>成绩管理</span>
          </MenuItem>
        </Menu>
        <div slot="trigger"></div>
      </Sider>
      <Layout :style="{marginLeft: '200px'}">
        <Breadcrumb :style="{marginLeft:'40px',marginTop:'40px'}">
          <BreadcrumbItem>SQL</BreadcrumbItem>
          <BreadcrumbItem>选课管理系统</BreadcrumbItem>
          <BreadcrumbItem>成绩管理</BreadcrumbItem>
        </Breadcrumb>

        <Content :style="{marginTop: '50px',  minHeight: '500px'}">
          <Row type="flex" align="middle" justify="end" class="code-row-bg">
            <Col span="1"></Col>
            <Col span="14">
              <Tabs type="card" :style="{width:'1000px',height:'700px'}">
                <TabPane label="本学期已选课程">
                  <div style="width:30%;margin:5px"></div>
                  <Table :data="Data1" :columns="tableColumns1" stripe></Table>
                </TabPane>
                <TabPane :style="{width:'100%'}" label="所有已修课程">
                  <Row type="flex" justify="end" class="code-row-bg">
                    <Col span="4" :style="{marginBottom:'10px'}">
                      <i-switch v-model="switch1" @on-change="change" size="large"/>
                    </Col>
                  </Row>
                  <div v-show="!isShow">
                    <Table :data="tableData" :columns="tableColumns2" stripe></Table>
                  </div>
                  <div v-show="isShow" id="myChart" style="width:1000px;height:570.5px"></div>
                </TabPane>
              </Tabs>
            </Col>
            <Col span="3"></Col>
            <Col span="6">
              <div style="color:#52586E;width:300px;margin:-30px;margin-bottom:auto">
                <Card :bordered="true">
                  <p slot="title">
                    <Icon type="ios-analytics"></Icon>个人信息
                  </p>
                  <p>
                    <Icon type="md-done-all"/>
                    学号： {{GLOBAL.sno}}
                  </p>
                  <p>
                    <Icon type="md-done-all"/>
                    姓名： {{GLOBAL.sname}}
                  </p>
                  <p>
                    <Icon type="md-done-all"/>
                    性别： {{GLOBAL.sex}}
                  </p>
                  <p>
                    <Icon type="md-done-all"/>
                    年龄： {{GLOBAL.age}}
                  </p>
                  <p>
                    <Icon type="md-done-all"/>
                    学院： {{GLOBAL.sdept}}
                  </p>
                </Card>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/bar");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "courseselect",
  data() {
    return {
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#888"
            }
          }
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "分数",
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: "{value} 分"
            }
          }
        ],
        series: [
          {
            name: "分数",
            type: "bar",
            data: [],
            barWidth: 40,

            itemStyle: {
              normal: {
                color: "#2c3b57"
              }
            }
          }
        ]
      },
      switch1: false,
      xdata: [],
      chartdata: [],
      color: this.GLOBAL.color,
      Stuname: "",
      myChart: "",
      isShow: false,
      isCollapsed: false,
      search: "",
      size: 0,
      pageSize: 10,
      Data1: [], //当前学期选课数据
      tableData: this.getData(), //已修课程
      tableColumns1: [
        {
          title: "课号",
          key: "cno"
        },
        {
          title: "课程名称",
          key: "cname"
        },
        {
          title: "教师",
          key: "tname"
        },
        {
          title: "学分",
          key: "credit"
        },
        {
          title: "院系",
          key: "cdept"
        }
      ],
      tableColumns2: [
        {
          title: "课号",
          key: "cno"
        },
        {
          title: "课程名称",
          key: "cname"
        },
        {
          title: "教师",
          key: "tname"
        },
        {
          title: "学分",
          key: "credit"
        },
        {
          title: "院系",
          key: "cdept"
        },
        {
          title: "成绩",
          key: "grade"
        }
      ]
    };
  },
  created() {
    this.getOwn();
    this.getStuname();
    this.setColor();
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    change() {
      this.isShow = !this.isShow;
    },
    drawLine() {
      this.myChart = echarts.init(document.getElementById("myChart"));
      this.myChart.setOption(this.option);
    },
    getOwn() {
      //获取当前学期课程
      axios
        .post("/own", qs.stringify({ sno: this.GLOBAL.sno }))
        .then(response => {
          console.log(response);
          for (let i = 0; i < response.data.length; i++) {
            this.Data1.push({
              cname: response.data[i].cname,
              cno: response.data[i].cno,
              tname: response.data[i].sname,
              credit: response.data[i].credit,
              cdept: response.data[i].sdept
            });
          }
        })
        .catch(failResponse => {});
    },
    setColor() {
      //设置头像颜色
      this.GLOBAL.color = this.GLOBAL.ColorList[Math.round(Math.random() * 3)];
    },
    getStuname() {
      var name = this.GLOBAL.sname;

      this.Stuname = name[name.length - 2] + name[name.length - 1];
    },

    getData() {
      //获取所有课程数据
      let m = [];
      this.$axios
        .post("/getownGrade", qs.stringify({ sno: this.GLOBAL.sno }))
        .then(response => {
          console.log(response);
          this.size = response.data.length;
          for (let i = 0; i < response.data.length; i++) {
            m.push({
              cname: response.data[i].cname,
              cno: response.data[i].cno,
              tname: response.data[i].sname,
              credit: response.data[i].credit,
              cdept: response.data[i].sdept,
              grade: response.data[i].grade
            });
            this.xdata.push(response.data[i].cname);
            this.chartdata.push(response.data[i].grade);
          }
          this.option.series[0].data = this.chartdata;
          this.option.xAxis[0].data = this.xdata;
          this.myChart.setOption(this.option);
        });
      return m;
    }
  }
};
</script>
