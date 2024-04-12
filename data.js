import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js"; // Update import statement
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"; // Add Firebase Auth import

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsU_xDm-E8w4_j74zgQqzolsy-esKuEzs",
    authDomain: "fyp0-b60d4.firebaseapp.com",
    databaseURL: "https://fyp0-b60d4-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "fyp0-b60d4",
    storageBucket: "fyp0-b60d4.appspot.com",
    messagingSenderId: "47322184279",
    appId: "1:47322184279:web:c4c74120499560f8414112",
    measurementId: "G-ZDHGZCRH2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(); // Initialize Firebase Auth

// Retrieve data for the currently logged-in user
auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        const userRef = ref(db, 'users/' + userId);

        // Listen for changes to the user data
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            const userInfoDiv = document.getElementById('user-info');

            // Display user information
            if (userData) {
                const { username, email, streak, progress } = userData; // Destructure user data object
                const lastLoginDate = streak?.lastLoginDate; // Access lastLoginDate from streak object
                const streakValue = streak?.value; // Access value from streak object
                const risingSeaquizScore = progress?.risingSea?.quizCompletion?.quizScore; // Access quizScore with optional chaining
                const airPollutionquizScore = progress?.airPollution?.quizCompletion?.quizScore; // Access quizScore with optional chaining
                const recyclingquizScore = progress?.recycling?.quizCompletion?.quizScore; // Access quizScore with optional chaining

                // Update HTML elements with user information and quiz scores
                document.getElementById('username').textContent = username;
                document.getElementById('email').textContent = email;
                document.getElementById('last-login-date').textContent = lastLoginDate;
                document.getElementById('streak').textContent = streakValue;
                document.getElementById('rising-sea-quiz-score').textContent = risingSeaquizScore;
                document.getElementById('air-pollution-quiz-score').textContent = airPollutionquizScore;
                document.getElementById('recycling-quiz-score').textContent = recyclingquizScore;

            } else {
                // If user data is not found, display a message
                userInfoDiv.textContent = "User not found";
            }
        });
    }
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', function() {
        logout(); // Call the logout function when the button/link is clicked
      });
    }
    
    function logout() {
        // Clear user data from HTML elements
        document.getElementById('username').textContent = "";
        document.getElementById('email').textContent = "";
        document.getElementById('last-login-date').textContent = "";
        document.getElementById('streak').textContent = "";
        document.getElementById('rising-sea-quiz-score').textContent = "";
        document.getElementById('air-pollution-quiz-score').textContent = "";
        document.getElementById('recycling-quiz-score').textContent = "";

        // Sign out the user
        auth.signOut().then(function () {
            console.log('User logged out');
            sessionStorage.removeItem('loggedIn');
            // Redirect to main.html after logout
            window.location.href = "main.html"; // Corrected from window.location.src
        }).catch(function (error) {
            console.error('Error logging out:', error);
        });
    }
}, (error) => {
    console.error('Auth state changed error:', error);
});
