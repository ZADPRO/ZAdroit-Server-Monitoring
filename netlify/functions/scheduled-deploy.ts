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

// import { schedule } from "@netlify/functions";
// import axios from "axios";
// import nodemailer from "nodemailer";
// import decrypt from "../../Helper";
// import twilio from "twilio";
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, push } from "firebase/database";

// // Twilio Setup
// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
// const TWILIO_FROM = "+17432289693";
// const SMS_NUMBERS = ["+918270202119"]; // Add more if needed

// // Firebase Setup
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const database = getDatabase(firebaseApp);

// // Helper to log status in Firebase
// const logStatusToFirebase = async (
//   status: "up" | "down",
//   message: string | null
// ) => {
//   const now = new Date();
//   const istTime = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

//   const logRef = ref(database, "api-status-logs");
//   await push(logRef, {
//     status,
//     time: istTime,
//     message: message || null,
//   });
// };

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

//     // ✅ Log success in Firebase
//     await logStatusToFirebase("up", null);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ success: true, data }),
//     };
//   } catch (error) {
//     console.error(`❌ API Failed at ${istTime}: ${error.message}`);

//     // ❌ Log failure in Firebase
//     await logStatusToFirebase("down", error.message);

//     // Email alert
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
//         to: ["vijay.loganathan@zadroit.com"],
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

//     // SMS alert
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

// Version 3

// import { schedule } from "@netlify/functions";
// import axios from "axios";
// import nodemailer from "nodemailer";
// import decrypt from "../../Helper";
// import twilio from "twilio";
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, push } from "firebase/database";

// // Twilio Setup
// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
// const TWILIO_FROM = "+17432289693";
// const SMS_NUMBERS = ["+918270202119"]; // Add more if needed

// // Firebase Setup
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const database = getDatabase(firebaseApp);

// // Helper to log status in Firebase
// const logStatusToFirebase = async (
//   status: "up" | "down",
//   message: string | null
// ) => {
//   const now = new Date();
//   const istTime = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

//   const logRef = ref(database, "api-status-logs");
//   await push(logRef, {
//     status,
//     time: istTime,
//     message: message || null,
//   });
// };

// // Helper to send email + SMS + log to Firebase
// const handleFailure = async (error: Error, istTime: string, now: Date) => {
//   console.error(`❌ API Failed at ${istTime}: ${error.message}`);
//   await logStatusToFirebase("down", error.message);

//   // Send email alert
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.MAIL_USER,
//       to: [
//         "vijay.loganathan@zadroit.com",
//         // Add others if needed
//       ],
//       subject: "🚨 API DOWN ALERT",
//       html: `
//          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fff; max-width: 600px;">
//            <h2 style="color: #d32f2f;">🚨 Server/API Down Alert</h2>
//            <p><strong>Time (IST):</strong> ${now}</p>
//            <p><strong>Issue:</strong> Failed to reach the target API endpoint.</p>
//            <p style="background-color: #fce4ec; padding: 10px; border-left: 4px solid #d32f2f;">
//              <strong>Error Message:</strong><br />
//              ${error.message}
//            </p>
//            <p style="margin-top: 20px;">Please investigate the issue immediately.</p>
//            <hr style="margin: 30px 0;" />
//            <p style="font-size: 12px; color: #888;">This is an automated alert from your monitoring script.</p>
//          </div>
//        `,
//     });

//     console.log("📧 Email sent.");
//   } catch (e) {
//     console.error("Email Error:", e.message);
//   }

//   // Send SMS alert
//   try {
//     await Promise.all(
//       SMS_NUMBERS.map((to) =>
//         twilioClient.messages.create({
//           body: `🚨 ALERT: API is down at ${istTime}. Error: ${error.message}`,
//           from: TWILIO_FROM,
//           to,
//         })
//       )
//     );
//     console.log("📱 SMS sent.");
//   } catch (smsErr) {
//     console.error("SMS Error:", smsErr.message);
//   }
// };

// // Helper to timeout after X ms
// function timeoutPromise(ms: number): Promise<never> {
//   return new Promise((_, reject) =>
//     setTimeout(() => reject(new Error("Function timeout exceeded")), ms)
//   );
// }

// // Main handler
// const handler = schedule("*/5 * * * *", async () => {
//   const now = new Date();
//   const istTime = now.toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     hour12: false,
//   });

//   try {
//     // Race between the core logic and a timeout of 9 seconds
//     return await Promise.race([
//       (async () => {
//         const response = await axios.get(
//           "https://medpredit-commercial.brightoncloudtech.com/api/AdminRoutes/CheckAPI",
//           { timeout: 7000 } // 7 seconds max for API call
//         );

//         const encryptionKey = process.env.ENCRYPTION_KEY;
//         if (!encryptionKey) throw new Error("ENCRYPTION_KEY missing");

//         const data = decrypt(response.data[1], response.data[0], encryptionKey);
//         console.log(`✅ API Success at ${istTime}`);

//         await logStatusToFirebase("up", null);

//         return {
//           statusCode: 200,
//           body: JSON.stringify({ success: true, data }),
//         };
//       })(),
//       timeoutPromise(9000), // whole function timeout
//     ]);
//   } catch (error: any) {
//     await handleFailure(error, istTime, now);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ success: false, error: error.message }),
//     };
//   }
// });

// export { handler };

// -----------------------------
import { schedule } from "@netlify/functions";
import axios from "axios";
import nodemailer from "nodemailer";
import decrypt from "../../Helper";
import twilio from "twilio";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

// Twilio Setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const TWILIO_FROM = "+17432289693";
const SMS_NUMBERS = [
  "+918270202119",
  "+919360257667",
  "+919842653413",
  "+918838565066",
]; // Add more if needed

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

const logStatusToFirebase = async (
  status: "up" | "down",
  message: string | null
) => {
  const now = new Date();
  const istTime = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const logRef = ref(database, "api-status-logs");
  await push(logRef, {
    status,
    time: istTime,
    message: message || null,
  });
};

const handleFailure = async (
  error: Error,
  istTime: string,
  now: Date,
  issueType: string,
  issueMessage: string
) => {
  console.error(`❌ ${issueType} at ${istTime}: ${issueMessage}`);
  await logStatusToFirebase("down", `${issueType}: ${issueMessage}`);

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
        "vijay.loganathan@zadroit.com",
        "thirukumara.d@zadroit.com",
        "gokul.m@zadroit.com",
        "prakash.n@zadroit.com",
      ],
      subject: `🚨 ${issueType} ALERT`,
      html: `
         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fff; max-width: 600px;">
           <h2 style="color: #d32f2f;">🚨 ${issueType} Alert</h2>
           <p><strong>Time (IST):</strong> ${now}</p>
           <p><strong>Issue:</strong> ${issueMessage}</p>
           <p style="background-color: #fce4ec; padding: 10px; border-left: 4px solid #d32f2f;">
             <strong>Error Message:</strong><br />
             ${error.message}
           </p>
           <p style="margin-top: 20px;">Please investigate immediately.</p>
           <hr style="margin: 30px 0;" />
           <p style="font-size: 12px; color: #888;">Automated alert from ERP Monitoring System.</p>
         </div>
       `,
    });

    console.log("📧 Email sent.");
  } catch (e) {
    console.error("Email Error:", e.message);
  }

  try {
    const smsBody = `🚨 ${issueType} at ${istTime}. ${issueMessage}`;
    await Promise.all(
      SMS_NUMBERS.map((to) =>
        twilioClient.messages.create({
          body: smsBody,
          from: TWILIO_FROM,
          to,
        })
      )
    );
    console.log("📱 SMS sent.");
  } catch (smsErr) {
    console.error("SMS Error:", smsErr.message);
  }
};

// Helper to timeout after X ms
function timeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Function timeout exceeded")), ms)
  );
}

const handler = schedule("*/5 * * * *", async () => {
  const now = new Date();
  const istTime = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  try {
    // Race between API call and timeout
    return await Promise.race([
      (async () => {
        const response = await axios.get(
          "https://medpredit-commercial.brightoncloudtech.com/api/v1/UserRoutes/status",
          { timeout: 7000 }
        );

        const encryptionKey = process.env.ENCRYPTION_KEY;
        if (!encryptionKey) throw new Error("ENCRYPTION_KEY missing");

        const data = decrypt(response.data[1], response.data[0], encryptionKey);

        // Check if API response signals a database error
        if (
          data &&
          typeof data === "object" &&
          "success" in data &&
          data.success === false &&
          data.message &&
          data.message.toLowerCase().includes("database")
        ) {
          throw new Error("Database error: " + data.message);
        }

        console.log(`✅ API Success at ${istTime}`);

        await logStatusToFirebase("up", null);

        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data }),
        };
      })(),
      timeoutPromise(9000),
    ]);
  } catch (error: any) {
    // Classify error
    let issueType = "Unknown Error";
    let issueMessage = error.message;

    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      issueType = "Network Error";
      issueMessage = "Network connection failed. Server unreachable.";
    } else if (error.response && error.response.status >= 500) {
      issueType = "Server Down Error";
      issueMessage = `Server returned status code ${error.response.status}`;
    } else if (error.message.toLowerCase().includes("database")) {
      issueType = "Database Error";
      issueMessage = error.message;
    }

    await handleFailure(error, istTime, now, issueType, issueMessage);

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, issueType, issueMessage }),
    };
  }
});

export { handler };
