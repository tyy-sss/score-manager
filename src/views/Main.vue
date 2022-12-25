<template>
  <div>
    <el-container>
      <el-aside width="auto">
        <common-aside></common-aside>
      </el-aside>
      <el-container>
        <el-header>
          <common-header></common-header>
        </el-header>
        <common-tag></common-tag>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import CommonAside from "@/components/common/CommonAside.vue";
import CommonHeader from "@/components/common/CommonHeader.vue";
import CommonTag from "@/components/common/CommonTag.vue";

export default {
  setup() {},
  components: {
    "common-aside": CommonAside,
    "common-header": CommonHeader,
    "common-tag": CommonTag,
  },
  // 绑定窗口关闭监听事件
  mounted() {
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) =>
      this.beforeunloadHandler(e)
    );
  },
  methods: {
    beforeunloadHandler(e) {
      //退出登录，删除token
      localStorage.removeItem("token");
      //清除store中的所有值
      this.$store.commit("clear");
    },
  },
};
</script>
<style lang="less">
html,
body,
h3 {
  margin: 0;
  padding: 0;
}
.el-header {
  padding: 0;
}
</style>