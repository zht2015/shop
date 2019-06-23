<template>
  <div class="login">
    <div class="login-box">
      <img src="../assets/logo.png" alt class="logo">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input  prefix-icon='el-icon-user-solid' v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
       <el-form-item prop="password">
          <el-input  prefix-icon='el-icon-user-solid' v-model="loginForm.password" type='password' placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginSubmit">登录</el-button>
          <el-button type="default" >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      loginForm:{
        username:'',
        password:''
      },
      loginRules: {
          username: [
              { required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
              { required: true, message: '密码不能为空', trigger: 'blur'}
          ]
      }
    }
  },
  methods:{
    loginSubmit(){
       this.$refs.loginForm.validate(async ok=>{
            if(ok) {
                const {data: res} = await this.axios.post('/login', this.loginForm)
                if(res.meta.status != 200) return this.$message.error('用户名或者密码错误')
                // 保存令牌到本地 sessionStoarge：关闭浏览器就需要重新 登录 
                sessionStorage.setItem('token', res.data.token)
                // 跳转
                this.$router.push('/')
            }
        })
    }
  }
};
</script>
<style>
.login {
  width: 100%;
  height: 100%;
  background-color: #294a69;
}
.login .login-box {
  width: 450px;
  height: 304px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login .login-box .logo {
  width: 130px;
  height: 130px;
  border: solid 7px #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #ccc;
  background-color: #eee;
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translate(-50%, 50%);
}

.login-box .el-form{
  width:100%;
  margin-top:80px;
  padding:0px 20px 30px;
  box-sizing: border-box;
  text-align: right;
}
</style>