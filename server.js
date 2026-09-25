const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

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

        const { data, error } = await resend.emails.send({

            from: "LaVista Restaurant <onboarding@resend.dev>",

            to: ["murgi6383@gmail.com"],

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

        if (error) {

            console.error("Resend error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to send message."
            });

        }

        console.log("Email sent:", data);

        res.json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {

        console.error("Server error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
