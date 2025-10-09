// Email service for sending verification codes
// You'll need to configure Mailgun or another email service

export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  // TODO: Implement with Mailgun
  console.log(`\n🔐 VERIFICATION CODE for ${email}: ${code}\n`);

  // Example implementation with Mailgun (from your env):
  // const mailgun = require('mailgun-js')({
  //   apiKey: process.env.MAILGUN_API_KEY,
  //   domain: process.env.MAILGUN_DOMAIN,
  //   host: process.env.MAILGUN_API_BASE
  // });

  // const data = {
  //   from: process.env.MAILGUN_FROM,
  //   to: email,
  //   subject: 'Verify your Reiseklar account',
  //   text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
  //   html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`
  // };

  // await mailgun.messages().send(data);
};
