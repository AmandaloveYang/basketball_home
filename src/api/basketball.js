import request from '@/utils/request';
import axios from 'axios';

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

//qq查询
export function qqSearch(qq) {
  return axios({
    url: `https://api.xywlapi.cc/qqapi`,
    method: 'get',
    params: {
      qq,
    },
  });
}

//chatgpt
export function chatGpt(params) {
  return request({
    url: '/v1/chat/completions',
    method: 'post',
    data: params,
  });
}
