import handleAsyncError from "../middleware/handleAsyncerror.js";
import handleError from "../utilis/handlError.js";
import { sendEmial } from "../utilis/sendEmail.js";

const isValidEmail = (value) => {
    if (typeof value !== "string") return false;
    // Simple, practical email validation
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim());
};

export const sendContactMessage = handleAsyncError(async (req, res, next) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    const subject = typeof req.body?.subject === "string" ? req.body.subject.trim() : "";
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!name || !email || !subject || !message) {
        return next(new handleError("Please provide name, email, subject and message", 400));
    }

    if (!isValidEmail(email)) {
        return next(new handleError("Please enter a valid email address", 400));
    }

    if (name.length > 100) {
        return next(new handleError("Name is too long (max 100 characters)", 400));
    }

    if (subject.length > 200) {
        return next(new handleError("Subject is too long (max 200 characters)", 400));
    }

    if (message.length > 5000) {
        return next(new handleError("Message is too long (max 5000 characters)", 400));
    }

    const adminEmail = process.env.SMTP_USER;
    if (!adminEmail) {
        return next(new handleError("Email service is not configured", 500));
    }

    const timestamp = new Date().toISOString();
    const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";

    const emailSubject = `Contact Message: ${subject}`;
    const emailBody = [
        `New contact message received`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        `Time: ${timestamp}`,
        `IP: ${ip}`,
        ``,
        `Message:`,
        message,
    ].join("\n");

    await sendEmial({
        to: adminEmail,
        subject: emailSubject,
        message: emailBody,
        replyTo: email,
    });

    res.status(200).json({
        success: true,
        message: "Message sent successfully",
    });
});
