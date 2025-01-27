const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow cross-origin requests

// Environment variable for the reCAPTCHA secret key
const secretKey = "6LcFT8EqAAAAALQH2oMaxEJ26DdzSxZ8kKjyILNa";

app.post("/validate-recaptcha", async (req, res) => {
    const token = req.body.token; // Token sent from the frontend

    if (!token) {
        return res.status(400).send({ success: false, error: "Missing reCAPTCHA token" });
    }

    try {
        // Verify the reCAPTCHA token with Google's API
        const response = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
                params: {
                    secret: secretKey,
                    response: token,
                },
            }
        );

        if (response.data.success) {
            res.send({ success: true }); // Token is valid
        } else {
            res.send({
                success: false,
                errors: response.data["error-codes"], // Send back Google's error codes
            });
        }
    } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        res.status(500).send({ success: false, error: "Server error" });
    }
});

// Health check endpoint (optional but recommended for Render)
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Start the server
const PORT = process.env.PORT || 3000; // Use the PORT provided by Render or fallback to 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



