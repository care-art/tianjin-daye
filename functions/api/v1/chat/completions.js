// Pages Functions 精确代理：仅 /api/v1/chat/completions → Agnes API（Key 藏服务端）
export async function onRequest(context) {
  const { request, env } = context;
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  const upstream = await fetch('https://api.agnes-ai.cn/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + env.AGNES_KEY, 'Content-Type': 'application/json' },
    body: await request.text(),
  });
  const res = new Response(upstream.body, upstream);
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  return res;
}
