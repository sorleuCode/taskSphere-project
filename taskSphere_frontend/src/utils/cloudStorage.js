
const apikey = import.meta.env.VITE_API_KEY_FIREBASE;
const authdomain = import.meta.env.VITE_AUTH_DOMAIN;
const projectid = import.meta.env.VITE_PROJECT_ID;
const bucket = import.meta.env.VITE_STORAGE_BUCKET;
const senderid = import.meta.env.VITE_MESSAGING_SENDER_ID;
const appid = import.meta.env.VITE_APP_ID;
const measure_id = import.meta.env.VITE_MEASUREMENT_ID;

 const firebaseConfig = {
    apiKey: apikey,  
    authDomain: authdomain,
    projectId: projectid,
    storageBucket: "tasksphere-3f64e.appspot.com",
    messagingSenderId: senderid, 
    appId: appid,
    measurementId: measure_id
  };

  export default firebaseConfig;
 