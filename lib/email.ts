// Email service — uses Mailpit on remote Windows (open source SMTP)
// Mailpit runs on 192.168.1.2:1025, Web UI at http://192.168.1.2:8025
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "192.168.1.2";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "1025");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@hostamar.com";
const FROM_NAME = process.env.FROM_NAME || "Hostamar";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
      tls: { rejectUnauthorized: false },
    });
  }
  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  try {
    const info = await getTransporter().sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: "স্বাগতম Hostamar এ! 🎉",
    html: \`
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:12px">
        <h1 style="color:#6366f1;margin:0 0 20px">স্বাগতম, \${name}! 👋</h1>
        <p style="font-size:16px;line-height:1.6">Hostamar এ আপনার অ্যাকাউন্ট তৈরি হয়েছে। এখনই ভিডিও তৈরি শুরু করুন!</p>
        <a href="https://hostamar.vercel.app/dashboard" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;margin:20px 0;font-size:16px">ড্যাশবোর্ডে যান →</a>
        <p style="margin-top:30px;font-size:14px;color:#94a3b8">Hostamar — AI ভিডিও সাবটাইটেল, ডাবিং ও প্রসেসিং</p>
      </div>
    \`,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: "পাসওয়ার্ড রিসেট — Hostamar",
    html: \`
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:12px">
        <h1 style="color:#6366f1;margin:0 0 20px">পাসওয়ার্ড রিসেট</h1>
        <p style="font-size:16px;line-height:1.6">হ্যালো \${name}, আপনার পাসওয়ার্ড রিসেট করতে নিচের বাটনে ক্লিক করুন:</p>
        <a href="\${resetUrl}" style="display:inline-block;background:#ef4444;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;margin:20px 0;font-size:16px">পাসওয়ার্ড রিসেট করুন</a>
        <p style="font-size:14px;color:#94a3b8">এই লিংক ১ ঘন্টার জন্য বৈধ।</p>
      </div>
    \`,
  });
}
