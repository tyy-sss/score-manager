<template>
  <div class="user">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="50%"
    >
      <!-- 商家酒店的表单消息 -->
      <el-form
        ref="form"
        :rules="rules"
        :inline="true"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="商品名" prop="name">
          <el-input placeholder="请输入商品名" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="票数" prop="num">
          <el-input placeholder="请输入票数" v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input placeholder="请输入价格" v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="入住时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            placeholder="选择日期时间"
            :picker-options="editStartOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离开时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            placeholder="选择日期时间"
            :picker-options="editStopOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input placeholder="请输入折扣" v-model="form.discount"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <img
            :src="avatar"
            @click="uploadImg"
            height="200px"
            width="200px"
            class="uploadImg"
          />
          <my-upload
            :modelValue.sync="imagecropperShow"
            :key="imagecropperKey"
            lang-type="zh"
            img-format="png"
            @crop-success="cropSuccess"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"
            url="http://localhost:8088/upload"
          ></my-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            maxlength="200"
            show-word-limit
            style="width: 500px"
            type="textarea"
            placeholder="请输入描述"
            v-model="form.description"
          ></el-input>
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
        <el-table-column label="商品名" prop="name"></el-table-column>
        <el-table-column label="库存" prop="stock"></el-table-column>
        <el-table-column label="票数" prop="num" width="60px"></el-table-column>
        <el-table-column
          label="价格"
          prop="price"
          width="60px"
        ></el-table-column>
        <el-table-column
          label="折扣"
          prop="discount"
          width="60px"
        ></el-table-column>
        <el-table-column
          label="入住时间"
          prop="startTime"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column
          label="结束时间"
          prop="startTime"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column label="图片" prop="img">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <img :src="scope.row.img" min-width="70" height="70" />
          </template>
          >
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          show-overflow-tooltip
        ></el-table-column>
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
// 使用头像上传组件
import myUpload from "vue-image-crop-upload";
import { mapGetters } from "vuex";
import upload from "@/assets/picture/upload.png";

export default {
  data() {
    return {
      //设置初始值
      imagecropperShow: false,
      imagecropperKey: 0,
      avatar: upload,
      dialogVisible: false,
      form: {
        id: "",
        name: "",
        num: "",
        price: "",
        discount: "",
        img: "",
        description: "",
        startTime: "",
        endTime: "",
      },
      rules: {
        name: [{ required: true, message: "请输入商品名" }],
        num: [{ required: true, message: "请输入票数" }],
        price: [{ required: true, message: "请输入价格" }],
        img: [{ required: true, message: "请上传图片" }],
        description: [{ required: true, message: "请输入描述" }],
        startTime: [{ required: true, message: "请输入入住时间" }],
        endTime: [{ required: true, message: "请输入结束时间" }],
      },
      //开始时间与结束时间
      editStartOptions: {
        disabledDate: (time) => {
          if (!this.form.endTime) {
            return time.getTime() < new Date(2022 - 1 - 1).getTime(); //禁止选择1970年以前的日期
          } else {
            return time.getTime() > new Date(this.form.endTime);
          }
        },
      },
      editStopOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() < new Date(this.form.startTime) ||
            time.getTime() < new Date(1922 - 1 - 1).getTime() //禁止选择1970年以前的日期
          );
        },
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
            //添加商品
            //把表单消息传到后端
            const id = JSON.parse(localStorage.getItem("user")).id;
            this.$http
              .post("/managerHotel/add/" + id, {
                name: this.form.name,
                img: this.form.img,
                description: this.form.description,
                num: this.form.num,
                price: this.form.price,
                discount: this.form.discount,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
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
            //编辑商品
            this.$http
              .post("/managerHotel/changeHotel", {
                id: this.form.id,
                name: this.form.name,
                img: this.form.img,
                description: this.form.description,
                num: this.form.num,
                price: this.form.price,
                discount: this.form.discount,
                num: this.form.num,
                price: this.form.price,
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
      this.avatar = this.form.img;
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
              "/managerHotel/deleteHotel/" +
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
          "/selectHotel/allTicket/" +
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
          console.log(response, "hotel");
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

    //图片文件
    cropSuccess(imgDataUrl, field) {
      console.log("-------- crop success --------");
      console.log(imgDataUrl);
      //把头像设置成上传的图片
      this.avatar = imgDataUrl;
      console.log(field);
    },
    //上传成功回调
    cropUploadSuccess(res, originPicName) {
      //res是后端返回的结果，originPicName是后端接收到图片的名字
      console.log("-------- upload success --------");
      console.log(res.data);
      this.form.img = res.data;
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    //上传失败回调
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log("上传失败状态" + status);
      console.log("field: " + field);
    },
    //上传图片
    uploadImg() {
      this.imagecropperShow = true;
      this.form.img = this.avatar;
    },
  },
  components: {
    "address-choose": AddressChoose,
    "my-upload": myUpload,
  },
};
</script>
<style lang="less" scoped>
.uploadImg {
  width: 200px;
  height: 200px;
  border: 1px solid black;
}
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