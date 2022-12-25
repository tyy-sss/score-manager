<template>
  <div class="tabs">
    <el-tag
      v-for="(item, index) in tags"
      :key="item.path"
      :closable="item.name !== 'home'"
      :effect="$route.name === item.name ? 'dark' : 'plain'"
      @click="changeMenu(item)"
      @close="handleClose(item, index)"
      size="small"
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "CommonTag",
  data() {
    return {};
  },
  computed: {
    // 使用扩展运算符（...）返回一个对象
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  methods: {
    ...mapMutations(["closeTag"]),
    test(){
      this.$router.push({ name: 'test'});
    },
    // 点击标签进行界面跳转
    changeMenu(item) {
      this.$router.push({ name: item.name });
    },
    //删除标签
    handleClose(item, index) {
      //调用store中的mutation
      this.closeTag(item);
      const length = this.tags.length;
      //删除之后的逻辑
      if(item.name !== this.$route.name){
        return;
      }
      //表示的是删除的最后一项
      if( index === length ){
         this.$router.push({
            name: this.tags[index-1].name
         })
      }else{
        this.$router.push({
            name: this.tags[index].name
         })
      }
    },
  },
  mounted() {
    console.log(this.$route.name, this.tags);
  },
};
</script>
<style lang="less" scoped>
.tabs {
 padding: 20px;
 .el-tag{
    margin-right: 15px;
    cursor: pointer;
 }
}
</style>