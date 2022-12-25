<template>
  <div class="user">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="50%"
    >
      <!-- 用户的表单消息 -->
      <el-form
        ref="form"
        :rules="rules"
        :inline="true"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input placeholder="请输入姓名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="店铺名" prop="businessName">
          <el-input placeholder="请输入店铺名" v-model="form.businessName"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址" prop="email">
          <el-input placeholder="请输入店铺地址" v-model="form.businessPlace"></el-input>
        </el-form-item>
        <el-form-item label="管理" prop="status">
          <el-select placeholder="请选择类型" v-model="form.status">
            <el-option label="机票" :value="1"></el-option>
            <el-option label="酒店" :value="2"></el-option>
            <el-option label="景点" :value="3"></el-option>
            <el-option label="火车" :value="4"></el-option>
            <el-option label="高铁" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <div class="manager-header">
      <el-button @click="handleAdd" type="primary"> + 新增 </el-button>
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
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="businessName" label="店铺名"> </el-table-column>
        <el-table-column prop="businessPlace" label="店铺地址"> </el-table-column>
        <el-table-column prop="status" label="商家类别" :formatter="Formatter">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <!-- <el-table-column prop="disable" dispaly="none"></el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleStop(scope.row)"
              >{{ scope.row.disable == 0 ? "取消禁用" : "禁用" }}</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
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
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: "",
        businessName: "",
        businessPlace: "",
        status: "",
        email: "",
      },
      rules: {
        name: [{ required: true, message: "请输入姓名" }],
        status: [{ required: true, message: "请选择类型" }],
        businessName: [{ required: true, message: "请输入店铺名" }],
        businessPlace: [{ required: true, message: "请输入店铺地址" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
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
    };
  },
  mounted() {
    // 展示所有商家
    this.getList();
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //添加商家
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form, "form");
          if (this.modelType === true) {
            //添加用户
            //把表单消息传到后端
            this.$http
              .post("/managerBusiness/add", {
                name: this.form.name,
                status: this.form.status,
                email: this.form.email,
              })
              .then((response) => {
                console.log(response);
                const code = response.data.code;
                if (code === 0) {
                  alert(response.data.msg);
                } else {
                  alert(response.data.data);
                }
                this.getList();
              });
          } 
          //清空表单
          this.$refs.form.resetFields();
          // 关闭弹窗
          this.dialogVisible = false;
        } else {
          alert("消息提交错误");
        }
      });
    },
    // 弹窗关闭时触发
    handleClose() {
      //清空表单
      this.$refs.form.resetFields();
      // 关闭弹窗
      this.dialogVisible = false;
    },
    // 取消弹窗
    cancel() {
      this.handleClose();
    },
    //新增商家
    handleAdd() {
      this.modelType = true;
      this.dialogVisible = true;
      this.form = [];
    },
    // 禁用商家
    handleStop(row) {
      const manager = JSON.parse(JSON.stringify(row));
      this.$http
              .post("/managerBusiness/stop", {
                email : manager.email,
                disable : manager.disable
              })
              .then((response) => {
                console.log(response);
                this.getList();
              });
    },
    // 删除商家
    handleDelete(row) {
      const email = JSON.parse(JSON.stringify(row)).email;
      this.$confirm("此操作将永久删除该商家, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete("/managerBusiness/delete/" + email)
            .then((response) => {
              console.log(response);
              this.$message({
                type: "success",
                message: response.data.data,
              });
              this.pageData.page = 1;
              this.getList();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //搜索查询
    onSumit() {
      this.getList();
    },
    //获得所有的用户
    getList() {
      this.$http
        .get(
          "/selectBusiness/allBusiness/" +
            this.pageData.page +
            "/" +
            this.pageData.limit,
          {
            params: {
              name: this.userForm.name,
            },
          }
        )
        .then((response) => {
          console.log(response.data.data);
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
    //显示商家类别
    Formatter(row, column) {
      if (row.status == 1) {
        return "机票";
      } else if (row.status == 2) {
        return "酒店";
      } else if (row.status === 3) {
        return "景点";
      } else if (row.status === 4) {
        return "火车";
      } else if (row.status === 5) {
        return "高铁";
      }
    },
  },
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