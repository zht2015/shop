<template>
  <el-container class="home">
    <el-header>
      <div class="logo-box">
        <img src="../assets/logo.png" alt width="50">
        <span>电商后台管理系统</span>
      </div>
      <el-button>退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse?'80px':'200px'">
         <div @click="collapse=!collapse" class="collapse">|||</div>
        <el-menu
          :collapse="collapse"
          :router="true"
          :default-active="$route.paath"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#399bfb"
          :collapse-transition="false"
        >
       
          <el-submenu :index="item.path" v-for="(item, index) in menuList" :key="index">
            <!-- 一级导航 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级导航 -->
              <el-menu-item v-for="(item1, index1) in item.children" :key="index1" :index="item1.path">{{item1.authName}}</el-menu-item>
          </el-submenu>
           

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data() {
      return {
        menuList: [],
        collapse:false
      }
    },

   async created() {
    const menus = await this.axios.get('/menus', {
      headers: {Authorization: sessionStorage.getItem('token')}
    })
    // 失败时弹出框 
    if(menus.data.meta.status != 200) return this.$message.error('获取菜单列表失败')
    // 保存到 data 中，然后就可以在页面只使用了
    this.menuList = menus.data.data
  }
};
</script>
<style>
.home .el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  font-size: 20px;
  color: white;
}
.el-container {
  height: 100%;
}
.home .el-header img {
  vertical-align: middle;
  margin-right: 10px;
}

.home .el-aside {
  background-color: #333743;
  height: 100%;
}
.collapse{
  width:100%;
  height:30px;
  text-align: center;
  letter-spacing: .2em;
  background-color: #ccc;
}
.el-aside .el-menu{
  border-right:none;
}
</style>
