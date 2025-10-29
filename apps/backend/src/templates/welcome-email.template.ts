/**
 * Email template for welcome email (Google OAuth registration)
 */
export function getWelcomeEmailTemplate(name: string): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Reiseklar</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">

          <!-- Header with gradient background -->
          <tr>
            <td style="background: linear-gradient(135deg, #003d82 0%, #0052ad 100%); padding: 48px 40px; text-align: center;">
              <h1 style="margin: 0 0 16px 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">
                Welcome to Reiseklar!
              </h1>
              <p style="margin: 0; color: #e0f2fe; font-size: 18px; line-height: 1.6;">
                We're excited to have you on board
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <!-- Greeting -->
              <p style="margin: 0 0 24px 0; color: #1e293b; font-size: 18px; line-height: 1.6;">
                Hi ${name || 'there'},
              </p>

              <p style="margin: 0 0 24px 0; color: #64748b; font-size: 16px; line-height: 1.6;">
                Thank you for registering with Reiseklar! Your account has been successfully created and you're all set to start planning your journeys.
              </p>

              <!-- Features List -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td style="background-color: #f8fafc; border-radius: 12px; padding: 32px 24px;">
                    <h2 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 600;">
                      Here's what you can do with Reiseklar:
                    </h2>

                    <!-- Feature Item 1 -->
                    <div style="margin-bottom: 20px; padding-left: 8px;">
                      <div style="margin-bottom: 8px;">
                        <span style="color: #003d82; font-size: 20px; margin-right: 12px;">🗺️</span>
                        <span style="color: #1e293b; font-size: 16px; font-weight: 600;">Plan Your Routes</span>
                      </div>
                      <p style="margin: 0; padding-left: 32px; color: #64748b; font-size: 14px; line-height: 1.5;">
                        Get real-time public transport information and plan your journeys efficiently.
                      </p>
                    </div>

                    <!-- Feature Item 2 -->
                    <div style="margin-bottom: 20px; padding-left: 8px;">
                      <div style="margin-bottom: 8px;">
                        <span style="color: #003d82; font-size: 20px; margin-right: 12px;">💾</span>
                        <span style="color: #1e293b; font-size: 16px; font-weight: 600;">Save Favorite Places</span>
                      </div>
                      <p style="margin: 0; padding-left: 32px; color: #64748b; font-size: 14px; line-height: 1.5;">
                        Keep track of your frequently visited locations for quick access.
                      </p>
                    </div>

                    <!-- Feature Item 3 -->
                    <div style="margin-bottom: 20px; padding-left: 8px;">
                      <div style="margin-bottom: 8px;">
                        <span style="color: #003d82; font-size: 20px; margin-right: 12px;">📊</span>
                        <span style="color: #1e293b; font-size: 16px; font-weight: 600;">Track Your Journeys</span>
                      </div>
                      <p style="margin: 0; padding-left: 32px; color: #64748b; font-size: 14px; line-height: 1.5;">
                        Monitor your travel statistics and environmental impact.
                      </p>
                    </div>

                    <!-- Feature Item 4 -->
                    <div style="padding-left: 8px;">
                      <div style="margin-bottom: 8px;">
                        <span style="color: #003d82; font-size: 20px; margin-right: 12px;">♿</span>
                        <span style="color: #1e293b; font-size: 16px; font-weight: 600;">Accessibility Features</span>
                      </div>
                      <p style="margin: 0; padding-left: 32px; color: #64748b; font-size: 14px; line-height: 1.5;">
                        Find wheelchair-accessible routes and step-free navigation options.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; background-color: #003d82; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,61,130,0.2);">
                      Start Planning Your Journey
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 32px 0 0 0; color: #64748b; font-size: 16px; line-height: 1.6;">
                If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 32px 40px; border-top: 1px solid #e2e8f0;">
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
Welcome to Reiseklar!

Hi ${name || 'there'},

Thank you for registering with Reiseklar! Your account has been successfully created and you're all set to start planning your journeys.

Here's what you can do with Reiseklar:

🗺️ Plan Your Routes
Get real-time public transport information and plan your journeys efficiently.

💾 Save Favorite Places
Keep track of your frequently visited locations for quick access.

📊 Track Your Journeys
Monitor your travel statistics and environmental impact.

♿ Accessibility Features
Find wheelchair-accessible routes and step-free navigation options.

Get started: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!

Need help? Contact us at bamkadayat@gmail.com

© ${new Date().getFullYear()} Reiseklar. All rights reserved.
  `;

  return { html, text };
}
