const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBbwWoTdqw8OI5h6hjvcqIkSMiIYRn2TmM",
  authDomain: "deepstaq-98c0d.firebaseapp.com",
  projectId: "deepstaq-98c0d",
  storageBucket: "deepstaq-98c0d.firebasestorage.app",
  messagingSenderId: "1003753041298",
  appId: "1:1003753041298:web:6006ea9ae19f43c25ba54b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createMockAdmission() {
  console.log("Writing mock admission record to event_registrations...");
  try {
    const docRef = await addDoc(collection(db, "event_registrations"), {
      fullName: "Adarsh Sharma",
      name: "Adarsh Sharma",
      gender: "Male",
      dob: "1999-08-20",
      phone: "9876543210",
      email: "adarsh@example.com",
      address: "TC 15/124, Hill View Avenue",
      city: "Trivandrum",
      district: "Trivandrum",
      state: "Kerala",
      pinCode: "695001",
      fatherName: "Rajesh Sharma",
      fatherOccupation: "Engineer",
      fatherPhone: "9876543211",
      fatherEmail: "rajesh@example.com",
      motherName: "Saritha Sharma",
      motherOccupation: "Teacher",
      motherPhone: "9876543212",
      motherEmail: "saritha@example.com",
      highestQualification: "Degree",
      institutionName: "College of Engineering",
      boardUniversity: "Kerala University",
      passingYear: "2021",
      percentageCGPA: "8.5 CGPA",
      courseMode: "Offline",
      isAdmission: true,
      type: "EVENT_ENTRY",
      timestamp: serverTimestamp(),
      emergencyName: "Rahul Sharma",
      emergencyRelationship: "Brother",
      emergencyPhone: "9876543213",
      documents: {
        aadhaar: "https://res.cloudinary.com/demo/image/upload/v1570506307/sample.pdf",
        sslc: "https://res.cloudinary.com/demo/image/upload/v1570506307/sample.pdf",
        plusTwo: "https://res.cloudinary.com/demo/image/upload/v1570506307/sample.pdf",
        photo: "https://res.cloudinary.com/demo/image/upload/v1570506307/sample.jpg"
      },
      heardAboutUs: {
        instagram: true,
        facebook: false,
        youtube: true,
        google: false,
      }
    });
    console.log("Mock admission written successfully! Doc ID:", docRef.id);
  } catch (error) {
    console.error("Write failed:", error);
  }
}

createMockAdmission();
