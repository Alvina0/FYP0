import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, onValue, get, push } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"; // Add this import statement
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

console.log("this is discussion2!");
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getDatabase(app);

const auth = getAuth(app); // Initialize Firebase Authentication

document.addEventListener('DOMContentLoaded', function () {
    const submitCommentButton = document.getElementById('submit-comment');
    const commentsContainer = document.getElementById('comments-container');
    const commentOrderSelect = document.getElementById('comment-order');

    loadProfanityWords();

    function toggleReplyTextbox(commentId) {
      const replyContainer = document.getElementById(`replies-container-${commentId}`);

      if (replyContainer ) {
          if (replyContainer.style.display === 'none' || replyContainer.style.display === '') {
            replyContainer.style.display = 'block'; // Show the reply textbox
          } else {
              replyContainer.style.display = 'none'; // Hide the reply textbox
          }
      }
  }
  
    
  function showLoginForm() {
    document.getElementById('loginSignup').style.display = 'block';
  }


  // Function to get the username from user ID
  function getUsernameFromUserId(userId) {
    return new Promise((resolve, reject) => {             
      const userRef = ref(db, `users/${userId}/username`);
      get(userRef).then((snapshot) => {
        const username = snapshot.val();
        resolve(username);
      }).catch((error) => {
        console.error('Error getting username:', error);
        reject(error);
      });
    });
  }

  let profanityWords = [];

  function loadProfanityWords() {
    fetch('en.txt')
      .then(response => response.text())
      .then(data => {
        // Split the text file content by new line to get individual words
        profanityWords = data.split('\n').filter(word => word.trim() !== ''); // Filter out empty strings
      })
      .catch(error => {
        console.error('Error loading profanity words:', error);
      });
  }
  

function containsProfanity(commentContent) {
  // Convert the comment content to lowercase for case-insensitive comparison
  commentContent = commentContent.toLowerCase();

  // Check each profanity word against the comment content
  for (let word of profanityWords) {
    console.log('Checking word:', word);
    const regex = new RegExp('\\b' + word.toLowerCase() + '\\b');
    console.log('Regex:', regex);
    if (regex.test(commentContent)) {
      console.log('Profanity detected:', word);
      return true; // Profanity detected
    }
  }
  return false; // No profanity detected
}




function submitComment() {
  const commentTextarea = document.getElementById('new-comment');
  const commentContent = commentTextarea.value.trim();
  const user = auth.currentUser;

  if (!user) {
    showLoginForm(); // If user is not authenticated, show login form
    return;
  }

  if (commentContent === '') {
    alert('Please enter a comment.');
    return;
  }

  // Check for profanity
  if (containsProfanity(commentContent)) {
    alert('Your comment contains profanity. Please remove it before submitting.');
    return;
  }

  // Proceed with submitting the comment if no profanity is detected
  const userId = user.uid;
  const timestamp = new Date().getTime();

  // Push the new comment to the database
  const newCommentRef = push(ref(db, 'comments'));
  set(newCommentRef, {
    userId: userId,
    timestamp: timestamp,
    content: commentContent
  }).then(() => {
    console.log('Comment submitted successfully.');
    alert('Comment submitted successfully.')
    commentTextarea.value = ''; // Clear the comment textarea
  }).catch((error) => {
    console.error('Error submitting comment:', error);
    alert('An error occurred while submitting your comment. Please try again later.');
  });
}

    
  function displayComments(comments) {
    commentsContainer.innerHTML = ''; // Clear the comments container

    comments.forEach((comment) => {
      const commentHTML = `
          <div class="comment" style="margin-left:5%;">
          <img src="user logo.jpg" class="user-profile" width="30" height="30" 
              style="display: inline-block; vertical-align: middle; margin-right: 10px;">
          <p 
              style="display: inline-block; vertical-align: middle; margin: 0;">
              <strong>${comment.username}</strong> (${new Date(comment.timestamp).toLocaleString()}):
          </p>
            
          <p 
              style="margin-left: 45px;">${comment.content}
          </p>
              ${comment.userId === auth.currentUser?.uid ? `
          <button 
                class="delete-comment" data-comment-id="${comment.commentId}">Delete Comment
          </button>` : ''}

          <div class="like-dislike-buttons">
            <button class="like-button" 
              data-comment-id="${comment.commentId}"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
            </button>
            <button class="dislike-button" 
            data-comment-id="${comment.commentId}"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
            </button>
          </div>
          <div class="like-dislike-count">
          Likes: <span id="like-count-${comment.commentId}">0</span>
          Dislikes: <span id="dislike-count-${comment.commentId}">0</span> 
          </div>
      
          <p style="font-weight: bold;"> Reply Below</p>
            <div id="reply-actions" class="reply-actions">

                <textarea 
                  id="reply-textarea-${comment.commentId}" class="hide-reply-textarea" 
                  placeholder="Write your reply here...">
                </textarea>
                <br>
                <button
                  class="submit-reply-button" data-comment-id="${comment.commentId}">Submit Reply
                </button>

                </div>
                <br>  
                <button 
                  class="reply-button" data-comment-id="${comment.commentId}">Close/Show Replies
                </button>

              <div 
                id="replies-container-${comment.commentId}" 
                style="display: block; margin-left: 13%;">

                <div id="replies-${comment.commentId}"></div>
              </div>
          </div>
      `;
      commentsContainer.insertAdjacentHTML('beforeend', commentHTML);
  
      // Display replies for this comment
      const repliesContainer = document.getElementById(`replies-${comment.commentId}`);
      displayReplies(comment.commentId, repliesContainer);
 
      displayLikesDislikes(comment.commentId);

    });
    
  }
  


  // Event listener for handling reply button click
  commentsContainer.addEventListener('click', function (event) {
      console.log('Clicked:', event.target); // Debugging statement to check which element is clicked
      if (event.target.classList.contains('reply-button')) {
          const commentId = event.target.dataset.commentId;
          console.log('Comment ID:', commentId); // Debugging statement to check the comment ID
          const replyContainer = document.getElementById(`replies-container-${commentId}`);
          console.log('Reply Container:', replyContainer); // Debugging statement to check the reply container
          toggleReplyTextbox(commentId); // Toggle reply textbox visibility
          displayReplies(commentId, replyContainer); // Display replies
      } else if (event.target.classList.contains('submit-reply-button')) {
          const commentId = event.target.dataset.commentId;
          console.log('Submit Reply Button Clicked for Comment ID:', commentId); // Debugging statement
          submitReply(commentId); // Call submitReply function
      }
  });



  
  function submitReply(commentId) {
      const replyTextarea = document.getElementById(`reply-textarea-${commentId}`);
      const replyContent = replyTextarea.value.trim();
      const user = auth.currentUser;
  
      if (!user) {
        showLoginForm(); // If user is not authenticated, show login form
        return;
      }
  
      if (replyContent === '') {
        alert('Please enter a reply.');
        return;
      }
      

      const userId = user.uid;
      const timestamp = new Date().getTime();
  
      // Push the new reply to the database with a reference to the parent comment's ID
      const newReplyRef = push(ref(db, `comments/${commentId}/replies`));
      set(newReplyRef, {
        userId: userId,
        timestamp: timestamp,
        content: replyContent
      }).then(() => {
        console.log('Reply submitted successfully.');
        replyTextarea.value = ''; // Clear the reply textarea
      }).catch((error) => {
        console.error('Error submitting reply:', error);
        alert('An error occurred while submitting your reply. Please try again later.');
      });
  } 
    
  
  function displayReplies(commentId, repliesContainer) {
    const repliesRef = ref(db, `comments/${commentId}/replies`);
    onValue(repliesRef, (snapshot) => {
      repliesContainer.innerHTML = ''; // Clear the replies container

      snapshot.forEach((childSnapshot) => {
        const reply = childSnapshot.val();
        const replyDiv = document.createElement('div');
        replyDiv.classList.add('reply');

        getUsernameFromUserId(reply.userId).then((username) => {
          replyDiv.innerHTML = `
          <div class="reply-content">
          <img 
            src="user logo.jpg" class="user-profile" width="30" height="30" 
            style="display: inline-block; vertical-align: middle; margin-right: 10px;">
          <p 
            style="display: inline-block; vertical-align: middle; margin: 0;"><strong>${username}</strong> 
            (${new Date(reply.timestamp).toLocaleString()}):
          </p>
            <br>
          <p style="margin-left: 45px;">${reply.content}</p>
          ${reply.userId === auth.currentUser?.uid ? 
            `<button 
              class="delete-reply" data-comment-id="${commentId}" 
              data-reply-id="${childSnapshot.key}">Delete Reply
            </button>` : ''}

      </div>
          `;
          repliesContainer.appendChild(replyDiv);
        }).catch((error) => {
          console.error('Error getting username:', error);
        });
      });
    });
  }


      
  function loadCommentsWithSortingOrder() {
    const selectedOrder = commentOrderSelect.value;
    if (selectedOrder === 'latest') {
        loadComments('desc');
    } else if (selectedOrder === 'oldest') {
        loadComments('asc');
    }
}
commentOrderSelect.addEventListener('change', loadCommentsWithSortingOrder);

      
function loadComments(order) {
  const commentsRef = ref(db, 'comments');
  onValue(commentsRef, (snapshot) => {
      const comments = [];
      snapshot.forEach((childSnapshot) => {
          const comment = childSnapshot.val();
          comment.commentId = childSnapshot.key;

          // Fetch the username for the comment's userId
          getUsernameFromUserId(comment.userId).then((username) => {
              // Add the username to the comment object
              comment.username = username;

              // Push the modified comment to the array
              comments.push(comment);

              // Display comments after all usernames are fetched
              if (comments.length === snapshot.size) {
                  // Sort comments based on timestamp
                  if (order === 'desc') {
                      comments.sort((a, b) => b.timestamp - a.timestamp); // Descending order
                  } else if (order === 'asc') {
                      comments.sort((a, b) => a.timestamp - b.timestamp); // Ascending order
                  }

                  // Display sorted comments
                  displayComments(comments);
              }
          }).catch((error) => {
              console.error('Error getting username:', error);
          });
      });
  });
}
    
  function deleteComment(commentId) {
    const user = auth.currentUser;
    if (!user) {
        showLoginForm();
        return;
    }

    // Check if the current user is the owner of the comment
    const commentRef = ref(db, `comments/${commentId}`);
    get(commentRef).then((snapshot) => {
        const comment = snapshot.val();
        if (comment.userId === user.uid) {
            // User is the owner, proceed with deletion
            set(commentRef, null)
                .then(() => {
                    console.log('Comment deleted successfully.');
                    // Reload comments after deletion
                    loadComments();
                })
                .catch((error) => {
                    console.error('Error deleting comment:', error);
                    alert('An error occurred while deleting the comment. Please try again later.');
                });
        } else {
            alert('You are not authorized to delete this comment.');
        }
    }).catch((error) => {
        console.error('Error getting comment:', error);
        alert('An error occurred while retrieving the comment data.');
    });
  }  

  function deleteReply(commentId, replyId) {
    const user = auth.currentUser;
    if (!user) {
        showLoginForm();
        return;
    }

    // Check if the current user is the owner of the reply
    const replyRef = ref(db, `comments/${commentId}/replies/${replyId}`);
    get(replyRef).then((snapshot) => {
        const reply = snapshot.val();
        if (reply.userId === user.uid) {
            // User is the owner, proceed with deletion
            set(replyRef, null)
                .then(() => {
                    console.log('Reply deleted successfully.');
                    // Reload replies after deletion
                    displayReplies(commentId, document.getElementById(`replies-${commentId}`));
                })
                .catch((error) => {
                    console.error('Error deleting reply:', error);
                    alert('An error occurred while deleting the reply. Please try again later.');
                });
        } else {
            alert('You are not authorized to delete this reply.');
        }
    }).catch((error) => {
        console.error('Error getting reply:', error);
        alert('An error occurred while retrieving the reply data.');
    });
  }

commentsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-comment')) {
        const commentId = event.target.dataset.commentId;
        deleteComment(commentId);
    }
});

// Event listener for delete reply buttons
commentsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-reply')) {
        const commentId = event.target.dataset.commentId;
        const replyId = event.target.dataset.replyId;
        deleteReply(commentId, replyId);
    }
});

// Function to toggle like or dislike for a comment
function toggleLikeDislike(commentId, action) {
  const user = auth.currentUser;
  if (!user) {
      showLoginForm();
      return;
  }

  const likeRef = ref(db, `comments/${commentId}/likes/${user.uid}`);
  const dislikeRef = ref(db, `comments/${commentId}/dislikes/${user.uid}`);

  // Check if the user has already liked or disliked the comment
  get(likeRef).then((likeSnapshot) => {
      const hasLiked = likeSnapshot.exists();
      get(dislikeRef).then((dislikeSnapshot) => {
          const hasDisliked = dislikeSnapshot.exists();

          if (action === 'like') {
              if (hasLiked) {
                  // If user already liked the comment, remove the like
                  set(likeRef, null)
                      .then(() => console.log('Like removed successfully.'))
                      .catch((error) => console.error('Error removing like:', error));
              } else {
                  // If user had previously disliked the comment, remove the dislike
                  if (hasDisliked) {
                      set(dislikeRef, null)
                          .then(() => console.log('Dislike removed successfully.'))
                          .catch((error) => console.error('Error removing dislike:', error));
                  }
                  // Add the like
                  set(likeRef, true)
                      .then(() => console.log('Liked successfully.'))
                      .catch((error) => console.error('Error adding like:', error));
              }
          } else if (action === 'dislike') {
              if (hasDisliked) {
                  // If user already disliked the comment, remove the dislike
                  set(dislikeRef, null)
                      .then(() => console.log('Dislike removed successfully.'))
                      .catch((error) => console.error('Error removing dislike:', error));
              } else {
                  // If user had previously liked the comment, remove the like
                  if (hasLiked) {
                      set(likeRef, null)
                          .then(() => console.log('Like removed successfully.'))
                          .catch((error) => console.error('Error removing like:', error));
                  }
                  // Add the dislike
                  set(dislikeRef, true)
                      .then(() => console.log('Disliked successfully.'))
                      .catch((error) => console.error('Error adding dislike:', error));
              }
          }
      }).catch((error) => console.error('Error checking dislike:', error));
  }).catch((error) => console.error('Error checking like:', error));
}

// Function to display likes and dislikes for a comment
function displayLikesDislikes(commentId) {
  const likesRef = ref(db, `comments/${commentId}/likes`);
  const dislikesRef = ref(db, `comments/${commentId}/dislikes`);

  // Get the count of likes
  onValue(likesRef, (snapshot) => {
      const likesCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      // Display likes count in your UI
      const likesCountElement = document.getElementById(`like-count-${commentId}`);
      if (likesCountElement) {
          likesCountElement.textContent = likesCount;
      }
  });

  // Get the count of dislikes
  onValue(dislikesRef, (snapshot) => {
      const dislikesCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      // Display dislikes count in your UI
      const dislikesCountElement = document.getElementById(`dislike-count-${commentId}`);
      if (dislikesCountElement) {
          dislikesCountElement.textContent = dislikesCount;
      }
  });
}



// Event listener for like button
commentsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('like-button') || event.target.parentElement.classList.contains('like-button')) {
      const likeButton = event.target.classList.contains('like-button') ? event.target : event.target.parentElement;
      const commentId = likeButton.dataset.commentId;
      toggleLikeDislike(commentId, 'like');
  }
});

// Event listener for dislike button
commentsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('dislike-button') || event.target.parentElement.classList.contains('dislike-button')) {
      const dislikeButton = event.target.classList.contains('dislike-button') ? event.target : event.target.parentElement;
      const commentId = dislikeButton.dataset.commentId;
      toggleLikeDislike(commentId, 'dislike');
  }
});


  submitCommentButton.addEventListener('click', submitComment);

  // Load comments when the page loads
  loadComments();
  });
