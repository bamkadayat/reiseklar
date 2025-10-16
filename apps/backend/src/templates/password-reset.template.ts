/**
 * Email template for password reset with PIN code
 */
export function getPasswordResetEmailTemplate(resetCode: string): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <!-- Logo -->
              <h1 style="margin: 0 0 40px 0; color: #003d82; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                Reiseklar
              </h1>

              <!-- Title -->
              <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Reset your password
              </h2>

              <!-- Description -->
              <p style="margin: 0 0 32px 0; color: #64748b; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Use the following 4-digit code to reset your password:
              </p>

              <!-- PIN Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: linear-gradient(135deg, #003d82 0%, #0052b4 100%); color: #ffffff; padding: 24px 48px; border-radius: 12px; font-size: 48px; font-weight: 700; letter-spacing: 12px; font-family: 'Courier New', monospace; box-shadow: 0 4px 12px rgba(0, 61, 130, 0.3);">
                      ${resetCode}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Instructions -->
              <p style="margin: 0 0 32px 0; color: #64748b; font-size: 14px; line-height: 1.6; text-align: center;">
                Enter this code on the password reset page to create your new password.
              </p>

              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px 20px;">
                    <p style="margin: 0 0 4px 0; color: #92400e; font-size: 14px; font-weight: 600; line-height: 1.5;">
                      ⏱ This code will expire in 10 minutes.
                    </p>
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td style="background-color: #f1f5f9; border-radius: 8px; padding: 16px 20px;">
                    <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.6;">
                      <strong>Security tip:</strong> Never share your password or reset link with anyone. Reiseklar will never ask for your password via email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 40px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Need help? Contact us at <a href="mailto:bamkadayat@gmail.com" style="color: #003d82; text-decoration: none; font-weight: 500;">bamkadayat@gmail.com</a>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                © ${new Date().getFullYear()} Reiseklar. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Reset Your Password - Reiseklar

We received a request to reset your password.

Your password reset code is: ${resetCode}

Enter this code on the password reset page to create your new password.

This code will expire in 10 minutes.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Security tip: Never share your password or reset code with anyone. Reiseklar will never ask for your password via email.

Need help? Contact us at bamkadayat@gmail.com

© ${new Date().getFullYear()} Reiseklar. All rights reserved.
  `;

  return { html, text };
}
