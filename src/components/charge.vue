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
                <Avatar :style="{background: color}" size="large">U</Avatar>
              </Col>
              <Col span="8"></Col>
            </Row>
          </div>
          <MenuItem name="1-2" to="/charge">
            <Icon type="md-code"/>
            <span>维护管理</span>
          </MenuItem>
        </Menu>
        <div slot="trigger"></div>
      </Sider>
      <Layout :style="{marginLeft: '200px'}">
        <Breadcrumb :style="{marginLeft:'40px',marginTop:'40px'}">
          <BreadcrumbItem>SQL</BreadcrumbItem>
          <BreadcrumbItem>选课管理系统</BreadcrumbItem>
          <BreadcrumbItem>维护管理</BreadcrumbItem>
        </Breadcrumb>

        <Content :style="{marginTop: '50px',  minHeight: '500px'}">
          <Row type="flex" align="middle" justify="end" class="code-row-bg">
            <Col span="1"></Col>
            <Col span="14">
              <Tabs type="card" :style="{width:'1000px',height:'700px'}">
                <TabPane label="所有已开课程">
                  <div style="width:30%;margin:5px"></div>
                  <Table @on-row-click="getchart" :data="Data" :columns="tableColumns1" stripe></Table>
                  <div style="margin: 10px;overflow: hidden;">
                    <div style="float: right;">
                      <Page
                        :total="size1"
                        :page-size="pageSize"
                        :current="1"
                        @on-change="changePage"
                      ></Page>
                    </div>
                  </div>
                  <Drawer :closable="false" width="50" v-model="value">
                    <Row type="flex" justify="end" class="code-row-bg">
                      <Col span="4" :style="{marginBottom:'10px'}">
                        <i-switch v-model="switch1" @on-change="change" size="large"/>
                      </Col>
                    </Row>
                    <div v-show="!isShow">
                      <Table :data="Data1" :columns="tableColumns2">
                        <template slot-scope="{ row, index }" slot="sno">
                          <span>{{ row.sno }}</span>
                        </template>

                        <template slot-scope="{ row, index }" slot="sname">
                          <span>{{ row.sname }}</span>
                        </template>

                        <template slot-scope="{ row, index }" slot="sex">
                          <span>{{ row.sex }}</span>
                        </template>

                        <template slot-scope="{ row, index }" slot="age">
                          <span>{{ row.age }}</span>
                        </template>

                        <template slot-scope="{ row, index }" slot="sdept">
                          <span>{{ row.sdept }}</span>
                        </template>
                        <template slot-scope="{ row, index }" slot="grade">
                          <Input type="text" v-model="editgrade" v-if="editIndex === index"/>
                          <span v-else>{{ row.grade }}</span>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                          <div v-if="editIndex === index">
                            <Button @click="handleSave(index)">保存</Button>
                            <Button @click="editIndex = -1">取消</Button>
                          </div>
                          <div v-else>
                            <Button @click="handleEdit(row, index)">修改</Button>
                          </div>
                        </template>
                      </Table>
                    </div>
                    <div v-show="isShow" id="myChart" style="width:1000px;height:570.5px"></div>
                  </Drawer>
                </TabPane>
                <TabPane label="创建课程">
                  <Row type="flex" align="middle" justify="center" class="code-row-bg">
                    <Col span="20">
                      <Card style="width:80%">
                        <p slot="title">
                          <Icon type="md-add"/>创建课程
                        </p>
                        <Row type="flex" align="middle" justify="center" class="code-row-bg">
                          <Col span="10">
                            <Form
                              ref="forItem"
                              :model="formItem"
                              :rules="ruleValidate"
                              :label-width="80"
                            >
                              <FormItem label="老师姓名" prop="tname">
                                <Input v-model="formItem.tname" placeholder="请输入老师姓名"></Input>
                              </FormItem>
                              <FormItem label="课号">{{current}}</FormItem>
                              <FormItem label="学分">
                                <InputNumber :max="10" :min="1" v-model="formItem.credit"></InputNumber>
                              </FormItem>
                              <FormItem label="课程名称" prop="cname">
                                <Input v-model="formItem.cname" placeholder="请输入课程姓名"></Input>
                              </FormItem>
                              <FormItem label="院系名称" prop="sdept">
                                <Input v-model="formItem.sdept" placeholder="请输入院系姓名"></Input>
                              </FormItem>
                              <FormItem>
                                <Button @click="submitcourse()" type="primary">提交</Button>
                                <Button style="margin-left: 8px">取消</Button>
                              </FormItem>
                            </Form>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Col>
            <Col span="3"></Col>
            <Col span="6">
              <!-- <div style="color:#52586E;width:300px;margin:-30px;margin-bottom:auto">
                <Card :bordered="true">
                  <p slot="title">
                    <Icon type="ios-analytics"></Icon>个人信息
                  </p>
                  <p>
                    <Icon type="md-done-all"/>
                    工号： {{GLOBAL.sno}}
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
              </div>-->
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
      formItem: {
        tname: "",
        credit: 1,
        cname: "",
        sdept: ""
      },
      ruleValidate: {
        tname: [
          {
            required: true,
            message: "教师姓名不能为空",
            trigger: "blur"
          }
        ],
        cname: [
          {
            required: true,
            message: "课程名称不能为空",
            trigger: "blur"
          }
        ],
        sdept: [
          {
            required: true,
            message: "院系名不能为空",
            trigger: "blur"
          }
        ]
      },
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
            data: ["1-59", "60-69", "70-79", "80-89", "90-100"],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "人数",
            min: 0,
            max: 5,
            interval: 1,
            axisLabel: {
              formatter: "{value} 人"
            }
          }
        ],
        series: [
          {
            name: "人数",
            type: "bar",
            data: [0, 0, 0, 0, 0],
            barWidth: 40,

            itemStyle: {
              normal: {
                color: "#2c3b57"
              }
            }
          }
        ]
      },
      editIndex: -1,
      editgrade: "",
      current: 0,
      switch1: false,
      xdata: [],
      value: false,
      chartdata: [],
      color: this.GLOBAL.color,
      Stuname: "",
      myChart: "",
      isShow: false,
      isCollapsed: false,
      search: "",
      size1: 0,
      n: [0, 0, 0, 0, 0],
      pageSize: 10,
      back: [],
      Data: [], //临时容器
      Data1: [],
      tableData1: [], //所有已开课程
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
          title: "教师名称",
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
          title: "学号",
          slot: "sno"
        },
        {
          title: "姓名",
          slot: "sname"
        },
        {
          title: "性别",
          slot: "sex"
        },
        {
          title: "年龄",
          slot: "age"
        },
        {
          title: "院系",
          slot: "sdept"
        },
        {
          title: "成绩",
          slot: "grade"
        },
        {
          title: "修改",
          slot: "action"
        }
      ]
    };
  },

  created() {
    this.getStuname();
    this.setColor();
    this.getData();
    this.getcurrentcno();
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    submitcourse() {
      this.$axios
        .post(
          "/submitcourse",
          {
            cno: JSON.stringify(this.current),
            sname: JSON.stringify(this.formItem.tname),
            sdept: JSON.stringify(this.formItem.sdept),
            cname: JSON.stringify(this.formItem.cname),
            credit: JSON.stringify(this.formItem.credit)
          },
          "application/json"
        )
        .then(response => {
          this.$Message.success("创建课程成功");
          this.getData();
          this.getcurrentcno();
          this.$router.push("/charge");
        })
        .catch(failResponse => {
          this.$Message.error("创建失败");
        });
    },
    getcurrentcno() {
      this.$axios.get("/currentcno").then(response => {
        this.current = response.data + 1;
      });
    },
    getchart(index) {
      this.value = !this.value;
      this.GLOBAL.cno = index.cno;
      this.getcurrent(index.cno);
    },
    change() {
      this.isShow = !this.isShow;
    },
    drawLine() {
      this.myChart = echarts.init(document.getElementById("myChart"));
      this.myChart.setOption(this.option);
    },
    getData() {
      //获取所有课程数据
      let m = [];
      this.$axios.get("/courseselect").then(response => {
        this.size1 = response.data.length;
        for (let i = 0; i < response.data.length; i++) {
          m.push({
            cname: response.data[i].cname,
            cno: response.data[i].cno,
            tname: response.data[i].sname,
            credit: response.data[i].credit,
            cdept: response.data[i].sdept
          });
        }
        this.tableData1 = m;
        this.handleList();
      });
    },
    getcurrent(index) {
      var m = [];
      var x = [0, 0, 0, 0, 0];
      axios.post("/current", qs.stringify({ cno: index })).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          m.push({
            sno: response.data[i].sno,
            sname: response.data[i].sname,
            sex: response.data[i].sex,
            age: response.data[i].age,
            sdept: response.data[i].sdept,
            grade: response.data[i].grade
          });
          if (response.data[i].grade < 60) x[0]++;
          else if (response.data[i].grade < 70) x[1]++;
          else if (response.data[i].grade < 80) x[2]++;
          else if (response.data[i].grade < 90) x[3]++;
          else x[4]++;
        }
        this.Data1 = m;
        this.option.series[0].data = x;
        this.n = x;
        this.myChart.setOption(this.option);
      });
    },
    setColor() {
      //设置头像颜色
      this.GLOBAL.color = this.GLOBAL.ColorList[Math.round(Math.random() * 3)];
    },
    getStuname() {
      var name = this.GLOBAL.sname;

      this.Stuname = name[name.length - 2] + name[name.length - 1];
    },
    handleList() {
      //页面初始化
      if (this.pageSize >= this.size1) this.Data = this.tableData1;
      else this.Data = this.tableData1.slice(0, this.pageSize);
      // console.log(this.Data);
      this.back = this.Data;
    },
    changePage(index) {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      var start = (index - 1) * this.pageSize;
      var end = index * this.pageSize;
      this.Data = this.tableData1.slice(start, end);
      this.back = this.Data;
    },
    handleEdit(row, index) {
      this.editgrade = row.grade;
      this.editIndex = index;
      this.GLOBAL.rsno = row.sno;
    },
    handleSave(index) {
      if (this.Data1[index].grade < 60 && this.Data1[index].grade >= 0)
        this.n[0]--;
      else if (this.Data1[index].grade >= 60 && this.Data1[index].grade < 70)
        this.n[1]--;
      else if (this.Data1[index].grade >= 70 && this.Data1[index].grade < 80)
        this.n[2]--;
      else if (this.Data1[index].grade >= 80 && this.Data1[index].grade < 90)
        this.n[3]--;
      else this.n[4]--;
      this.Data1[index].grade = this.editgrade;
      this.editIndex = -1;

      this.$axios
        .post(
          "/update",
          qs.stringify({
            cno: this.GLOBAL.cno,
            sno: this.GLOBAL.rsno,
            grade: this.editgrade
          })
        )
        .then(response => {
          if (this.editgrade < 60 && this.editgrade >= 0) this.n[0]++;
          else if (this.editgrade < 70 && this.editgrade >= 60) this.n[1]++;
          else if (this.editgrade < 80 && this.editgrade >= 70) this.n[2]++;
          else if (this.editgrade < 90 && this.editgrade >= 80) this.n[3]++;
          else this.n[4]++;

          this.option.series[0].data = this.n;
          this.myChart.setOption(this.option);
          this.$Message.success("修改成功");
        })
        .catch(failResponse => {});
    }
  }
};
</script>
