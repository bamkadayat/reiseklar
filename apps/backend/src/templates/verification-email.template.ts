/**
 * Email template for verification code
 */
export function getVerificationEmailTemplate(code: string): { html: string; text: string } {
  // Split code into individual digits for styling
  const digits = code.split('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
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
                Verify your email address
              </h2>

              <!-- Description -->
              <p style="margin: 0 0 32px 0; color: #64748b; font-size: 16px; line-height: 1.6;">
                To complete your registration and get started, please enter the verification code below:
              </p>

              <!-- Verification Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 32px 24px;">
                    <div style="text-align: center;">
                      <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; font-weight: 600;">
                        YOUR VERIFICATION CODE
                      </div>
                      <!-- Code Digits -->
                      <table cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 20px auto;">
                        <tr>
                          ${digits.map(digit => `
                            <td style="padding: 0 8px;">
                              <div style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; width: 60px; height: 70px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #003d82; font-size: 36px; font-weight: 700; font-family: 'Courier New', monospace; line-height: 70px; display: block; text-align: center;">
                                  ${digit}
                                </span>
                              </div>
                            </td>
                          `).join('')}
                        </tr>
                      </table>
                      <!-- Copyable Code -->
                      <div style="margin-top: 20px; text-align: center;">
                        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; display: inline-block;">
                          <span style="color: #003d82; font-size: 24px; font-weight: 600; font-family: 'Courier New', monospace; letter-spacing: 4px; user-select: all; -webkit-user-select: all; -moz-user-select: all; -ms-user-select: all;">
                            ${code}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px 20px;">
                    <p style="margin: 0 0 4px 0; color: #92400e; font-size: 14px; font-weight: 600; line-height: 1.5;">
                      ⏱ This code will expire in 10 minutes.
                    </p>
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                      If you didn't request this code, you can safely ignore this email.
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
Verify Your Email - Reiseklar

Thank you for signing up with Reiseklar!

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.

Need help? Contact us at bamkadayat@gmail.com

© ${new Date().getFullYear()} Reiseklar. All rights reserved.
  `;

  return { html, text };
}
