export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=repo,user`;
    return Response.redirect(authUrl, 302);
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  const script = `
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify({ token: '${token.replace(/'/g, "\\'")}', provider: 'github' }),
          e.origin
        );
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  `;

  return new Response(`<!DOCTYPE html><html><body><script>${script}<\/script></body></html>`, {
    headers: { 'Content-Type': 'text/html' }
  });
}
