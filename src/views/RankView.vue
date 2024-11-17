<template>
  <div class="rank-container">
    <div class="dashboard-container">
      <div class="content-wrapper">
        <!-- 左侧图片 -->
        <div class="side-image">
          <img src="@/assets/curry.jpg" alt="东部联盟" />
        </div>

        <!-- 中间排名表格 -->
        <div class="rank-cards">
          <el-card class="rank-wrapper">
            <div class="tables-container">
              <!-- 东部排名 -->
              <rank-table
                title="NBA东部联盟"
                :table-data="eastData"
                :loading="loading"
              />

              <!-- 西部排名 -->
              <rank-table
                title="NBA西部联盟"
                :table-data="westData"
                :loading="loading"
              />
            </div>
          </el-card>
        </div>

        <!-- 右侧图片 -->
        <div class="side-image">
          <img src="@/assets/jp.jpg" alt="西部联盟" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { rankList } from "@/api/basketball";
import RankTable from "@/components/RankTable.vue";

export default {
  name: "RankView",
  components: {
    RankTable,
  },
  data() {
    return {
      loading: true,
      eastData: [],
      westData: [],
    };
  },
  async created() {
    try {
      const res = await rankList();
      if (res.error_code === 0) {
        const ranking = res.result.ranking;
        if (ranking && Array.isArray(ranking)) {
          this.eastData = ranking[0].list || [];
          this.westData = ranking[1].list || [];
        }
      } else {
        this.$message.error(res.reason || "获取排名数据失败");
      }
    } catch (error) {
      console.error("获取排名数据失败:", error);
      this.$message.error("获取排名数据失败");
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style lang="less" scoped>
.rank-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;

  @media screen and (max-width: 768px) {
    padding: 10px;
  }

  .dashboard-container {
    max-width: 1800px;
    margin: 0 auto;
    margin-top: 20px;

    @media screen and (max-width: 768px) {
      margin: 0;
    }

    .content-wrapper {
      display: flex;
      gap: 30px;
      align-items: flex-start;

      @media screen and (max-width: 768px) {
        gap: 15px;
      }

      .side-image {
        flex: 0 0 350px;
        height: 800px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        overflow: hidden;
        position: sticky;
        top: 20px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;

          &:hover {
            transform: scale(1.05);
          }
        }

        @media (max-width: 1600px) {
          display: none;
        }
      }

      .rank-cards {
        flex: 1;
        min-width: 800px;

        @media screen and (max-width: 768px) {
          min-width: 100%;
        }

        .rank-wrapper {
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

          @media screen and (max-width: 768px) {
            padding: 10px;
            border-radius: 4px;
          }

          .tables-container {
            display: flex;
            gap: 30px;
            flex-wrap: nowrap;

            @media screen and (max-width: 768px) {
              flex-direction: column;
              gap: 15px;
            }

            :deep(.rank-card) {
              flex: 1;
              min-width: 0;
              box-shadow: none;
              border: 1px solid #ebeef5;
              border-radius: 4px;

              @media screen and (max-width: 768px) {
                margin-bottom: 10px;

                &:last-child {
                  margin-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
