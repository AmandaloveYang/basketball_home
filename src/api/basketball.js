import request from "@/utils/request";

export function hupuScheduleList(params) {
  return request({
    url: "https://games.mobileapi.hupu.com/1/7.5.60/basketballapi/scheduleList?competitionTag=nba",
    method: "get",
    params,
  });
}
//NBA球队排名
export function rankList(params) {
  return request({
    url: "/api/fapig/nba/rank",
    method: "get",
    params: {
      ...params,
      key: "3cade358677dc9cab50642c7f3f9a9ab",
    },
  });
}
