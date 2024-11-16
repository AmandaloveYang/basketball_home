<template>
  <div class="rank-card">
    <div class="card-header">
      <span class="title">{{ title }}</span>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%"
      :header-cell-style="headerStyle"
    >
      <el-table-column type="index" label="排名" width="60" align="center" />
      <el-table-column label="球队" prop="team" min-width="160" />
      <el-table-column label="胜" prop="wins" width="60" align="center" />
      <el-table-column label="负" prop="losses" width="60" align="center" />
      <el-table-column
        label="胜率"
        prop="wins_rate"
        width="80"
        align="center"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "RankTable",
  props: {
    title: {
      type: String,
      required: true,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      headerStyle: {
        background: "#f5f7fa",
        color: "#606266",
        fontWeight: "bold",
        textAlign: "center",
      },
    };
  },
};
</script>

<style lang="less" scoped>
.rank-card {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;

  .card-header {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
    background: #fff;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }
  }

  :deep(.el-table) {
    .el-table__header-wrapper {
      th {
        padding: 8px 0;
        background: #f5f7fa;
      }
    }

    .el-table__row {
      td {
        padding: 8px 0;
      }
    }
  }
}
</style>
