import http from "https";

export const handler = async (event) => {
  const rawPath = event.body;

  if (!rawPath.startsWith('https://')) {
    return {
      statusCode: 400,
      event,
      body: `${JSON.stringify(event.body)} Invalid URL. Only HTTP is supported, and the URL must start with https://`,
    };
  }


  return await new Promise((resolve) => {
    const req = http.request(rawPath, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        body: `Proxy error: ${err.message}`,
      });
    });

    req.end();
  });
};
