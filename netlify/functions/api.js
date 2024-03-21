import express from "express";
import { Router } from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import nodemailer from "nodemailer";
import serverless from "serverless-http";

const api = express();
const router = Router();

//Parse request body
router.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
api.use(express.static(__dirname));

// Handle submission route
router.post("/form-submission", (req, res) => {
  // Extract form data from the request body 
  const { fname, lname, email, phone, msg } = req.body;
  // Send email using Nodemailer
  sendEmail(fname, lname, email, phone, msg)
    .then(() => {
      console.log("Email sent successfully!");
      res.send("Form submitted successfully!");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      res.status(500).send("Failed to submit form. Please try again later.");
    });
});

// Set up Email services
async function sendEmail(fname, lname, email, phone, msg) {
  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "justinhoang0312@gmail.com",
      pass: "bftd rapg glnw zeyh",
    },
  });

  // Email message options
  let mailOptions = {
    from: email,
    to: "justinhoang0312@gmail.com",
    subject: "Booking",
    html: `
            <div class="container">
                <h2 class="title">New appointment</h2>
                <p class="info"><strong>First Name:</strong> ${fname}</p>
                <p class="info"><strong>Last Name:</strong> ${lname}</p>
                <p class="info"><strong>Email:</strong> ${email}</p>
                <p class="info"><strong>Phone:</strong> ${phone}</p>
                <div class="message">
                    <p>${msg}</p>
                </div>
            </div>
        `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}
api.use("/.netlify/functions/api", router);

export const handler = serverless(api);
