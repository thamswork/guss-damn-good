export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  const CLIENT_ID = env.GITHUB_CLIENT_ID || 'Ov23liLX0nZWnvEhwNN4';
  const CLIENT_SECRET = env.GITHUB_CLIENT_SECRET || 'a9a33c84d501c588d8741e9d9b72c9a0984b2170';
  const REDIRECT = 'https://main.guss-damngood.pages.dev/api/auth';

  if (!code) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT,
      scope: 'repo,user',
    });
    return Response.redirect(
      `https://github.com/login/oauth/authorize?${params}`, 302
    );
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT,
    }),
  });

  const data = await tokenRes.json();

  if (!data.access_token) {
    return new Response(`Auth failed: ${JSON.stringify(data)}`, { status: 400 });
  }

  const token = data.access_token;

  return new Response(
    `<!DOCTYPE html><html><body><script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:success:' + JSON.stringify({ token: '${token}', provider: 'github' }),
      e.origin
    );
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
<\/script></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
