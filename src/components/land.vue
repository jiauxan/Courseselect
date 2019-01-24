<template>
  <div class="land">
    <Row
      :style="{height:'inherit'}"
      type="flex"
      align="middle"
      justify="center"
      class="code-row-bg"
    >
      <Col :style="{height:'50%'}" span="12">
        <Card :style="{marginBottom:'10px'}" :bordered="true">
          <p slot="title" :style="{fontSize:'large'}">
            <Icon type="ios-analytics"></Icon>登陆界面
          </p>
          <Row
            :style="{height:'inherit'}"
            type="flex"
            align="middle"
            justify="center"
            class="code-row-bg"
          >
            <Col span="24">
              <Form ref="formInline" :model="formInline" :rules="ruleInline">
                <FormItem prop="账号">
                  <Input
                    :style="{width:'50%',margin:'0 auto'}"
                    type="text"
                    v-model="formInline.login"
                    placeholder="账号"
                  >
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                  </Input>
                </FormItem>
                <FormItem prop="密码">
                  <Input
                    :style="{width:'50%',margin:'0 auto'}"
                    type="password"
                    v-model="formInline.password"
                    @keyup.enter.native="login()"
                    placeholder="密码"
                  >
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
                </FormItem>
                <FormItem :style="{width:'50%',margin:'0 auto'}">
                  <Button type="primary" @click.native="login">登陆</Button>
                  <Button :style="{marginLeft:'10px'}" to="/register">注册</Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<style scoped>
.land {
  height: 100%;
  width: 100%;
}
</style>
<script>
import axios from "axios";
import qs from "qs";
export default {
  name: "land",

  data() {
    return {
      formInline: {
        login: "",
        password: ""
      },
      switch1: false,
      ruleInline: {
        login: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "账号最短为6位",
            trigger: "blue"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码最短为6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$axios
        .post(
          "/land",
          qs.stringify({
            login: this.formInline.login
            // pswd: this.formInline.password
          }),
          { emulateJSON: true }
        )
        .then(response => {
          var status = response.data;
          this.GLOBAL.sno = status.sno;
          this.GLOBAL.sname = status.sname;
          this.GLOBAL.sex = status.sex;
          this.GLOBAL.age = status.age;
          this.GLOBAL.sdept = status.sdept;
          this.GLOBAL.ssign = status.ssign;
          if (status.pswd == this.formInline.password) {
            this.$Message.success("登陆成功");
            if (status.ssign == "s") this.$router.push("/courseselect");
            else this.$router.push("/charge");
          } else {
            this.$Message.error("账号或密码错误");
          }
        })
        .catch(failResponse => {
          this.$Message.error("账号或密码错误");
        });
    },

    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          //
          valid.preventDefault();
          this.login();
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
