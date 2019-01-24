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

          <MenuItem v-show="Istu" name="1-2" to="/courseselect">
            <Icon type="ios-navigate"></Icon>
            <span>课程管理</span>
          </MenuItem>
          <MenuItem v-show="Istu" name="1-3" to="/grade">
            <Icon type="ios-search"></Icon>
            <span>成绩管理</span>
          </MenuItem>
          <MenuItem v-show="!Istu" name="1-4" to="/charge">
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
          <BreadcrumbItem>课程管理</BreadcrumbItem>
        </Breadcrumb>

        <Content :style="{marginTop: '50px',  minHeight: '500px'}">
          <Row type="flex" align="middle" justify="end" class="code-row-bg">
            <Col span="1"></Col>
            <Col span="14">
              <Tabs type="card" :style="{width:'1000px',height:'700px'}">
                <TabPane label="选课">
                  <div style="width:30%;margin:5px">
                    <Input
                      search
                      clearable
                      icon="ios-search"
                      v-model="search"
                      @keyup.enter.native="searchForm()"
                      @on-change="backvalue()"
                      @on-click="searchForm()"
                      placeholder="输入课程信息..."
                    />
                  </div>
                  <Table
                    :data="Data"
                    :columns="tableColumns1"
                    ref="selection"
                    @on-selection-change="handleRow"
                    stripe
                  ></Table>
                  <div style="margin: 10px;overflow: hidden;">
                    <div style="float:left;">
                      <Button type="primary" size="large" @click="handleCourse()">选课</Button>
                    </div>
                    <div style="float: right;">
                      <Page
                        :total="size1"
                        :page-size="pageSize"
                        :current="1"
                        @on-change="changePage"
                      ></Page>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="退课">
                  <Table
                    :data="Data1"
                    :columns="tableColumns1"
                    ref="sentence"
                    @on-selection-change="quitRow"
                    stripe
                  ></Table>
                  <div style="margin: 10px;overflow: hidden;">
                    <div style="float:left;">
                      <Button type="primary" size="large" @click="quitCourse()">退课</Button>
                    </div>
                    <!-- <div style="float: right;">
                      <Page
                        :total="size"
                        :page-size="pageSize"
                        :current="1"
                        @on-change="changePage"
                      ></Page>
                    </div>-->
                  </div>
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
export default {
  name: "courseselect",
  data() {
    return {
      Istu: this.Istud(),
      color: "",
      quitcourse: [],
      Stuname: "",
      isCollapsed: false,
      search: "",
      handlecourse: [], //所选课程信息
      size1: 0,
      back: [],
      pageSize: 10,
      Data1: [], //退课table
      Data: [], //当前table数据
      tableData1: [], //所有数据
      tableColumns1: [
        {
          type: "selection",
          width: 100,
          align: "center"
        },
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
      ]
    };
  },
  created() {
    this.getData();
    this.getOwn();
    this.getStuname();
    this.setColor();
  },

  methods: {
    Istud() {
      if (this.GLOBAL.ssign == "t") return false;
      else return true;
    },
    getOwn() {
      //退课table
      let m = [];
      axios
        .post("/own", qs.stringify({ sno: this.GLOBAL.sno }))
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            m.push({
              cname: response.data[i].cname,
              cno: response.data[i].cno,
              tname: response.data[i].sname,
              credit: response.data[i].credit,
              cdept: response.data[i].sdept
            });
          }
          this.Data1 = m;
        })
        .catch(failResponse => {});
    },
    setColor() {
      //设置头像颜色
      this.color = this.GLOBAL.ColorList[Math.round(Math.random() * 3)];
    },
    getStuname() {
      var name = this.GLOBAL.sname;

      this.Stuname = name[name.length - 2] + name[name.length - 1];
    },
    backvalue() {
      //输入为空时返回原本数据
      if (this.search == "") this.Data = this.back;
    },
    searchForm() {
      //查询课程
      var m = [];
      if (this.search.length == 0) return;

      axios
        .post("/searchcourse", qs.stringify({ search: this.search }))
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            m.push({
              cname: response.data[i].cname,
              cno: response.data[i].cno,
              tname: response.data[i].sname,
              credit: response.data[i].credit,
              cdept: response.data[i].sdept
            });
          }
          this.Data = m;
        })
        .catch(failResponse => {});
    },
    quitRow(sentence) {
      this.quitcourse = sentence;
      console.log(this.quitcourse);
    },
    quitCourse() {
      //退课
      axios
        .post(
          "/quitcourse",
          {
            courses: JSON.stringify(this.quitcourse),
            sno: JSON.stringify(this.GLOBAL.sno)
          },
          {
            emulateJSON: true
          },
          "application/json"
        )
        .then(response => {
          console.log(response);
          this.getOwn();

          this.$Message.success("退课成功");
        })
        .catch(failResponse => {
          this.$Message.error("退课失败");
        });
    },
    handleCourse() {
      //提交选课
      // var courses = JSON.stringify(this.handlecourse);
      // console.log(courses);
      this.$axios
        .post(
          "/selectcourse",
          {
            courses: JSON.stringify(this.handlecourse),
            sno: JSON.stringify(this.GLOBAL.sno)
          },
          {
            emulateJSON: true
          },
          "application/json"
        )
        .then(response => {
          this.getOwn();
          this.$Message.success("选课成功");

          this.handleSelectAll(false);
        })
        .catch(failResponse => {
          this.handleSelectAll(false);

          this.$Message.error("选课发生冲突");
        });
    },
    handleRow(selection) {
      this.handlecourse = selection;
      console.log(this.handlecourse);
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    quitSelectAll(status) {
      this.$refs.sentence.selectAll(status);
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
    handleList() {
      //页面初始化
      if (this.pageSize >= this.size1) this.Data = this.tableData1;
      else this.Data = this.tableData1.slice(0, this.pageSize);
      //  console.log(this.Data);
      this.back = this.Data;
    },
    changePage(index) {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      var start = (index - 1) * this.pageSize;
      var end = index * this.pageSize;
      this.Data = this.tableData1.slice(start, end);
      this.back = this.Data;
    }
  }
};
</script>
