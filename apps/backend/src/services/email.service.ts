import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { getVerificationEmailTemplate } from '../templates/verification-email.template';

/**
 * Initialize Mailgun client
 */
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  url: process.env.MAILGUN_API_BASE || 'https://api.eu.mailgun.net',
});

/**
 * Send verification email with code
 */
export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  try {
    // Get email template
    const { html, text } = getVerificationEmailTemplate(code);

    // Send email via Mailgun
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: process.env.MAILGUN_FROM || 'Reiseklar <no-reply@mail.reiseklar.dev>',
      to: [email],
      subject: 'Verify your Reiseklar account',
      text: text,
      html: html,
      'h:Reply-To': process.env.MAILGUN_REPLY_TO || 'bamkadayat@gmail.com',
    });

    console.log(`✅ Verification email sent to ${email}`, result);
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);

    // Still log the code for development/debugging
    console.log(`\n🔐 VERIFICATION CODE for ${email}: ${code}\n`);

    // Re-throw to handle in the calling function if needed
    throw new Error('Failed to send verification email');
  }
};
