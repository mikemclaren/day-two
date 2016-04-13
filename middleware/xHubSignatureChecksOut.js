// @flow
import crypto from 'crypto';

const xHubSignatureChecksOut = async (ctx: Object, next: function) : Promise => {
  if(ctx.request.headers['X-Hub-Signature']) {
    let generatedHmac = crypto.createHmac('sha1', process.env.GITHUB_SECRET);
    generatedHmac.update(new Buffer(JSON.stringify(ctx.request.body), 'utf8'));
    generatedHmac.digest('hex');

    if(ctx.request.headers['X-Hub-Signature'].substring(5) === generatedHmac) {
      await next();
    }
  }

  ctx.body = {
    message: 'Unauthorized webhook request'
  };
  ctx.status = 403;
  return;
}

export default xHubSignatureChecksOut;
