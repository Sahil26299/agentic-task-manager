export function generateEmailHtml(subject: string, text: string): string {
  // Colors from the landing page
  const colors = {
    primary: "#9333ea", // purple-600
    secondary: "#2563eb", // blue-600
    bg: "#f9fafb", // gray-50
    cardBg: "#ffffff",
    textMain: "#111827", // gray-900
    textMuted: "#4b5563", // gray-600
    border: "#e5e7eb", // gray-200
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: ${colors.bg};
      color: ${colors.textMain};
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background-color: ${colors.cardBg};
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      border: 1px solid ${colors.border};
    }
    .header {
      background: linear-gradient(to right, ${colors.secondary}, ${
    colors.primary
  });
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 32px 24px;
    }
    .text-content {
      color: ${colors.textMuted};
      font-size: 16px;
      white-space: pre-wrap;
    }
    .footer {
      padding: 24px;
      text-align: center;
      background-color: ${colors.bg};
      border-top: 1px solid ${colors.border};
    }
    .footer p {
      margin: 0;
      color: ${colors.textMuted};
      font-size: 12px;
    }
    .button {
      display: inline-block;
      background: ${colors.secondary};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 10px;">
                      <img src="https://agentic-task-manager.vercel.app/images/appLogo.png" alt="Logo" style="width: 40px; height: 40px; object-fit: contain; display: block;">
                    </td>
                    <td style="vertical-align: middle;">
                      <h1 style="margin: 0; font-size: 24px; color: white; line-height: 1;">TaskManager</h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
        </table>
      </div>
      <div class="content">
        <h2 style="margin-top: 0; color: ${
          colors.textMain
        }; font-size: 20px;">${subject}</h2>
        <img src="https://agentic-task-manager.vercel.app/images/reminderBodyImageEmailTemp.jpg" alt="Body image" style="width: 120px; height: 120px; object-fit: contain; display: block;">
        <div class="text-content">
          ${text.replace(/\n/g, "<br>")}
        </div>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} TaskManager. All rights reserved.</p>
        <p style="margin-top: 8px;">
          <a href="https://agentic-task-manager.vercel.app" style="color: ${
            colors.secondary
          }; text-decoration: none;">Visit Dashboard</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
