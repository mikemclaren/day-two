// @flow
import crypto from 'crypto';

const xHubSignatureChecksOut = async (ctx: Object, next) : Promise => {
  if(ctx.request.headers['x-hub-signature']) {
    let generatedHmac = crypto.createHmac('sha1', process.env.GITHUB_SECRET);
    generatedHmac = generatedHmac.update(new Buffer(JSON.stringify(ctx.request.body), 'utf8'));
    generatedHmac = generatedHmac.digest('hex');

    if(ctx.request.headers['x-hub-signature'].substring(5) === generatedHmac) {
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
