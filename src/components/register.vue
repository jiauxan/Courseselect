<template>
  <div class="land">
    <Row
      :style="{height:'inherit'}"
      type="flex"
      align="middle"
      justify="center"
      class="code-row-bg"
    >
      <Col span="8">
        <Card>
          <p slot="title">
            <Icon type="md-add"/>注册
          </p>
          <Row type="flex" align="middle" justify="start" class="code-row-bg">
            <Col span="5"></Col>
            <Col span="12">
              <Form
                ref="formValidate"
                :model="formValidate"
                :rules="ruleValidate"
                :label-width="60"
              >
                <FormItem label="学号:" prop="sno">
                  <Input autofocus="true" v-model="formValidate.sno" placeholder="请输入学号"></Input>
                </FormItem>
                <FormItem label="姓名:" prop="sname">
                  <Input v-model="formValidate.sname" placeholder="请输入姓名"></Input>
                </FormItem>
                <FormItem label="账号:" prop="logn">
                  <Input v-model="formValidate.logn" placeholder="请输入账号"></Input>
                </FormItem>
                <FormItem label="密码:" prop="pswd">
                  <Input type="password" v-model="formValidate.pswd" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem label="年龄">
                  <InputNumber :max="100" :min="1" v-model="formValidate.age"></InputNumber>
                </FormItem>
                <FormItem label="性别:" prop="sex">
                  <RadioGroup v-model="formValidate.sex">
                    <Radio label="男">男</Radio>
                    <Radio label="女">女</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="学院:" prop="sdept">
                  <Input
                    v-model="formValidate.sdept"
                    placeholder="请输入院系"
                    @keyup.enter.native="handleSubmit('formValidate')"
                  ></Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
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
export default {
  name: "register",
  data() {
    return {
      formValidate: {
        sno: "",
        sname: "",
        pswd: "",
        age: 1,
        logn: "",
        sex: "",
        sdept: ""
      },
      ruleValidate: {
        sno: [
          {
            required: true,
            message: "学号不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 4,
            message: "学号最多为4位",
            trigger: "blur"
          }
        ],
        sname: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],
        pswd: [
          {
            required: true,
            message: "请填写密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码至少为6位",
            trigger: "blur"
          }
        ],
        logn: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        sdept: [
          {
            required: true,
            message: "院系号不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/register",
              { formValidate: JSON.stringify(this.formValidate) },
              "application/json"
            )
            .then(response => {
              this.$Message.success("注册成功");
              this.$router.push("/land");
            })
            .catch(failResponse => {
              this.$Message.error("提交失败");
            });
        } else {
          this.$Message.error("提交失败");
        }
      });
    }
  }
};
</script>
