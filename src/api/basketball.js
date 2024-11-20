import request from '@/utils/request';

export function hupuScheduleList(params) {
  return request({
    url: 'https://games.mobileapi.hupu.com/1/7.5.60/basketballapi/scheduleList',
    method: 'get',
    params: {
      ...params,
      competitionTag: 'nba',
    },
  });
}
//NBA球队排名
export async function rankList() {
  try {
    const res = await request({
      url: '/fapig/nba/query',
      method: 'get',
      params: {
        key: '3cade358677dc9cab50642c7f3f9a9ab',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    console.error('API请求失败:', error);
    return Promise.reject(error);
  }
}
//qq查询
export function qqSearch(qq) {
  return request({
    url: 'https://api.xywlapi.cc/qqapi',
    method: 'get',
    params: {
      qq,
    },
  });
}
