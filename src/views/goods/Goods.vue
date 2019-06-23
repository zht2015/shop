<template>
  <div class="goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="search-box">
        <el-col :span="10">
          <el-input
            placeholder="请输入搜素内容"
            v-model="keywords"
            @keyup.enter.native="queryInfo.query=keywords"
          >
            <el-button slot="append" icon="el-icon-search" @click="queryInfo.query=keywords"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addFormDialog=true">添加新商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_number" label="数量"></el-table-column>
        <el-table-column prop="goods_weight" label="重量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="data">
            <el-button
              size="mini"
              @click="showEditForm(data.row)"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              size="mini"
              @click="del(data.row.id)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
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

    <!-- 添加商品的表单 -->
    <el-dialog
      @closed="$refs.addFormRef.resetFields()"
      title="添加商品"
      :visible.sync="addFormDialog"
      width="900px"
    >
      <el-form ref="addFormRef" label-position="top" :model="addForm" :rules="addFormRules">
        <el-steps :space="200" :active="stepActive-0" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>

        <el-tabs :before-leave="beforeLeave" tab-position="left" v-model="stepActive">
          <el-tab-pane label="基本信息">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <!-- 商品分类--三级联动 -->
            <el-form-item prop="goods_cat" label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catList"
                :props="{ label:'cat_name',value:'cat_id',expandTrigger: 'hover' }"
                @change="catChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <div v-for="(item, index) in goodsParams" :key="index">
              <h3>{{item.attr_name}}</h3>
              <div>
                <el-checkbox-group v-model="goodsParamsValues">
                  <el-checkbox
                    v-for="(item1,index1) in item.attr_vals.split(' ')"
                    :label="item1"
                    :key="index1"
                    border
                  ></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item v-for="(item, index) in goodsAttrs" :key="index" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              :action="axios.defaults.baseURL + '/upload'"
              :headers="uploadHeader"
              :on-success="uploadSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <template>
              <m-quill-editor 
                :has-border="quill.border"
                v-model="addForm.goods_introduce"
                :sync-output="quill.syncOutput"
                :theme="quill.theme"
                :disabled="quill.disabled"
                :fullscreen="quill.full"
                :toolbar="quill.toolbar"
                @upload="editorUpload"
                ></m-quill-editor>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DataList from "../DataList.js";
import Goods from "./Goods.js";
export default {
  mixins: [DataList, Goods]
};
</script>
<style>
.search-box {
  margin-bottom: 15px;
}
.goods .el-step__title {
  font-size: 12px;
}
.goods .el-steps {
  margin-bottom: 20px;
}
</style>