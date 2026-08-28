import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export function isEmailConfigured() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.alertEmailTo);
}

let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }
  return transporter;
}

// Sends a low-stock alert email. If email isn't configured, this is a no-op
// that reports why — it never pretends to have sent anything it didn't.
export async function sendLowStockEmail(business, items) {
  if (!isEmailConfigured()) {
    return {
      sent: false,
      reason: 'Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS and ALERT_EMAIL_TO in server/.env to enable alerts.',
    };
  }

  const list = items.map((i) => `- ${i.product}: ${i.stock} in stock`).join('\n');

  try {
    await getTransporter().sendMail({
      from: env.smtp.from || env.smtp.user,
      to: env.alertEmailTo,
      subject: `Low stock alert — ${business?.name || 'Business Sathi'}`,
      text: `The following products are running low on stock:\n\n${list}`,
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: `Failed to send email: ${err.message}` };
  }
}
