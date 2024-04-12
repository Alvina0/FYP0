// Function to update streak upon successful login
export function updateStreak() {
    // Get the current date in GMT
    function getCurrentGMTDate() {
        const now = new Date();
        return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    }
    
    let streak = parseInt(localStorage.getItem('streak')) || 0; // Parse the streak count as an integer
    
    // Get the last login date and convert it to GMT date
    let lastLoginDate = new Date(localStorage.getItem('lastLoginDate'));
    if (!lastLoginDate || getCurrentGMTDate().toDateString() !== lastLoginDate.toDateString()) {
        // If the last login date is not set or is different from the current date, reset the streak to 1
        streak = 1;
    } else {
        // Increment the streak if the user logged in today
        streak++;
    }
    
    // Update the streak value in the storage
    localStorage.setItem('streak', streak);
    
    // Display the streak on the webpage
    document.getElementById('streak').textContent = streak;
}


AIzaSyA6RECHdWnErpPQvlkM66R0Auo_6aPjNSs

