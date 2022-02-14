export const Env = {
  STAGE: "development",

  NEXT_PUBLIC_WEB_SERVICE_URL: "http://localhost:3000",
  NEXT_PUBLIC_TOKEN_REDIRECT_URL: "http://localhost:3000/api/auth/token",
  NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID:
    "682577732317-0rs7hh9dj90l901mji4sgkvigg4b17s5.apps.googleusercontent.com",

  NEXT_PUBLIC_FIREBASE_CONFIG: {
    apiKey: "AIzaSyCnmEPLc6EbGoe53aj8-U0tMVT8OiF--LQ",
    authDomain: "e-book-shelf-340921.firebaseapp.com",
    projectId: "e-book-shelf-340921",
    storageBucket: "e-book-shelf-340921.appspot.com",
    messagingSenderId: "682577732317",
    appId: "1:682577732317:web:81258fe101664eff7db134",
    measurementId: "G-XEJ4LCR40Z",
  },
};

console.log(`.env STAGE: ${Env.STAGE}`);
