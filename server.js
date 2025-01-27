const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/validate-recaptcha", async (req, res) => {
    const token = req.body.token;
    const secretKey = "6LcFT8EqAAAAALQH2oMaxEJ26DdzSxZ8kKjyILNa"; // Replace with your reCAPTCHA secret key

    try {
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
            res.send({ success: false, errors: response.data["error-codes"] }); // Token is invalid
        }
    } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        res.status(500).send({ success: false, error: "Server error" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));


