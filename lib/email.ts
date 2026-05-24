import nodemailer from 'nodemailer';

// Resend SMTP Configuration
// Free tier: 100 emails/day
// Get your API key at: https://resend.com/api-keys
//
// Sign up with monjilaktn@outlook.com (or your email)
// Then create an API key in the dashboard
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_xxxxxxxx';

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: RESEND_API_KEY,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM || 'noreply@hostamar.com',
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
}

// Email Templates (Bengali)
export function getWelcomeEmail(name: string) {
  return {
    subject: 'Hostamar-এ স্বাগতম! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
          <h1 style="color: white; margin: 0;">Hostamar</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">স্বাগতম, ${name}! 👋</h2>
          <p style="color: #666; line-height: 1.6;">
            Hostamar-এ আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। আপনি এখন AI দিয়ে ভিডিও তৈরি,
            সম্পাদনা এবং সাবটাইটেল যুক্ত করতে পারবেন।
          </p>
          <p style="color: #666; line-height: 1.6;">
            শুরু করতে আপনার ${3}টি ফ্রি ক্রেডিট দেওয়া হয়েছে।
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hostamar.com/dashboard" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              ড্যাশবোর্ডে যান →
            </a>
          </div>
        </div>
      </div>
    `,
  };
}

export function getResetPasswordEmail(name: string, resetUrl: string) {
  return {
    subject: 'পাসওয়ার্ড রিসেট - Hostamar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>পাসওয়ার্ড রিসেট</h2>
        <p>হ্যালো ${name},</p>
        <p>আপনার পাসওয়ার্ড রিসেট করতে নিচের বাটনে ক্লিক করুন:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
            পাসওয়ার্ড রিসেট করুন
          </a>
        </div>
        <p>এই লিঙ্ক ১ ঘন্টার জন্য বৈধ।</p>
      </div>
    `,
  };
}
