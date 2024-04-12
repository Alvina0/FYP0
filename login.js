import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase,push, ref, set, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth,updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Your web app's Firebase configuration
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
const auth = getAuth(app);

const updatePasswordForm = document.getElementById('update-password-form');
async function updateUserPassword(newPassword) {
  try {
    const user = auth.currentUser;
    await updatePassword(user, newPassword);
    alert('Password Updated Succesfully!');

    console.log("User password updated successfully.");
  } catch (error) {
    alert("Error updating user password:", error);
    console.error("Error updating user password:", error);
  }
}
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword === confirmPassword) {
      updateUserPassword(newPassword);
    } else {
      console.error('New password and confirm password do not match.');
      alert('Passwords do not match.');
    }
  });
}

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence set to session.');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

  function loadCheckboxStateFromDatabase(userId) {
    console.log("Loading checkbox state from the database...");

    const checkboxesRef = ref(db, `users/${userId}/checkboxes`);
    onValue(checkboxesRef, (snapshot) => {
      console.log("Snapshot value:", snapshot.val()); // Log the snapshot value
      const checkboxStates = snapshot.val();
      if (checkboxStates) {
        for (const [checkboxId, checked] of Object.entries(checkboxStates)) {
          const checkbox = document.getElementById(checkboxId);
          if (checkbox) {
            checkbox.checked = checked;
            checkboxState[checkboxId] = checked;
          }
        }
        sessionStorage.setItem('checkboxState', JSON.stringify(checkboxState));
      }
    });
  }
  function loadUserProgress(user) {
    console.log("Loading user progress...");
  
    if (user) {
      const userId = user.uid;
      loadCheckboxStateFromDatabase(userId); // Pass the user ID to loadCheckboxStateFromDatabase
    } else {
      console.log("Cannot load user progress. No user is signed in.");
    }
  }

let modal;
let registerModal;
let checkboxState = {};


document.addEventListener('DOMContentLoaded', function () {
  modal = document.getElementById('loginSignup');
  registerModal = document.getElementById('registerModal');

  const risingSeaContentReadCheckboxes = document.querySelectorAll('input[name="risingSeaContentRead"]');
  risingSeaContentReadCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateRisingSeaProgress);
  });

  const risingSeaVideosWatchedCheckboxes = document.querySelectorAll('input[name="risingSeaVideosWatched"]');
  risingSeaVideosWatchedCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateRisingSeaProgress);
  });

  // Attach event listeners to Recycling checkboxes
  const recyclingContentReadCheckboxes = document.querySelectorAll('input[name="recyclingContentRead"]');
  recyclingContentReadCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateRecyclingProgress);
  });

  const recyclingVideosWatchedCheckboxes = document.querySelectorAll('input[name="recyclingVideosWatched"]');
  recyclingVideosWatchedCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateRecyclingProgress);
  });
  // Attach event listeners to Air Pollution checkboxes
  const airPollutionContentReadCheckboxes = document.querySelectorAll('input[name="airPollutionContentRead"]');
  airPollutionContentReadCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateAirPollutionProgress);
  });

  const airPollutionVideosWatchedCheckboxes = document.querySelectorAll('input[name="airPollutionVideosWatched"]');
  airPollutionVideosWatchedCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateAirPollutionProgress);
  });


  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  allCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateCheckboxState);
  });

  // Load user progress and update checkboxes
  function updateUserProfileDisplay(user) {
    const userProfile = document.getElementById('userProfile');
    const loginSignupButton = document.getElementById('loginSignupButton');

    if (user) {
      // User is logged in
      userProfile.style.display = 'block';
      loginSignupButton.style.display = 'none';
    } else {
      // No user is logged in
      userProfile.style.display = 'none';
      loginSignupButton.style.display = 'block';

    }
  }
  if (modal && registerModal) {
    const userProfile = document.getElementById('userProfile');
    const loginSignupButton = document.getElementById('loginSignupButton');
    const isLoggedIn = sessionStorage.getItem('loggedIn');

    if (isLoggedIn) {
      userProfile.style.display = 'block';
      loginSignupButton.style.display = 'none'
    }
    auth.onAuthStateChanged((user) => {
      updateUserProfileDisplay(user);

      if (user) {
        // User is signed in
        console.log('User is signed in:', user);
        // Call your function to load user progress here
        loadUserProgress(user); // Pass the user object to the function
      } else {
        // No user is signed in
        console.log('No user is signed in.');
      }
    
    });
  }

 


    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value;
        const username = document.getElementById('regUname').value;
        const password = document.getElementById('regPassword').value;

        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('User registered:', user);

            set(ref(db, 'users/' + user.uid), {
              email: email,
              username: username
            }).then(() => {
              console.log('User information stored successfully.');
            }).catch((error) => {
              console.error('Error storing user information:', error);
            });

            registerModal.style.display = "none";
          })
          .catch((error) => {
            console.error('Error registering user:', error);
            if (error.code === 'auth/email-already-in-use') {
              alert('This email address is already in use. Please sign in instead.');
            } else {
              alert('An error occurred during registration. Please try again later.');
            }
            
          });
          
      });
    }

// Inside the loginForm event listener
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('uname').value;
  const password = document.getElementById('psw').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User credential:', userCredential);
      const user = userCredential.user;
      console.log('User logged in:', user);

      loginForm.style.display = 'none';
      userProfile.style.display = 'block';
      loginSignupButton.style.display = 'none';
      sessionStorage.setItem('loggedIn', true);

      updateStreak(userCredential.user.uid);

      alert('Login successful!');

      // Load user progress and update checkboxes
    })
    .catch((error) => {
      loginForm.style.display = 'block';

      console.error('Error signing in:', error);
      alert('An error occurred during sign-in. Please try again later.');
    });
});


    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', function (event) {
        event.preventDefault();
        logout();
      });
    }

    function logout() {
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });

      auth.signOut().then(function () {
        console.log('User logged out');
        sessionStorage.removeItem('loggedIn');
        userProfile.style.display = 'none';
        loginSignupButton.style.display = 'block';
        loginForm.style.display = 'block';
      }).catch(function (error) {
        console.error('Error logging out:', error);
      });
    }

    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
      registerButton.addEventListener('click', function () {
        registerModal.style.display = 'block';
      });
    }

    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.addEventListener('click', function () {
        modal.style.display = 'block';
      });
    }

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
      if (event.target == registerModal) {
        registerModal.style.display = "none";
      }
    };

    function updateStreak(userId) {
      const streakRef = ref(db, 'users/' + userId + '/streak');

      runTransaction(streakRef, (currentStreak) => {
        if (!currentStreak) {
          return { value: 1, lastLoginDate: new Date().toISOString().split('T')[0] };
        }

        const lastLoginDate = currentStreak.lastLoginDate || '';
        const currentDate = new Date().toISOString().split('T')[0];

        if (lastLoginDate !== currentDate) {
          const lastLoginDateTime = new Date(lastLoginDate).getTime();
          const currentDateTime = new Date().getTime();
          const oneDay = 24 * 60 * 60 * 1000;

          if (currentDateTime - lastLoginDateTime >= oneDay) {
            return { value: 1, lastLoginDate: currentDate };
          }
        }

        return { value: currentStreak.value, lastLoginDate: currentDate };
      }).then((transactionResult) => {
        set(streakRef, transactionResult.snapshot.val())
          .then(() => {
            console.log('Streak updated successfully:', transactionResult.snapshot.val());
          })
          .catch((error) => {
            console.error('Error updating streak in the database:', error);
          });
      }).catch((error) => {
        console.error('Transaction failed:', error);
      });
    }
  
  function updateRisingSeaProgress() {
    // Get the currently authenticated user
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const risingSeaRef = ref(db, 'users/' + userId + '/progress/risingSea');
  
        // Select content read checkboxes by their IDs
        const contentReadCheckboxes = document.querySelectorAll('input[name="risingSeaContentRead"]:checked');

        // Select videos watched checkboxes by their IDs
        const videosWatchedCheckboxes = document.querySelectorAll('input[name="risingSeaVideosWatched"]:checked');

        // Count checked content read checkboxes
        const contentReadCount = contentReadCheckboxes.length;

        // Count checked videos watched checkboxes
        const videosWatchedCount = videosWatchedCheckboxes.length;

        // Calculate percentage completion for content read and videos watched
        const contentReadCompletion = Math.min(Math.round((contentReadCount / 3) * 30), 30); // Max 30%
        const videosWatchedCompletion = Math.min(Math.round((videosWatchedCount / 6) * 60), 60); // Max 60%

        // Calculate total completion
        const totalCompletion = contentReadCompletion + videosWatchedCompletion ;

        // Adjust percentages if total exceeds 100%
        if (totalCompletion > 100) {
            console.error('Total completion exceeds 100%. Adjusting percentages.');
            const excess = totalCompletion - 100;
            // Reduce videos watched completion by the excess
            videosWatchedCompletion -= excess;
        }

        // Update database with the calculated completion percentages
        set(risingSeaRef, {
            contentRead: contentReadCompletion,
            videosWatched: videosWatchedCompletion
        }).then(() => {
            console.log('Rising Sea progress updated successfully.');
        }).catch((error) => {
            console.error('Error updating Rising Sea progress:', error);
        });
      } else {
        console.log('No user is currently logged in.');
      }
    }


function updateRecyclingProgress() {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const recyclingRef = ref(db, 'users/' + userId + '/progress/recycling');

      const contentReadCheckboxes = document.querySelectorAll('input[name="recyclingContentRead"]:checked');
      const videosWatchedCheckboxes = document.querySelectorAll('input[name="recyclingVideosWatched"]:checked');

      const contentReadCount = contentReadCheckboxes.length;
      const videosWatchedCount = videosWatchedCheckboxes.length;

      const contentReadCompletion = Math.min(Math.round((contentReadCount / 3) * 30), 30);
      const videosWatchedCompletion = Math.min(Math.round((videosWatchedCount / 6) * 60), 60);

      const totalCompletion = contentReadCompletion + videosWatchedCompletion ;

      if (totalCompletion > 100) {
          console.error('Total completion exceeds 100%. Adjusting percentages.');
          const excess = totalCompletion - 100;
          videosWatchedCompletion -= excess;
      }

      set(recyclingRef, {
          contentRead: contentReadCompletion,
          videosWatched: videosWatchedCompletion
      }).then(() => {
          console.log('Recycling progress updated successfully.');
      }).catch((error) => {
          console.error('Error updating Recycling progress:', error);
      });
    } else {
      console.log('No user is currently logged in.');
    }
  }

  function updateAirPollutionProgress() {
    const user = auth.currentUser;
  
    if (user) {
      const userId = user.uid;
      const airPollutionRef = ref(db, 'users/' + userId + '/progress/airPollution');
  
      const contentReadCheckboxes = document.querySelectorAll('input[name="airPollutionContentRead"]:checked');
      const videosWatchedCheckboxes = document.querySelectorAll('input[name="airPollutionVideosWatched"]:checked');
  
      const contentReadCount = contentReadCheckboxes.length;
      const videosWatchedCount = videosWatchedCheckboxes.length;
  
      const contentReadCompletion = Math.min(Math.round((contentReadCount / 3) * 30), 30);
      const videosWatchedCompletion = Math.min(Math.round((videosWatchedCount / 6) * 60), 60);
  
      const totalCompletion = contentReadCompletion + videosWatchedCompletion ;
  
      if (totalCompletion > 100) {
        console.error('Total completion exceeds 100%. Adjusting percentages.');
        const excess = totalCompletion - 100;
        videosWatchedCompletion -= excess;
      }
  
      set(airPollutionRef, {
        contentRead: contentReadCompletion,
        videosWatched: videosWatchedCompletion
      }).then(() => {
        console.log('Air Pollution progress updated successfully.');
      }).catch((error) => {
        console.error('Error updating Air Pollution progress:', error);
      });
    } else {
      console.log('No user is currently logged in.');
    }
  }
  

  function updateCheckboxStateInDatabase(userId, checkboxId, checked) {
    const checkboxRef = ref(db, `users/${userId}/checkboxes/${checkboxId}`);
    set(checkboxRef, checked)
      .then(() => {
        console.log(`Checkbox state (${checkboxId}) updated in the database.`);
      })
      .catch((error) => {
        console.error('Error updating checkbox state in the database:', error);
      });
  }
  

  function updateCheckboxState(event) {
    const checkbox = event.target;
    const userId = auth.currentUser.uid; // Get current user ID
    checkboxState[checkbox.id] = checkbox.checked;
    sessionStorage.setItem('checkboxState', JSON.stringify(checkboxState));
    updateCheckboxStateInDatabase(userId, checkbox.id, checkbox.checked); // Update state in Firebase
  }

  const scrollToBottomLink = document.getElementById("scrollToBottom");
  
  scrollToBottomLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Use smooth scrolling
    window.scroll({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });

    // Change the color after clicking
    scrollToBottomLink.style.color = 'purple'; // Change this to the desired color
  });



});
