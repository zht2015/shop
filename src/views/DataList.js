export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      dataList: [],
      total: 0,
      keywords: "",
      addFormDialog: true
    }
  },
  created() {
    this.getData();
  },
  watch: {
    queryInfo: {
      deep: true,
      handler() {
        this.getData();
      }
    }
  },
  methods:{
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
    }
    
  }
}