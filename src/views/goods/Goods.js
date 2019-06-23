import MQuillEditor from 'vue-m-quill-editor'
export default {
  components: {
      MQuillEditor
  },
  data() {
    return {
      quill: {
        border: true,
        content: 'wellcome ~',
        syncOutput: true,    // 同步将内容输出
        theme: 'snow', //bubble snow
        disabled: false,
        full: false
      },
      uploadHeader: {Authorization: sessionStorage.getItem('token')},
      goodsParamsValues: [],
      goodsAttrs:[],
      goodsParams:[],
      catList:[],
      stepActive: '0',
      addForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight:'',
        goods_introduce:'',
        pics:[],
        attrs:[]
      },
      
      addFormRules:{
        goods_name:{required:true,message:"商品名称不能为空",trigger:"blur"},
        goods_price:[
          { required:true, message:'商品价格不能为空',trigger:"blur" },
          {pattern:/^[1-9]\d*(\.\d{1,2})?|^0(\.\d{1,2})?$/,message:"商品价格不符合",trigger:"blur"}
        ],
        goods_weight:{required:true,message:"商品重量不能为空",trigger:"blur"},
        goods_number:{required:true,message:"商品数量不能为空",trigger:"blur"},
        goods_cat:{ required:true,message:"商品分类不能为空",trigger:'blur'}
      }
    }
  },

  async created(){
    let { data:res } = await this.axios.get('/categories')
    if(res.meta.status!=200) return this.$message.error('获取商品分类失败')
    this.catList=res.data
  },

  methods: {
    async getData() {
      let data = await this.axios.get("/goods", { params: this.queryInfo });
      if (data.data.meta.status != 200)
        return this.$message.error("商品数据获取失败");
      this.dataList = data.data.data.goods;
      this.total = data.data.data.total;
    },
 
    // 必须选择分类才能切换
    beforeLeave(activeName, oldActiveName) {
      // 如果上一级框是第一个框，那么判断是否选了三级分类
      // if(oldActiveName == 0 && this.addForm.goods_cat.length == 0) {
      //     this.$message.error('必须选择商品分类')
      //     // 阻止跳转
      //     return false
      // }
    },

    add(){
      this.$refs.addFormRef.validate(async v =>{
        if(v){
          this.addForm.goods_cat=this.addForm.goods_cat.join(',')
          let { data:res } = await this.axios.post('./goods',this.addForm)
          if(res.meta.status!=201) return this.$message.error('添加商品失败')
          this.$message.success('添加商品成功')
          this.getData()
          this.addFormDialog=false
        }else{
          return false
        }
      })
    },

    async catChange(val){
     
      let id = val[val.length-1] 
      let attrData = await this.axios.get(`categories/${id}/attributes`,{params:{sel:'only'}})
      console.log(attrData)
      if(attrData.data.meta.status!=200)return this.$message.error('商品属性获取失败')
      this.goodsAttrs=attrData.data.data
      let paramData = await this.axios.get(`categories/${id}/attributes`,{params:{sel:'many'}})
      //console.log(paramData)
      if(paramData.data.meta.status!=200)return this.$message.error('商品参数获取失败')
      this.goodsParams=paramData.data.data
    },
    //上传图片处理
    uploadSuccess(response, file, fileList) {
      // 判断服务器返回是否是成功
      if(response.meta.status != 200) {        
          // 从 fileList （图片列表） 中删除刚刚上传的这个图片
          // 根据 file.uid 到 fileList 数组中找到相同的 UID 图片并删除
          setTimeout(() => {
              fileList.splice(fileList.findIndex(v=>v.uid==file.uid), 1)                    
          }, 500);
          // 提示信息
          this.$message.error('图片上传失败')
      }
      // 上传成功之后，把服务器返回的路径保存到表单绑定的数组中
      this.addForm.pics.push({
          pic: response.data.tmp_path
      })
    },
    // 编辑器图片上传
    editorUpload (file, insert) {
      // 把这个图片转成 base64
      let reader = new FileReader()
      //console.log( reader )
      // 绑定一个回调函数，加载完图片之后调用
      reader.onloadend = (e)=>{

          // 把加载完的字符串放到页面中
          // e.target.result ：加载完之后的 base64 的字符串
          insert(e.target.result, 'center')
      }
      // 加载图片
      reader.readAsDataURL(file)
      //insert('https://avatars0.githubusercontent.com/u/11366654?s=460&v=4', 'center')
    }


  } //methods end

}