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

        <el-input
          v-model="qqNumber"
          placeholder="请输入QQ号码"
          class="qq-input"
          clearable
          @clear="clearQQResult"
        >
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="handleQQSearch"
            ></el-button>
          </template>
        </el-input>

        <el-button type="primary" class="ranking-btn" @click="goToRanking">
          <span class="btn-text">球队排名</span>
        </el-button>
      </div>

      <div v-if="searchTeam" class="search-results">
        <el-card class="search-result-card">
          <div v-if="searchResults.length > 0">
            <div class="result-list">
              <div
                v-for="(result, index) in searchResults"
                :key="index"
                class="result-item"
              >
                <div class="result-date">{{ result.date }}</div>
                <div class="match-info">
                  <div class="team-info">
                    <div
                      class="team home"
                      :class="{ winner: result.isHomeWinner }"
                    >
                      <img
                        :src="result.homeLogo"
                        class="team-logo"
                        alt=""
                        referrerpolicy="no-referrer"
                        @error="handleImageError"
                      />
                      <span class="team-name">{{ result.homeTeam }}</span>
                    </div>
                    <div class="score-box">
                      <span class="score"
                        >{{ result.homeScore }} - {{ result.awayScore }}</span
                      >
                    </div>
                    <div
                      class="team away"
                      :class="{ winner: result.isAwayWinner }"
                    >
                      <img
                        :src="result.awayLogo"
                        class="team-logo"
                        alt=""
                        referrerpolicy="no-referrer"
                        @error="handleImageError"
                      />
                      <span class="team-name">{{ result.awayTeam }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-result">
            <i class="el-icon-warning-outline"></i>
            <span
              >未找到"{{ searchTeam }}"的比赛记录，请输入正确的球队名称</span
            >
          </div>
        </el-card>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        title="QQ信息查询结果"
        width="400px"
        center
      >
        <div v-loading="qqLoading" class="qq-dialog-content">
          <div v-if="qqResult" class="qq-info">
            <div class="info-item">
              <span class="label">QQ号码：</span>
              <span class="value">{{ qqResult.qq }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机号：</span>
              <span class="value">{{ qqResult.phone }}</span>
            </div>
            <div class="info-item">
              <span class="label">归属地：</span>
              <span class="value">{{ qqResult.phonediqu }}</span>
            </div>
          </div>
          <div v-else-if="!qqLoading" class="no-result">
            <i class="el-icon-warning-outline"></i>
            <span>未查询到相关信息</span>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>

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
        <!-- 这是用来展示echarts表的容器 -->
      </el-main>
    </div>
  </div>
</template>

<script>
import { hupuScheduleList, qqSearch } from "@/api/basketball.js";
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
      qqNumber: "", // QQ号码
      qqResult: null, // QQ查询果
      dialogVisible: false, // 控制弹窗显示
      qqLoading: false, // 控制QQ查询的加载状态
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
    this.Option = {}; // 初化echarts的Option
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
    this.$nextTick(() => {
      this.fetchMatchData();
      this.startPolling();
      this.updateChartData(); // 初始化图表
    });
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    this.stopPolling(); // 组件销毁前除定时器
  },
  methods: {
    // 初化和更新图表
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
      // 确保 DOM 元素存在
      const chartDom = document.getElementById("main");
      if (!chartDom) {
        console.warn("Chart container not found");
        return;
      }

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
          teams.push(`${match.awayTeamName} vs ${match.homeTeamName}`);
        });

        const isMobile = window.innerWidth <= 768;

        const newOption = {
          grid: {
            left: isMobile ? "1%" : "3%",
            right: isMobile ? "10%" : "3%",
            top: "3%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: isMobile ? "value" : "category",
            data: isMobile ? null : teams,
            axisLabel: {
              interval: 0,
              rotate: isMobile ? 0 : 30,
            },
          },
          yAxis: {
            type: isMobile ? "category" : "value",
            data: isMobile ? teams : null,
            inverse: isMobile,
            axisLabel: {
              width: 120,
              overflow: "truncate",
            },
          },
          series: [
            {
              type: "bar",
              data: awayScores,
              barGap: "20%",
              barCategoryGap: "40%",
              label: {
                show: true,
                position: isMobile ? "right" : "top",
                textStyle: {
                  color: "#666",
                },
              },
            },
            {
              type: "bar",
              data: homeScores,
              label: {
                show: true,
                position: isMobile ? "right" : "top",
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

        // 使用 this.$nextTick 确保 DOM 已更新
        this.$nextTick(() => {
          let myChart = echarts.getInstanceByDom(chartDom);
          if (!myChart) {
            myChart = echarts.init(chartDom);
          }
          myChart.setOption(newOption, true);

          // 添加 resize 监听
          const resizeHandler = () => {
            myChart.resize();
            this.updateChartData();
          };

          window.removeEventListener("resize", resizeHandler);
          window.addEventListener("resize", resizeHandler);
        });
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

    // 添加跳转方
    goToRanking() {
      this.$router.push("/rank");
    },

    // 添加QQ查询方法

    clearQQResult() {
      this.qqNumber = "";
      this.qqResult = null;
      this.dialogVisible = false;
    },

    async handleQQSearch() {
      if (!this.qqNumber) {
        this.$message.warning("请输入QQ号码");
        return;
      }

      this.qqLoading = true;
      this.dialogVisible = true;

      try {
        const res = await qqSearch(this.qqNumber);
        if (res.status === 200) {
          this.qqResult = res;
        } else {
          this.$message.error(res.message || "查询失败");
          this.qqResult = null;
        }
      } catch (error) {
        console.error("QQ查询失败:", error);
        this.$message.error("查询失败，请稍后重试");
        this.qqResult = null;
      } finally {
        this.qqLoading = false;
      }
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

    @media screen and (max-width: 768px) {
      margin: 0; // 移除外边距
      padding: 10px; // 减小内边距
      width: 100%; // 确保宽度100%
      min-height: calc(100vh - 20px); // 调整最小高度,减去padding值
    }
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
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 5px;
    margin: 0 auto;
  }
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
      min-width: 30px; // 保持分数宽一致
      text-align: right;
    }
  }
}

.game-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-left: 50px;

  @media screen and (max-width: 768px) {
    margin: 0; // 移除所有外边距
    gap: 15px;
    padding: 0 15px; // 添加内边距来替代外边距
  }
}

.game-item {
  flex: 0 0 calc(20% - 24px);
  min-width: 250px;

  @media screen and (max-width: 768px) {
    min-width: 100%; // 修改为100%宽度
    flex: 0 0 100%;
  }
}

.search-container {
  margin: 0 50px 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap; // 允许元素换行

  @media screen and (max-width: 768px) {
    margin: 0 15px 20px;
    gap: 10px;

    .search-input,
    .qq-input {
      flex: 1 1 100%; // 在移动端占满整行
      max-width: 100%;
    }

    .ranking-btn {
      width: 100%; // 按钮占满整行
      margin-top: 5px;
    }
  }

  .search-input,
  .qq-input {
    flex: 1;
    max-width: 400px;

    :deep(.el-input__inner) {
      @media screen and (max-width: 768px) {
        height: 38px; // 稍微降低输入框高度
        font-size: 13px;
      }
    }

    :deep(.el-input-group__append) {
      @media screen and (max-width: 768px) {
        padding: 0 12px;
      }
    }
  }
}

.search-results {
  margin: 0 50px 20px;

  .search-result-card {
    background: #fff;
    border-radius: 8px;
  }

  .result-list {
    .result-item {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .result-date {
        color: #909399;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .match-info {
        .team-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          .team {
            display: flex;
            align-items: center;
            flex: 1;

            &.home {
              justify-content: flex-end;
              text-align: right;
            }

            &.away {
              justify-content: flex-start;
              text-align: left;
            }

            &.winner {
              color: #67c23a;
              font-weight: 500;
            }

            .team-logo {
              width: 24px;
              height: 24px;
              margin: 0 8px;
              object-fit: contain;
            }

            .team-name {
              font-size: 15px;
            }
          }

          .score-box {
            padding: 0 16px;
            min-width: 80px;
            text-align: center;

            .score {
              color: #f56c6c;
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  .no-result {
    padding: 24px;
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

  @media screen and (max-width: 768px) {
    margin: 0 15px 20px;
    width: auto; // 移除固定宽度
  }
}

@media screen and (max-width: 768px) {
  .search-results {
    margin: 0 15px 20px;

    .result-list {
      .result-item {
        .match-info {
          .team-info {
            gap: 10px;

            .team {
              .team-logo {
                margin: 0 4px;
              }

              .team-name {
                font-size: 14px;
              }
            }

            .score-box {
              padding: 0 8px;
              min-width: 60px;
            }
          }
        }
      }
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

.ranking-btn {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: none !important;
  border-radius: 30px !important;
  padding: 12px 40px !important;
  font-size: 16px !important;
  color: #333 !important;
  letter-spacing: 2px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .btn-text {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    border-radius: 30px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    color: #fff !important;

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

// 响应式调整
@media screen and (max-width: 768px) {
  .ranking-btn {
    padding: 10px 30px !important;
    font-size: 14px !important;
  }
}

.qq-dialog-content {
  padding: 20px;

  .qq-info {
    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 70px;
        color: #606266;
      }

      .value {
        color: #303133;
      }
    }
  }
}

/deep/ .el-dialog {
  border-radius: 8px;

  .el-dialog__header {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    padding: 15px 20px;
    border-top: 1px solid #ebeef5;
    text-align: right;
  }
}

@media screen and (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto;
  }

  .qq-dialog-content {
    padding: 15px;

    .qq-info {
      .info-item {
        padding: 8px 12px;
        margin-bottom: 10px;

        .label {
          flex: 0 0 60px;
          font-size: 14px;
        }

        .value {
          font-size: 14px;
        }
      }
    }
  }
}

// 优化对话框在移动端的显示
.qq-dialog-content {
  @media screen and (max-width: 768px) {
    padding: 12px;

    .qq-info {
      .info-item {
        padding: 10px;
        margin-bottom: 8px;

        .label {
          width: 60px;
          font-size: 13px;
        }

        .value {
          font-size: 13px;
        }
      }
    }
  }
}

// 优化游戏列表容器
.game-list-container {
  @media screen and (max-width: 768px) {
    .dashboard-container {
      padding: 10px 0; // 减少容器内边距
    }
  }
}

// 优化游戏卡片
.game-container {
  @media screen and (max-width: 768px) {
    margin: 0 10px; // 减少左右边距
    gap: 10px; // 减少卡片间距

    .game-item {
      .box-card {
        margin-bottom: 10px;

        :deep(.el-card__header) {
          padding: 10px;
        }

        :deep(.el-card__body) {
          padding: 10px;
        }
      }
    }
  }
}

// 优化搜索结果展示
.search-results {
  @media screen and (max-width: 768px) {
    margin: 0 10px 15px;

    .result-item {
      padding: 12px !important;

      .team-info {
        .team {
          .team-name {
            font-size: 13px !important;
          }

          .team-logo {
            width: 20px !important;
            height: 20px !important;
          }
        }

        .score-box {
          min-width: 50px !important;

          .score {
            font-size: 14px !important;
          }
        }
      }
    }
  }
}

// 优化按钮样式
.ranking-btn {
  @media screen and (max-width: 768px) {
    height: 38px !important; // 统一按钮高度
    padding: 0 20px !important;
    font-size: 13px !important;
    letter-spacing: 1px;
  }
}
</style>
