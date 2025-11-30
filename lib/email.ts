import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendTeamInvitation(
  email: string,
  companyName: string,
  invitationLink: string
) {
  if (!resend) {
    console.log("📧 Email Service Disabled - No RESEND_API_KEY configured");
    console.log(`Would send invitation to: ${email}`);
    console.log(`Company: ${companyName}`);
    console.log(`Link: ${invitationLink}`);
    return { success: true, message: "Email service disabled in development" };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "team@jobkit.app",
      to: email,
      subject: `You've been invited to join ${companyName} on JobKit`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #2563eb;
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background-color: #f9fafb;
                padding: 30px 20px;
                border-radius: 0 0 8px 8px;
              }
              .button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Team Invitation</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>You have been invited to join the team at <strong>${companyName}</strong> on JobKit.</p>
                <p>Click the button below to accept the invitation and get started:</p>
                <a href="${invitationLink}" class="button">Accept Invitation</a>
                <p style="color: #6b7280; font-size: 14px;">
                  If the button doesn't work, copy and paste this link in your browser:
                  <br/>
                  <span style="word-break: break-all; background-color: white; padding: 10px; display: block; margin-top: 10px; border: 1px solid #e5e7eb; border-radius: 4px;">
                    ${invitationLink}
                  </span>
                </p>
              </div>
              <div class="footer">
                <p>This invitation will expire in 7 days.</p>
                <p>&copy; ${new Date().getFullYear()} JobKit. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
