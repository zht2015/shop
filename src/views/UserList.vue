<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20" class="search-box">
        <el-col :span="10">
          <el-input placeholder="请输入搜素内容" v-model="keywords" @keyup.enter.native="queryInfo.query=keywords">
            <el-button slot="append" icon="el-icon-search" @click="queryInfo.query=keywords"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="data">
            <el-switch
              @change="changeState($event,data.row)"
              v-model="data.row.mg_state"
              active-color="#399bfb"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="data">
            <el-button size="mini" @click="showEditForm(data.row)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size="mini" @click=del(data.row.id) type="danger" icon="el-icon-delete" circle></el-button>
            <el-tooltip :enterable="true" effect="dark" content="分配角色" placement="top">
              <el-button size="mini" type="warning" icon="el-icon-s-tools" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的表单 -->
    <el-dialog @closed="$refs.addUserRef.resetFields()" title="添加用户" :visible.sync="addUserDialog">
      <el-form ref="addUserRef" :model="addUserForm" :rules="addUserRules">
        <el-form-item label="用户名" prop="username" label-width="80px">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" type="password" prop="password" label-width="80px">
          <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="80px">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" label-width="80px">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

     <!-- 修改用户的表单 -->
    <el-dialog title="修改用户" :visible.sync="editUserDialog">
      <el-form ref="editUserRef" :model="editUserForm" :rules="editUserRules">
        <el-form-item label="用户名" prop="username" label-width="80px">
          <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email" label-width="80px">
          <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" label-width="80px">
          <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>

          <el-input v-model="editUserForm.id" type="hidden" autocomplete="off"></el-input>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setInterval } from "timers";
import User from './user.js'
export  default{
  mixins:[User]
}
</script>

<style>
.search-box {
  margin-bottom: 15px;
}
</style>