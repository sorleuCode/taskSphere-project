
const apikey = import.meta.env.API_KEY_FIREBASE;
const authdomain = import.meta.env.AUTH_DOMAIN;
const projectid = import.meta.env.PROJECT_ID;
const bucket = import.meta.env.STORAGE_BUCKET;
const senderid = import.meta.env.MESSAGING_SENDER_ID;
const appid = import.meta.env.APP_ID;
const measure_id = import.meta.env.MEASUREMENT_ID;

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
 