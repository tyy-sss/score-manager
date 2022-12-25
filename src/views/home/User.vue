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
        <el-form-item label="年龄" prop="age">
          <el-input placeholder="请输入年龄" v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select placeholder="请选择性别" v-model="form.sex">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择时间"
          >
          </el-date-picker>
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
        <el-table-column prop="age" label="性别" width="80px">
        </el-table-column>
        <el-table-column prop="sex" label="年龄" width="80px">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期"
          :formatter="formatDate"
        >
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="handleStop(scope.row)"
              >{{ scope.row.status == 0 ? "取消禁用" : "禁用" }}</el-button
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
        username: "",
        age: "",
        sex: "",
        birthday: "",
        email: "",
      },
      rules: {
        name: [{ required: true, message: "请输入姓名" }],
        age: [{ required: true, message: "请输入年龄" }],
        sex: [{ required: true, message: "请选择性别" }],
        birthday: [{ required: true, message: "请选择出生日期" }],
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
    // 展示所有用户
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
    //添加用户 编辑用户
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form, "form");
          if (this.modelType === true) {
            //添加用户
            //把表单消息传到后端
            this.$http
              .post("/managerUser/add", {
                name: this.form.name,
                age: this.form.age,
                sex: this.form.sex,
                birthday: this.form.birthday,
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
          } else {
            // 编辑用户
            this.$http
              .post("/managerUser/changeUser", {
                name: this.form.name,
                age: this.form.age,
                sex: this.form.sex,
                birthday: this.form.birthday,
                email: this.form.email,
              })
              .then((response) => {
                console.log(response);
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
    //新增用户
    handleAdd() {
      this.modelType = true;
      this.dialogVisible = true;
      this.form = [];
    },
    // 编辑用户
    handleEdit(row) {
      this.modelType = false;
      this.dialogVisible = true;
      //弹窗内容回显,需要对当前行数据进行深拷贝，否则会出错
      this.form = JSON.parse(JSON.stringify(row));
    },
    //禁用用户
    handleStop(row) {
      const user = JSON.parse(JSON.stringify(row));
      this.$http
        .post("/managerUser/stopUser", {
          email: user.email,
          status: user.status,
        })
        .then((response) => {
          console.log(response);
          alert(response.data.data);
          this.getList();
        });
    },
    // 删除用户
    handleDelete(row) {
      const email = JSON.parse(JSON.stringify(row)).email;
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete("/managerUser/deleteUser/" + email)
            .then((response) => {
              console.log(response);
              this.$message({
                type: "success",
                message: response.data.data,
              });
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
          "/selectUser/allUsers/" +
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