import React, { useEffect, useState } from "react";
import "./App.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIERBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.languageCode = "en";

function App() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        },
      },
      auth
    );
  } catch (error) {}
  const onSignInSubmit = () => {
    const appVerifier = window.recaptchaVerifier;

    const auth = getAuth();
    const phoneNumber = phone;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log(confirmationResult);
        // ...
      })
      .catch((error) => {
        console.log(error);
        // Error; SMS not sent
        // ...
      });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "500px",
        margin: "5rem auto",
      }}
      className="App"
    >
      <h1>Test firebase OTP</h1>
      <div id="recaptcha-container"></div>
      <div style= {{ margin: "1rem auto" }}>
        <input
          placeholder="+84928661234"
          name="mobile"
          type="text"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <button id="sign-in" onClick={onSignInSubmit} type="button">
          request OTP
        </button>
      </div>
      <div>
        <input
          placeholder="123456"
          name="code"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <button
          onClick={() => {
            window.confirmationResult
              .confirm(code)
              .then((result: any) => {
                // User signed in successfully.
                console.log(result);
                // ...
              })
              .catch((error: any) => {
                console.log(error);
                // User couldn't sign in (bad verification code?)
                // ...
              });
          }}
        >
          send code
        </button>
      </div>
    </div>
  );
}

export default App;
