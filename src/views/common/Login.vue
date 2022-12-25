<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    :inline="true"
    class="login-container"
    label-width="70px"
  >
    <h3 class="login_title">后台登录</h3>
    <el-form-item label="邮箱" porp="email">
      <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item class="login_sumbit">
      <el-button @click="submit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        password: [{ required: true, message: "请输入密码" }],
      },
    };
  },
  methods: {
    //登录
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$http
            .post("/manager/login", {
              email: this.form.email,
              password: this.form.password,
            })
            .then((response) => {
              console.log(response.data);
              const message = response.data;
              console.log(message, "message");
              if (message.code == 0) {
                alert(message.msg);
              } else {
                //登录成功，取出token,将token保存在localStorage
                console.log(message.data.token, "token");
                localStorage.setItem("token", message.data.token);
                console.log(message.data.manager)
                localStorage.setItem("user",JSON.stringify(message.data.manager))
                //菜单权限的获取
                const menu = message.data.menu;
                console.log(menu);
                //把菜单的数据，存入store中
                this.$store.commit("setMenu", menu);
                //动态注册路由
                this.$store.commit("addMenu", this.$router);
                this.$router.push('/home')
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;
  border: 1px solid #eaeaea;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  background-color: #fff;
  border-radius: 20px;
  // 设置阴影
  box-shadow: 0 0 25px #cac6c5;
  //设置盒子模型
  box-sizing: border-box;
  .el-input {
    width: 180px;
  }
  .login_title {
    text-align: center;
    margin-bottom: 20px;
  }
  .login_sumbit {
    display: flex;
    justify-content: center;
  }
}
</style>