<template>
  <div class="user">
    <div class="manager-header">
      <!-- form搜索区 -->
      <el-form :inline="true" :model="userForm">
        <el-form-item>
          <el-input
            placeholder="请输入搜索内容"
            v-model="userForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSumit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-table">
      <el-table stripe height="90%" :data="tableData" style="width: 100%">
        <el-table-column label="订单编号" prop="code" width="370px"></el-table-column>
        <el-table-column label="联系人" prop="userName"> </el-table-column>
        <el-table-column label="联系电话" prop="userPhone"></el-table-column>
        <el-table-column
          label="下单时间"
          prop="orderTime"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column label="总价" prop="total"></el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import AddressChoose from "@/components/utils/AddressChoose";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      tableData: [],
      modelType: true, //true表示的是新增的弹窗，false表示的是编辑的弹窗
      total: 0, //总条数
      pageData: {
        page: 1,
        limit: 10,
      },
      userForm: {
        name: "",
      },
      status: "1",
    };
  },
  mounted() {
    // 展示所有机票
    this.getList();
  },
  methods: {
    //搜索查询
    onSumit() {
      this.getList();
    },
    //获得所有的支付订单
    getList() {
      const id = JSON.parse(localStorage.getItem("user")).id;
      this.$http
        .get(
          "/managerOrder/checkAllOrder/" +
            id +
            "/" +
            this.pageData.page +
            "/" +
            this.pageData.limit +
            "/" +
            this.status,
          {
            params: {
              name: this.userForm.name,
            },
          }
        )
        .then((response) => {
          console.log(response, "paid");
          const list = response.data.data;
          this.tableData = list.records;
          this.total = list.total;
        });
    },
    // 格式化时间
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
    //选择页面的回调函数
    handlePage(val) {
      //   console.log(val, "val");
      this.pageData.page = val;
      this.getList();
    },
  },
  components: {
    "address-choose": AddressChoose,
  },
  computed: {},
};
</script>
    <style lang="less" scoped>
.user {
  height: 90%;
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .common-table {
    position: relative;
    height: calc(100% - 62px);
    .pager {
      float: right;
    }
  }
}
</style>