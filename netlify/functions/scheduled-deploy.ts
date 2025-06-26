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

// export { handler };
import { schedule } from "@netlify/functions";
import axios from "axios";
import nodemailer from "nodemailer";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";
import decrypt from "../../Helper";
import twilio from "twilio";

// Firebase init
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Twilio Setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const TWILIO_FROM = '+919791361308';
const SMS_NUMBERS = ['+918270202119']; // add more if needed

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
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error(`❌ API Failed at ${istTime}: ${error.message}`);

    const refEmail = ref(db, "lastEmailSent");
    const refSMS = ref(db, "lastSMSSent");

    const [emailSnap, smsSnap] = await Promise.all([get(refEmail), get(refSMS)]);
    const lastEmailSent = emailSnap.exists() ? new Date(emailSnap.val()) : null;
    const lastSMSSent = smsSnap.exists() ? new Date(smsSnap.val()) : null;

    const nowTime = new Date();
    const diffEmailMins = lastEmailSent ? Math.floor((nowTime.getTime() - lastEmailSent.getTime()) / (1000 * 60)) : Infinity;
    const diffSMSMins = lastSMSSent ? Math.floor((nowTime.getTime() - lastSMSSent.getTime()) / (1000 * 60)) : Infinity;

    // Send Email if 30 min passed
    if (diffEmailMins >= 30) {
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
          to: [
            // "vijay.loganathan@zadroit.com",
            // "gokul.m@zadroit.com",
            // "thirukumara.d@zadroit.com",
            "indumathi.r@zadroit.com",
          ],
          subject: "🚨 API DOWN ALERT",
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2 style="color: #d32f2f;">🚨 Server/API Down Alert</h2>
              <p><strong>Time (IST):</strong> ${istTime}</p>
              <p><strong>Issue:</strong> Failed to reach the target API endpoint.</p>
              <p><strong>Error:</strong> ${error.message}</p>
            </div>
          `,
        });

        await set(refEmail, nowTime.toISOString());
        console.log("📧 Email sent.");
      } catch (e) {
        console.error("Email Error:", e.message);
      }
    } else {
      console.log(`📧 Email skipped (last sent ${diffEmailMins} min ago)`);
    }

    // Send SMS if 30 min passed
    if (diffSMSMins >= 30) {
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

        await set(refSMS, nowTime.toISOString());
        console.log("📱 SMS sent.");
      } catch (smsErr) {
        console.error("SMS Error:", smsErr.message);
      }
    } else {
      console.log(`📱 SMS skipped (last sent ${diffSMSMins} min ago)`);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
});

export { handler };


