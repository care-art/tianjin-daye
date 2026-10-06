/**
 * Cloudflare Worker 代理 —— 把 Agnes API Key 藏在服务端
 * ------------------------------------------------
 * 用途：部署作品到公开网页时，访客无需填写 Key 即可体验真·AI 对话。
 * 部署步骤见《使用说明.md》第四节。
 *
 * 部署后请在 Cloudflare 后台为该 Worker 配置环境变量：
 *   AGNES_KEY = 你的 Agnes API Key（agnes-ai.cn 后台获取）
 * 然后把 Worker 的访问地址（如 https://daye-proxy.你的子域名.workers.dev）
 * 填到页面"回复源设置 → Agnes 地址"里即可。
 */
export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405, headers: cors });
    }
    // 只放行对话接口，防止代理被挪作他用
    const url = new URL(request.url);
    if (url.pathname !== '/v1/chat/completions') {
      return new Response('Not Found', { status: 404, headers: cors });
    }
    const upstream = await fetch('https://api.agnes-ai.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.AGNES_KEY,
        'Content-Type': 'application/json',
      },
      body: await request.text(),
    });
    const res = new Response(upstream.body, upstream);
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    return res;
  },
};
