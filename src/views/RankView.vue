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
  methods: {
    async fetchRankData() {
      try {
        const res = await rankList();
        if (res.resultcode === "112") {
          throw new Error(res.reason || "超过API调用限制");
        }

        if (res?.result?.ranking) {
          const [eastRanking, westRanking] = res.result.ranking;

          this.eastData = eastRanking.list.map((team) => ({
            team: team.team,
            wins: team.wins,
            losses: team.losses,
            wins_rate: parseFloat(team.wins_rate) / 100,
          }));

          this.westData = westRanking.list.map((team) => ({
            team: team.team,
            wins: team.wins,
            losses: team.losses,
            wins_rate: parseFloat(team.wins_rate) / 100,
          }));
        }
      } catch (error) {
        console.error("获取排名数据失败:", error);
        this.$message.error(
          error.message || "获取排名数据失败，请检查网络连接",
        );
      } finally {
        this.loading = false;
      }
    },
  },

  created() {
    this.fetchRankData();
  },
};
</script>

<style lang="less" scoped>
.rank-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;

  .dashboard-container {
    max-width: 1800px;
    margin: 0 auto;
    margin-top: 20px;

    .content-wrapper {
      display: flex;
      gap: 30px;
      align-items: flex-start;

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

        .rank-wrapper {
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

          .tables-container {
            display: flex;
            gap: 30px;

            :deep(.rank-card) {
              flex: 1;
              min-width: 0;
              box-shadow: none;
              border: 1px solid #ebeef5;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .rank-container {
    padding: 10px;

    .dashboard-container {
      margin: 0;

      .content-wrapper {
        gap: 15px;

        .rank-cards {
          min-width: 100%;

          .rank-wrapper {
            padding: 10px;
            border-radius: 4px;

            .tables-container {
              flex-direction: column;
              gap: 15px;

              :deep(.rank-card) {
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
