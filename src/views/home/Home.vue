<template>
  <el-row>
    <el-col :span="8" style="padding-right: 10px">
      <!-- 个人信息 -->
      <el-card class="box-card">
        <div class="user">
          <img src="../../assets/picture/personal.png" alt="" />
          <div class="userinfo">
            <p class="name">Admin</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2022-10-28 00:00:00</span></p>
        </div>
      </el-card>
      <!-- 订单信息预览 -->
      <el-card style="margin-top: 20px; height: 460px">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column
            v-for="(val, key) in tabelLabel"
            :key="key"
            :prop="key"
            :label="val"
          />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="padding-left: 10px">
      <div class="num">
        <el-card
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <i
            class="icon"
            :class="`el-icon-${item.icon}`"
            :style="{ background: item.color }"
          ></i>
          <div class="detail">
            <p class="price">￥{{ item.value }}</p>
            <p class="desc">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 折线图 -->
      <el-card style="height: 280px">
        <div ref="echarts1" style="height: 280px"></div>
      </el-card>
      <div class="graph" style="height: 260px">
        <el-card>
          <div ref="echarts2" style="height: 260px"></div>
        </el-card>
        <el-card>
          <div ref="echarts3" style="height: 260px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="less" scoped>
.user {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  // 垂直居中
  align-items: center;
  img {
    // 向右的边距
    margin-right: 40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .userinfo {
    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .access {
      color: #9999;
    }
  }
}
.login-info {
  p {
    line-height: 28px;
    font-size: 14px;
    color: #9999;
    span {
      color: #666666;
      margin-left: 60px;
    }
  }
}
.num {
  display: flex;
  // 多余的会自己的重新排列成一行
  flex-wrap: wrap;
  // 让item贴边
  justify-content: space-between;
  .icon {
    width: 80px;
    height: 80px;
    font-size: 30px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }
  .detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;
    .price {
      font-size: 30px;
      margin-bottom: 10px;
      line-height: 30px;
      height: 30px;
    }
    .desc {
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }
  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
}
.graph {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  .el-card {
    width: 48%;
  }
}
</style>
<script>
import * as echarts from "echarts";
import userData from "@/api/data/mockData/userData";

export default {
  data() {
    return {
      tableData: [],
      tabelLabel: {
        name: "类型",
        todayBuy: "今日购买",
        monthBuy: "月销售量",
        totalBuy: "总销售量",
      },
      countData: [
        {
          name: "今日支付订单",
          value: 1234,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单",
          value: 1234,
          icon: "star-on",
          color: "#2ec7c9",
        },
        {
          name: "今日未支付订单",
          value: 1234,
          icon: "goods",
          color: "#2ec7c9",
        },
      ],
    };
  },
  mounted() {
    this.$http.get('/managerHome/getData').then(({ data }) => {
      // console.log(data)
      const { tableData } = data.data;
      // console.log(tableData)
      this.tableData = tableData;

      //基于准备好的dom，初始化echarts实例
      const echarts1 = echarts.init(this.$refs.echarts1);
      let eachartsOption = {};
      const { orderData, userData, videoData } = data.data;
      const xAxis = Object.keys(orderData.data[0]);
      const xAxisData = {
        data: xAxis,
      };
      eachartsOption.xAxis = xAxisData;
      eachartsOption.yAxis = {};
      eachartsOption.legend = xAxisData;
      eachartsOption.series = [];
      xAxis.forEach((key) => {
        eachartsOption.series.push({
          name: key,
          data: orderData.data.map((item) => item[key]),
          type: "line",
        });
      });
      console.log(eachartsOption);
      // 使用刚指定的配置项和数据显示图表
      echarts1.setOption(eachartsOption);

      // 柱状图
      const echarts2 = echarts.init(this.$refs.echarts2);
      var echarts2Option = {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: "#333",
          },
        },
        grid: {
          left: "20%",
        },
        // 提示框
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category", // 类目轴
          data: userData.map((item) => item.date),
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
          axisLabel: {
            interval: 0,
            color: "#333",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
          },
        ],
        color: ["#2ec7c9", "#b6a2de"],
        series: [
          {
            name: "新增用户",
            data: userData.map((item) => item.new),
            type: "bar",
          },
          {
            name: "活跃用户",
            data: userData.map((item) => item.active),
            type: "bar",
          },
        ],
      };
      // 配置
      echarts2Option.xAxis.data = userData.map((item) => item.date);
      echarts2Option.series = [
        {
          name: "新增用户",
          data: userData.map((item) => item.new),
          // 类型:bar是柱状图
          type: "bar",
        },
        {
          name: "活跃用户",
          data: userData.map((item) => item.active),
          type: "bar",
        },
      ];
      echarts2.setOption(echarts2Option);

      //饼状图
      const echarts3 = echarts.init(this.$refs.echarts3);
      const eacharts3Option = {
        tooltip: {
          trigger: "item",
        },
        color: [
          "#0f78f4",
          "#dd536b",
          "#9462e5",
          "#a6a6a6",
          "#e1bb22",
          "#39c362",
          "#3ed1cf",
        ],
        series: [
          {
            data: videoData,
            type: 'pie'
          },
        ],
      };
      echarts3.setOption(eacharts3Option)
    });
  },
};
</script>