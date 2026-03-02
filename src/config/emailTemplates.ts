export function newLeadEmailHtml(params: {
  businessName: string;
  leadName: string | null;
  leadPhone: string | null;
  leadEmail: string | null;
  source: string | null;
  dashboardUrl: string;
}): string {
  const { businessName, leadName, leadPhone, leadEmail, source, dashboardUrl } = params;
  const name = leadName ?? 'Unknown';
  const sourceLabel = source ? source.replace(/-/g, ' ') : 'website';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr><td style="background:#1e3a5f;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">TradeBooking</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">New Lead</p>
          <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#0f172a;">New enquiry from ${name}</h1>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${leadPhone ? `<tr><td style="padding:6px 0;font-size:14px;color:#64748b;width:100px;">Phone</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:500;">${leadPhone}</td></tr>` : ''}
                ${leadEmail ? `<tr><td style="padding:6px 0;font-size:14px;color:#64748b;">Email</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:500;">${leadEmail}</td></tr>` : ''}
                <tr><td style="padding:6px 0;font-size:14px;color:#64748b;">Source</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:500;text-transform:capitalize;">${sourceLabel}</td></tr>
              </table>
            </td></tr>
          </table>
          <a href="${dashboardUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">View lead in dashboard</a>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">This notification was sent by TradeBooking for ${businessName}. <a href="${dashboardUrl}/settings" style="color:#64748b;">Manage notifications</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function missedCallEmailHtml(params: {
  businessName: string;
  callerNumber: string;
  transcript: string | null;
  callTime: string;
  dashboardUrl: string;
}): string {
  const { businessName, callerNumber, transcript, callTime, dashboardUrl } = params;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr><td style="background:#1e3a5f;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">TradeBooking</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#dc2626;text-transform:uppercase;letter-spacing:0.05em;">Missed Call</p>
          <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#0f172a;">Missed call from ${callerNumber}</h1>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;font-size:14px;color:#64748b;width:100px;">Caller</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:500;">${callerNumber}</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#64748b;">Time</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:500;">${callTime}</td></tr>
                ${transcript ? `<tr><td style="padding:6px 0;font-size:14px;color:#64748b;vertical-align:top;">Voicemail</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${transcript}</td></tr>` : ''}
              </table>
            </td></tr>
          </table>
          <a href="${dashboardUrl}/voice" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">View in dashboard</a>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">This notification was sent by TradeBooking for ${businessName}. <a href="${dashboardUrl}/settings" style="color:#64748b;">Manage notifications</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function paymentFailedEmailHtml(params: {
  businessName: string;
  ownerName: string;
  billingUrl: string;
}): string {
  const { businessName, ownerName, billingUrl } = params;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr><td style="background:#1e3a5f;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">TradeBooking</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#dc2626;text-transform:uppercase;letter-spacing:0.05em;">Action Required</p>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0f172a;">Payment failed for ${businessName}</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">Hi ${ownerName}, we were unable to process your TradeBooking subscription payment. To avoid interruption to your service, please update your payment method as soon as possible.</p>
          <a href="${billingUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">Update payment method</a>
          <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;">If you have already updated your payment details, you can ignore this email.</p>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">TradeBooking · tradebooking.co.uk</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function teamInviteEmailHtml(params: {
  businessName: string;
  inviterName: string;
  inviteUrl: string;
  role: string;
  expiresHours: number;
}): string {
  const { businessName, inviterName, inviteUrl, role, expiresHours } = params;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr><td style="background:#1e3a5f;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">TradeBooking</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.05em;">Team Invitation</p>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0f172a;">You have been invited to join ${businessName}</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">${inviterName} has invited you to join the ${businessName} team on TradeBooking as <strong>${role}</strong>. Click the button below to accept the invitation and set your password.</p>
          <a href="${inviteUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">Accept invitation</a>
          <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;">This invitation expires in ${expiresHours} hours. If you did not expect this invitation, you can safely ignore this email.</p>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">TradeBooking · tradebooking.co.uk</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
