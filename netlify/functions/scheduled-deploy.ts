// import fetch from "node-fetch";
// import { schedule } from "@netlify/functions";
// import nodemailer from "nodemailer";
// import axios from "axios";
// import decrypt from "../../Helper";

// // Scheduled every 10 minutes
// const handler = schedule("*/5 * * * *", async () => {
//   const now = new Date().toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });
//   try {
//     const response = await axios.get(
//       "https://medpredit-commercial.brightoncloudtech.com/api/AdminRoutes/CheckAPI"
//     );

//     const encryptionKey = process.env.ENCRYPTION_KEY;
//     if (!encryptionKey) {
//       throw new Error("ENCRYPTION_KEY is not set in environment variables.");
//     }

//     const data = decrypt(response.data[1], response.data[0], encryptionKey);
//     console.log("\n\n The Server is Up Now on ", now);
//     console.log("\n Response from the Api", data, "\n");
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ success: true, data }),
//     };
//   } catch (error) {
//     try {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASS,
//         },
//       });

//       await transporter.sendMail({
//         from: process.env.MAIL_USER,
//         to: [
//           "vijay.loganathan@zadroit.com",
//           "gokul.m@zadroit.com",
//           "thirukumara.d@zadroit.com",
//           "indumathi.r@zadroit.com",
//         ],
//         subject: "🚨 API DOWN ALERT",
//         html: `
//           <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fff; max-width: 600px;">
//             <h2 style="color: #d32f2f;">🚨 Server/API Down Alert</h2>
//             <p><strong>Time (IST):</strong> ${now}</p>
//             <p><strong>Issue:</strong> Failed to reach the target API endpoint.</p>
//             <p style="background-color: #fce4ec; padding: 10px; border-left: 4px solid #d32f2f;">
//               <strong>Error Message:</strong><br />
//               ${error.message}
//             </p>
//             <p style="margin-top: 20px;">Please investigate the issue immediately.</p>
//             <hr style="margin: 30px 0;" />
//             <p style="font-size: 12px; color: #888;">This is an automated alert from your monitoring script.</p>
//           </div>
//         `,
//       });
//     } catch (mailError) {
//       console.error("Failed to send email:", mailError.message);
//     }

//     return {
//       statusCode: 500,
//       body: JSON.stringify({ success: false, error: error.message }),
//     };
//   }
// });

// ------------------------------------------------------------------------

// import { schedule } from "@netlify/functions";
// import axios from "axios";
// import nodemailer from "nodemailer";
// import decrypt from "../../Helper";
// import twilio from "twilio";

// // Twilio Setup
// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
// const TWILIO_FROM = "+17432289693";
// const SMS_NUMBERS = ["+918270202119"]; // Add more if needed

// // Scheduled every 5 minutes
// const handler = schedule("*/5 * * * *", async () => {
//   const now = new Date();
//   const istTime = now.toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     hour12: false,
//   });

//   try {
//     const response = await axios.get(
//       "https://medpredit-commercial.brightoncloudtech.com/api/AdminRoutes/CheckAPI"
//     );

//     const encryptionKey = process.env.ENCRYPTION_KEY;
//     if (!encryptionKey) throw new Error("ENCRYPTION_KEY missing");

//     const data = decrypt(response.data[1], response.data[0], encryptionKey);
//     console.log(`✅ API Success at ${istTime}`);
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ success: true, data }),
//     };
//   } catch (error) {
//     console.error(`❌ API Failed at ${istTime}: ${error.message}`);

//     // Send email alert
//     try {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASS,
//         },
//       });

//       await transporter.sendMail({
//         from: process.env.MAIL_USER,
//         to: [
//           // "vijay.loganathan@zadroit.com",
//           // "gokul.m@zadroit.com",
//           // "thirukumara.d@zadroit.com",
//           "indumathi.r@zadroit.com",
//         ],
//         subject: "🚨 API DOWN ALERT",
//         html: `
//            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fff; max-width: 600px;">
//              <h2 style="color: #d32f2f;">🚨 Server/API Down Alert</h2>
//              <p><strong>Time (IST):</strong> ${now}</p>
//              <p><strong>Issue:</strong> Failed to reach the target API endpoint.</p>
//              <p style="background-color: #fce4ec; padding: 10px; border-left: 4px solid #d32f2f;">
//                <strong>Error Message:</strong><br />
//                ${error.message}
//              </p>
//              <p style="margin-top: 20px;">Please investigate the issue immediately.</p>
//              <hr style="margin: 30px 0;" />
//              <p style="font-size: 12px; color: #888;">This is an automated alert from your monitoring script.</p>
//            </div>
//          `,
//       });

//       console.log("📧 Email sent.");
//     } catch (e) {
//       console.error("Email Error:", e.message);
//     }

//     // Send SMS alert
//     try {
//       await Promise.all(
//         SMS_NUMBERS.map((to) =>
//           twilioClient.messages.create({
//             body: `🚨 ALERT: API is down at ${istTime}. Error: ${error.message}`,
//             from: TWILIO_FROM,
//             to,
//           })
//         )
//       );

//       console.log("📱 SMS sent.");
//     } catch (smsErr) {
//       console.error("SMS Error:", smsErr.message);
//     }

//     return {
//       statusCode: 500,
//       body: JSON.stringify({ success: false, error: error.message }),
//     };
//   }
// });

// export { handler };

// version 3

import { schedule } from "@netlify/functions";
import axios from "axios";
import nodemailer from "nodemailer";
import decrypt from "../../Helper";
import twilio from "twilio";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get } from "firebase/database";

// Twilio Setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const TWILIO_FROM = "+17432289693";
const SMS_NUMBERS = ["+918270202119"];

// Firebase Setup
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Log to Firebase
const logStatusToFirebase = async (status, message) => {
  const now = new Date();
  const istTime = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const logRef = ref(database, "api-status-logs");
  await push(logRef, {
    status,
    time: istTime,
    message: message || null,
  });
};

// Check if alert should be triggered (based on Firebase lock)
const shouldLogDown = async () => {
  const lockRef = ref(database, "api-status-latest");
  const snapshot = await get(lockRef);
  const lastLog = snapshot.val();

  if (
    lastLog &&
    lastLog.status === "down" &&
    Date.now() - new Date(lastLog.time).getTime() < 60 * 1000
  ) {
    return false; // Already alerted within the last 60 seconds
  }

  await set(lockRef, {
    status: "down",
    time: new Date().toISOString(),
  });

  return true;
};

// Scheduled every 5 minutes
const handler = schedule("*/5 * * * *", async () => {
  const now = new Date();
  const istTime = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  try {
    const response = await axios.get(
      "https://medpredit-commercial.brightoncloudtech.com/api/AdminRoutes/CheckAP"
    );

    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) throw new Error("ENCRYPTION_KEY missing");

    const data = decrypt(response.data[1], response.data[0], encryptionKey);
    console.log(`✅ API Success at ${istTime}`);

    await logStatusToFirebase("up", null);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error(`❌ API Failed at ${istTime}: ${error.message}`);

    const canAlert = await shouldLogDown();
    if (!canAlert) {
      console.log("⚠️ Skipping duplicate down alert.");
      return {
        statusCode: 200,
        body: JSON.stringify({ skipped: true }),
      };
    }

    await logStatusToFirebase("down", error.message);

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: ["vijay.loganathan@zadroit.com"],
        subject: "🚨 API DOWN ALERT",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fff; max-width: 600px;">
            <h2 style="color: #d32f2f;">🚨 Server/API Down Alert</h2>
            <p><strong>Time (IST):</strong> ${now}</p>
            <p><strong>Issue:</strong> Failed to reach the target API endpoint.</p>
            <p style="background-color: #fce4ec; padding: 10px; border-left: 4px solid #d32f2f;">
              <strong>Error Message:</strong><br />
              ${error.message}
            </p>
            <p style="margin-top: 20px;">Please investigate the issue immediately.</p>
            <hr style="margin: 30px 0;" />
            <p style="font-size: 12px; color: #888;">This is an automated alert from your monitoring script.</p>
          </div>
        `,
      });
      console.log("📧 Email sent.");
    } catch (e) {
      console.error("Email Error:", e.message);
    }

    try {
      await Promise.all(
        SMS_NUMBERS.map((to) =>
          twilioClient.messages.create({
            body: `🚨 ALERT: API is down at ${istTime}. Error: ${error.message}`,
            from: TWILIO_FROM,
            to,
          })
        )
      );
      console.log("📱 SMS sent.");
    } catch (smsErr) {
      console.error("SMS Error:", smsErr.message);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
});

export { handler };
