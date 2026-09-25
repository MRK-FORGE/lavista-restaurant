const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get("/", (req, res) => {
    res.send("LaVista server is running!");
});

app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend connection is working!"
    });
});

app.post("/send-message", async (req, res) => {

    const {
        name,
        email,
        phone,
        subject,
        reservationType,
        message
    } = req.body;

    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `LaVista - ${subject}`,
            text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Reservation Type: ${reservationType}

Message:
${message}
            `
        });

        res.json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

