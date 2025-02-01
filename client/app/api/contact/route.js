import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const { name, email, phone, message } = await req.json();

        // Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "your-email@gmail.com", // Replace with your email
                pass: "your-email-password-or-app-password", // Use App Password for security
            },
        });

        // Email Options
        const mailOptions = {
            from: email,
            to: "webfudgeagency@gmail.com",
            subject: "New Contact Us Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ success: true, message: "Message sent successfully!" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ success: false, message: "Failed to send message" }), {
            status: 500,
        });
    }
}
