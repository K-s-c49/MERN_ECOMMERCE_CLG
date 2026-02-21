import nodemailer from "nodemailer";
// intentionally left blank (reverted)
export const  sendEmial = async (options) => {
    // intentionally left blank (reverted)
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        // Gmail "App Passwords" are often copied with spaces (e.g. "abcd efgh ijkl mnop")
        // but SMTP auth expects the raw 16-char value.
        pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, ''),
    },
  });

  const to = options.to || options.email;
  if (!to) {
    throw new Error("Email recipient (to) is required");
  }

  const mailOptions = {
    from: options.from || `ElectroWorld <${process.env.SMTP_USER}>`,
    to,
    subject: options.subject,
    text: options.message,
    replyTo: options.replyTo || options.email,
  };

    await transporter.sendMail(mailOptions);
}