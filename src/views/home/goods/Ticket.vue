<template>
  <div class="user">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="50%"
    >
      <!-- 商家的机票的表单消息 -->
      <el-form
        ref="form"
        :rules="rules"
        :inline="true"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="起始位置" prop="startPlace">
          <el-input
            placeholder="请输入起始位置"
            v-model="form.startPlace"
          ></el-input>
        </el-form-item>
        <el-form-item label="终止位置" prop="endPlace">
          <el-input
            placeholder="请输入终止位置"
            v-model="form.endPlace"
          ></el-input>
        </el-form-item>
        <el-form-item label="发车时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            placeholder="选择日期时间"
            :picker-options="editStartOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到达时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            placeholder="选择日期时间"
            :picker-options="editStopOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="票数" prop="num">
          <el-input placeholder="请输入票数" v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input placeholder="请输入价格" v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input placeholder="请输入折扣" v-model="form.discount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <div class="manager-header">
      <el-button @click="handleAdd" type="primary"  v-if="this.status !== 0"> + 新增 </el-button>
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
        <el-table-column label="编号" prop="id" width="60px"></el-table-column>
        <el-table-column label="起始位置" prop="startPlace"> </el-table-column>
        <el-table-column label="终止位置" prop="endPlace"></el-table-column>
        <el-table-column
          label="发车时间"
          prop="startTime"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column
          label="到达时间"
          prop="startTime"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column label="票数" prop="num" width="80px"></el-table-column>
        <el-table-column label="库存" prop="stock" width="80px"></el-table-column>
        <el-table-column label="价格" prop="price" width="80px"></el-table-column>
        <el-table-column label="折扣" prop="discount" width="80px"></el-table-column>
        <el-table-column label="操作"  v-if="this.status !== 0">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
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
import AddressChoose from "@/components/utils/AddressChoose";

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        id: "",
        startPlace: "",
        endPlace: "",
        startTime: "",
        endTime: "",
        num: "",
        price: "",
        discount: "",
      },
      rules: {
        startPlace: [{ required: true, message: "请输入起始位置" }],
        endPlace: [{ required: true, message: "请输入终止位置" }],
        startTime: [{ required: true, message: "请输入发车时间" }],
        endTime: [{ required: true, message: "请输入到达时间" }],
        num: [{ required: true, message: "请输入票数" }],
        price: [{ required: true, message: "请输入价格" }],
      },
      //开始时间与结束时间
      editStartOptions: {
        disabledDate: time => {
          if (!this.form.endTime) {
            return time.getTime() < new Date(2022 - 1 - 1).getTime();   //禁止选择1970年以前的日期
          } else {
            return time.getTime() > new Date(this.form.endTime);
          }
        }
      },
      editStopOptions: {
        disabledDate: time => {
          return (
            time.getTime() < new Date(this.form.startTime) ||
            time.getTime() < new Date(1922 - 1 - 1).getTime()    //禁止选择1970年以前的日期
          );
        }
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
      status:"",
      total: 0,
    };
  },
  mounted() {
    // 展示所有机票
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
    //添加商品 编辑商品
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log(this.form, "form");
          const token = localStorage.getItem("token");
          if (this.modelType === true) {
            //添加用户
            //把表单消息传到后端
            const id = JSON.parse(localStorage.getItem("user")).id;
            this.$http
              .post("/managerTicket/add/" + id, {
                startPlace: this.form.startPlace,
                endPlace: this.form.endPlace,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                num: this.form.num,
                price: this.form.price,
                discount: this.form.discount,
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
              .post("/managerTicket/changeTicket", {
                id: this.form.id,
                startPlace: this.form.startPlace,
                endPlace: this.form.endPlace,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                num: this.form.num,
                price: this.form.price,
                discount: this.form.discount,
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
    //新增商品
    handleAdd() {
      this.modelType = true;
      this.dialogVisible = true;
      this.form = [];
    },
    // 编辑商品
    handleEdit(row) {
      this.modelType = false;
      this.dialogVisible = true;
      //弹窗内容回显,需要对当前行数据进行深拷贝，否则会出错
      this.form = JSON.parse(JSON.stringify(row));
    },
    // 删除商品
    handleDelete(row) {
      const id = JSON.parse(JSON.stringify(row)).id;
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete(
              "/managerTicket/deleteTicket/" +
                id +
                "/" +
                localStorage.getItem("token")
            )
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
    //获得所有的机票
    getList() {
      this.status = JSON.parse(localStorage.getItem("user")).status;
      const id = JSON.parse(localStorage.getItem("user")).id;
      this.$http
        .get(
          "/selectTicket/allTicket/" +
            id +
            "/" +
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
          console.log(response, "ticket");
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
  computed: {
  }
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