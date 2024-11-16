<template>
  <div class="game-list-container">
    <div class="dashboard-container">
      <div class="search-container">
        <el-input
          v-model="searchTeam"
          placeholder="请输入球队名称"
          class="search-input"
          clearable
          @clear="handleClear"
          @input="handleSearch"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="handleSearch" />
          </template>
        </el-input>

        <el-button type="primary" class="ranking-btn" @click="goToRanking">
          球队排名
        </el-button>
      </div>

      <div v-if="searchTeam" class="search-results">
        <el-card class="search-result-card">
          <div v-if="searchResults.length > 0">
            <div class="result-title">搜索结果：</div>
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="result-item"
            >
              <div class="result-date">{{ result.date }}</div>
              <div class="result-match">
                <span :class="{ winner: result.isHomeWinner }">
                  <img
                    :src="result.homeLogo"
                    class="team-logo"
                    alt=""
                    referrerpolicy="no-referrer"
                    @error="handleImageError"
                  />
                  {{ result.homeTeam }}
                </span>
                <span class="score"
                  >{{ result.homeScore }} - {{ result.awayScore }}</span
                >
                <span :class="{ winner: result.isAwayWinner }">
                  <img
                    :src="result.awayLogo"
                    class="team-logo"
                    alt=""
                    referrerpolicy="no-referrer"
                    @error="handleImageError"
                  />
                  {{ result.awayTeam }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="no-result">
            <i class="el-icon-warning-outline" />
            <span
              >未找到"{{ searchTeam }}"的比赛记录，请输入正确的球队名称</span
            >
          </div>
        </el-card>
      </div>
      <!-- 比赛卡片 -->
      <div class="game-container">
        <el-col v-for="item in gameList" :key="item.dayBlock" class="game-item">
          <el-card v-loading="loading" class="box-card" shadow="always">
            <template #header>
              <div class="clearfix">
                <div>{{ item.dayBlock }}</div>
                <div>
                  {{ item.matchList[0].competitionStageDesc }}
                  ({{ item.matchList[0].matchStatusChinese }})
                </div>
              </div>
            </template>
            <div
              v-for="(match, matchIndex) in item.matchList"
              :key="matchIndex"
              class="text item"
              style="margin-top: 10px"
              @click="showMatchStats(match)"
            >
              <div class="match-time">
                <span v-if="match.frontEndMatchStatus" class="match-status">
                  {{ match.frontEndMatchStatus.desc }}
                </span>
              </div>
              <div class="schedule">
                <div class="team">
                  <div class="team-row">
                    <img
                      :src="match.homeTeamLogo"
                      class="team-logo"
                      alt=""
                      referrerpolicy="no-referrer"
                      @error="handleImageError"
                    />
                    {{ match.homeTeamName }}
                    <span
                      v-if="
                        match.matchStatusChinese === '已结束' &&
                        match.homeScore > match.awayScore
                      "
                      class="win-mark"
                      >✓</span
                    >
                    <span class="score">{{ match.homeScore }}</span>
                  </div>
                  <div class="team-row">
                    <img
                      :src="match.awayTeamLogo"
                      class="team-logo"
                      alt=""
                      referrerpolicy="no-referrer"
                      @error="handleImageError"
                    />
                    {{ match.awayTeamName }}
                    <span
                      v-if="
                        match.matchStatusChinese === '已结束' &&
                        match.awayScore > match.homeScore
                      "
                      class="win-mark"
                      >✓</span
                    >
                    <span class="score">{{ match.awayScore }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </div>
      <el-main>
        <el-select
          v-model="form.time"
          placeholder="请选择时间"
          default-first-option
        >
          <el-option
            v-for="(item, index) in time"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
        <div id="main" />
        <!-- 这是用来展示echarts图表的容器 -->
      </el-main>
    </div>
  </div>
</template>

<script>
import { hupuScheduleList } from "@/api/basketball.js";
import * as echarts from "echarts";
export default {
  name: "GameView",
  data() {
    return {
      gameList: [], // 每周的赛程
      matchList: [], // 每天比赛的信息
      loading: true,
      form: {
        time: "", // 选择的时间
      },
      time: "",
      Option: {}, // echarts的Option
      searchTeam: "", // 搜索关键词
      searchResults: [], // 搜索结果
      logo: {
        homeTeamLogo: "",
        awayTeamLogo: "",
      },
      defaultLogoUrl: "https://example.com/default-logo.png", // 设置一个默认的logo图片URL
      pollingTimer: null,
      pollingInterval: 10000, // 10秒轮询一次
      statsDialogVisible: false,
      statsLoading: false,
      currentMatch: null,
      matchStats: null,
    };
  },
  computed: {
    timeList() {
      return this.gameList.map((item) => item.dayBlock);
    },
  },
  watch: {
    "form.time"(val) {
      const dayBlock = this.gameList.map((item) => item.dayBlock); // 每天的时间
      const teams = this.matchList.map((item) =>
        item.map((item) => `${item.homeTeamName} vs ${item.awayTeamName}`),
      ); // echarts的Option的data数据
      if (dayBlock.includes(val)) {
        const { matchList } = this.gameList.find(
          (game) => game.dayBlock === val,
        );
        const selectDayGames = teams[dayBlock.indexOf(val)];
        const homeScores = [];
        const awayScores = [];
        matchList.forEach((item) => {
          homeScores.push(item.homeScore);
          awayScores.push(item.awayScore);
        });
        const optionSeries = [
          {
            type: "bar",
            data: homeScores,
            barGap: "20%",
            barCategoryGap: "40%",
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#666",
              },
            },
          },
          {
            type: "bar",
            data: awayScores,
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#666",
              },
            },
          },
        ];
        this.Option = {
          xAxis: {
            data: selectDayGames,
          },
          yAxis: {},
          series: optionSeries,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
        };
      }
      var myChart = echarts.init(document.getElementById("main"));
      myChart.setOption(this.Option);
      window.addEventListener("resize", function () {
        myChart.resize(); // 监听窗口大小变化，自动调整图表大小
      });
    },
    "match.homeScore"() {
      this.updateChartData();
    },
    "match.awayScore"() {
      this.updateChartData();
    },
  },
  async created() {
    this.Option = {}; // 初始化echarts的Option
    try {
      const res = JSON.parse(JSON.stringify(await hupuScheduleList()));
      this.gameList = res.result.gameList;
      if (res.status === 200) this.loading = false;
      this.matchList = this.gameList.map((item) => item.matchList);
      // 提取每场比赛的球队logo
      this.gameList.forEach((game) => {
        game.matchList.forEach((match) => {
          this.logo.homeTeamLogo = match.homeTeamLogo;
          this.logo.awayTeamLogo = match.awayTeamLogo;
        });
      });
      this.time = this.gameList.map((item) => item.dayBlock);
      // 直接设置默认值为"今天"
      const defaultValue = this.time.find((date) => date.includes("今天"));
      this.form.time = defaultValue || this.time[0];

      // 确保在数据加载完成后立即触发 watch
      this.$nextTick(() => {
        if (this.form.time) {
          // 手动触发一次 watch
          this.$watch("form.time", this.$options.watch["form.time"]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    this.fetchMatchData();
    this.startPolling();
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    this.stopPolling(); // 组件销毁前清除定时器
  },
  methods: {
    // 初始化和更新图表
    initChart(option) {
      const myChart = echarts.init(document.getElementById("main"));
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    handleSearch() {
      if (!this.searchTeam) {
        this.searchResults = [];
        return;
      }

      const results = [];
      this.gameList.forEach((game) => {
        game.matchList.forEach((match) => {
          if (
            match.homeTeamName.includes(this.searchTeam) ||
            match.awayTeamName.includes(this.searchTeam)
          ) {
            results.push({
              date: game.dayBlock,
              homeTeam: match.homeTeamName,
              awayTeam: match.awayTeamName,
              homeScore: match.homeScore,
              awayScore: match.awayScore,
              isHomeWinner: match.homeScore > match.awayScore,
              isAwayWinner: match.awayScore > match.homeScore,
              homeLogo: match.homeTeamLogo,
              awayLogo: match.awayTeamLogo,
            });
          }
        });
      });
      this.searchResults = results;
    },
    formatMatchTime(timeStr) {
      if (!timeStr) return "";
      const time = timeStr.split(" ")[1].substring(0, 5);
      return time;
    },
    handleClear() {
      this.searchTeam = "";
      this.searchResults = [];
    },
    // 添加图片加载错误处理方法
    handleImageError(e) {
      // 当图片加载失败时，使用默认图片
      e.target.src = this.defaultLogoUrl;
      // 防止默认图片也载失败导致无限循环
      e.target.onerror = null;
    },
    // 获取比赛数据的方法
    async fetchMatchData() {
      try {
        const res = JSON.parse(JSON.stringify(await hupuScheduleList()));
        if (res.status === 200) {
          this.gameList = res.result.gameList;
          this.loading = false;
          this.updateChartData();
        }
      } catch (error) {
        console.error("获取比赛数据失败:", error);
      }
    },

    // 更新图表数据
    updateChartData() {
      if (this.form.time) {
        const { matchList } = this.gameList.find(
          (game) => game.dayBlock === this.form.time,
        );

        const homeScores = [];
        const awayScores = [];
        const teams = [];

        matchList.forEach((match) => {
          homeScores.push(match.homeScore);
          awayScores.push(match.awayScore);
          teams.push(`${match.homeTeamName} vs ${match.awayTeamName}`);
        });

        const newOption = {
          xAxis: {
            data: teams,
          },
          yAxis: {},
          series: [
            {
              type: "bar",
              data: homeScores,
              barGap: "20%",
              barCategoryGap: "40%",
              label: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#666",
                },
              },
            },
            {
              type: "bar",
              data: awayScores,
              label: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#666",
                },
              },
            },
          ],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
        };

        const myChart = echarts.init(document.getElementById("main"));
        myChart.setOption(newOption);
      }
    },

    // 开始轮询
    startPolling() {
      this.pollingTimer = setInterval(() => {
        // 检查是否有正在进行的比赛
        const hasOngoingMatch = this.gameList.some((game) =>
          game.matchList.some((match) => match.matchStatusChinese === "进行中"),
        );

        if (hasOngoingMatch) {
          this.fetchMatchData();
        } else {
          this.stopPolling();
        }
      }, this.pollingInterval);
    },

    // 停止轮询
    stopPolling() {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
    },

    // 添加跳转方法
    goToRanking() {
      this.$router.push("/rank");
    },
  },
};
</script>

<style lang="less" scoped>
.dashboard {
  &-container {
    margin: 30px;
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 20px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.box-card {
  background-color: #ffffff;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
}

.clearfix {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.schedule {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.score {
  color: #f56c6c;
  font-weight: bold;
}

#main {
  height: 400px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.row-margin {
  margin-bottom: 30px;
}

.win-mark {
  color: #f56c6c;
  margin-left: 4px;
  font-weight: bold;
}

.el-main {
  background-color: transparent;
  .el-select {
    margin-bottom: 20px;
  }
}

.text.item {
  &:hover {
    background-color: #fafafa;
    border-radius: 4px;
  }
}

.team {
  flex: 1;

  .team-row {
    padding: 4px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .team-logo {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      object-fit: contain;
    }

    .score {
      color: #f56c6c;
      font-weight: bold;
      margin-left: auto; // 将分数推到右边
      min-width: 30px; // 保持分数宽度一致
      text-align: right;
    }
  }
}

.game-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-left: 50px;
}

.game-item {
  flex: 0 0 calc(20% - 24px);
  min-width: 250px;
}

// 响应式布局
@media screen and (max-width: 1600px) {
  .game-item {
    flex: 0 0 calc(25% - 24px);
  }
}

@media screen and (max-width: 1200px) {
  .game-item {
    flex: 0 0 calc(33.33% - 24px);
  }
}

@media screen and (max-width: 900px) {
  .game-item {
    flex: 0 0 calc(50% - 24px);
  }
}

@media screen and (max-width: 600px) {
  .game-item {
    flex: 0 0 100%;
  }
}

.search-container {
  margin: 0 50px 20px;
  display: flex;
  align-items: center;
  gap: 20px;

  .search-input {
    max-width: 400px;
  }

  .ranking-btn {
    height: 40px;
  }
}

.search-results {
  margin: 0 50px 20px;
  .search-result-card {
    margin-bottom: 20px;
  }
  .result-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .result-item {
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;
    &:last-child {
      border-bottom: none;
    }
  }
  .result-date {
    color: #909399;
    font-size: 14px;
    margin-bottom: 5px;
  }
  .result-match {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 500px;

    .team-logo {
      width: 20px;
      height: 20px;
      margin-right: 6px;
      object-fit: contain;
      vertical-align: middle;
    }

    .score {
      color: #f56c6c;
      font-weight: bold;
      margin: 0 20px;
    }
    .winner {
      color: #67c23a;
    }
  }

  .no-result {
    padding: 20px;
    text-align: center;
    color: #909399;

    i {
      font-size: 20px;
      margin-right: 8px;
      vertical-align: middle;
    }

    span {
      font-size: 14px;
      vertical-align: middle;
    }
  }
}

.match-time {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: center;

  .match-status {
    color: #6b9ecd;
    font-weight: 500;
  }
}

.stats-container {
  padding: 20px;

  .score-board {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;

    .team-stats {
      display: flex;
      align-items: center;
      gap: 15px;

      .team-logo {
        width: 40px;
        height: 40px;
        object-fit: contain;
      }

      .team-name {
        font-size: 18px;
        font-weight: bold;
      }

      .final-score {
        font-size: 24px;
        font-weight: bold;
        color: #f56c6c;
      }
    }
  }

  .quarter-scores {
    margin: 20px 0;
    h3 {
      margin-bottom: 15px;
    }
  }

  .team-stats {
    h3 {
      margin-bottom: 15px;
    }
  }

  .player-stats {
    .team-players {
      h3 {
        margin-bottom: 15px;
      }
    }
  }
}

// 让比赛卡片可点击
.text.item {
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f7fa;
  }
}
</style>
