export default {
  data() {
    let validateNameExists = async (rule, value, callback) => {
     let exists = await this.axios.get('/users/exists/'+value)
      if (exists.data.meta.status==200) {
        callback(new Error('用户名已经存在'));
      } else {
        callback();
      }
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      keywords: "",
      addUserDialog:false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: ["blur", "change"] },
          { validator:validateNameExists,trigger:"blur"}
        ],
        password: { required: true, message: "密码不能为空", trigger: ["blur", "change"] },
        email: [
          { required: true, message: "邮箱不能为空", trigger: ["blur", "change"] },
          { type: "email",message: "邮箱格式不正确",trigger: ["blur", "change"]}
        ],

        mobile: [
          { required: true, message: "电话不能为空", trigger: ["blur", "change"] },
          { pattern: /^1[1345678]\d{9}$/,message: "电话格式不正确",trigger: ["blur", "change"] }
        ]
      },
      editUserDialog: false,
      editUserForm: {
        id:'',
        username: "",
        email: "",
        mobile: ""
      },
      editUserRules: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: ["blur", "change"] },
          { type: "email",message: "邮箱格式不正确",trigger: ["blur", "change"]}
        ],

        mobile: [
          { required: true, message: "电话不能为空", trigger: ["blur", "change"] },
          { pattern: /^1[1345678]\d{9}$/,message: "电话格式不正确",trigger: ["blur", "change"] }
        ]
      }
    };
  },
  async created() {
    this.getData();
  },
  methods: {
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
    },
    async getData() {
      let data = await this.axios.get("/users", { params: this.queryInfo });
      if (data.data.meta.status != 200)
        return this.$message.error("用户列表失败哦");
      this.userList = data.data.data.users;
      this.total = data.data.data.total;
      this.pagenum = data.data.data.pagenum;
    },
    async changeState(val, row) {
      let res = await this.axios.put(`/users/${row.id}/state/${val}`);
      if (res.data.meta.status != 200) {
        return this.$message.error("状态修改失败");
        setInterval(function() {
          row.mg_state = !row.mg_state;
        }, 500);
      }
    },
    add() {
      this.$refs.addUserRef.validate(async c => {
        if (c) {
          const res = await this.axios.post("/users", this.addUserForm);
          if (res.data.meta.status == 201) {
            this.$message.success("添加成功");
            //重新获取数据
            this.getData();
            //关闭窗口
            this.addUserDialog = false;
          }
        } else {
          return false;
        }
      });
    },
    showEditForm(data){
      this.editUserForm.id=data.id
      this.editUserForm.username=data.username
      this.editUserForm.email=data.email
      this.editUserForm.mobile=data.mobile
      this.editUserDialog=true
    },
    edit(){
      this.$refs.editUserRef.validate(async c => {
        if (c) {
          const res = await this.axios.put(`/users/${this.editUserForm.id}`, this.editUserForm);
          if (res.data.meta.status == 200) {
            this.$message.success("更新成功");
            //重新获取数据
            this.getData();
            //关闭窗口
            this.editUserDialog = false;
          }
        } else {
          return false;
        }
      });
    },
    del(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
           const res = await this.axios.delete(`users/${id}`)
          if(res.data.meta.status==200){
             this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getData();
          }else{
            this.$message.error('删除失败:'+res.data.metamsg)
          }
         
        }).catch(() => {    
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }

  },
  watch: {
    queryInfo: {
      deep: true,
      handler() {
        this.getData();
      }
    }
  }
};