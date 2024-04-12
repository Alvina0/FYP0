import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Firebase configuration
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

console.log("JavaScript file is connected!");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

const questions = [
    {
      question: "What is the primary goal of recycling?",
      options: ["To dispose of waste materials", "To conserve resources and protect the environment", "To incinerate waste"],
      correctAnswer: "To conserve resources and protect the environment",
      explanation: "The primary goal of recycling is to conserve resources, reduce pollution, and protect the environment, as highlighted in the content."
    },
    {
      question: "What is the first step in the recycling process?",
      options: ["Collection of recyclable materials", "Sorting materials by type", "Processing materials to remove contaminants"],
      correctAnswer: "Collection of recyclable materials",
      explanation: "The recycling process starts with the collection of recyclable materials, as mentioned in the content."
    },
    {
      question: "Which of the following materials is commonly recycled into new paper products?",
      options: ["Glass", "Metal", "Cardboard"],
      correctAnswer: "Cardboard",
      explanation: "Paper and cardboard materials are commonly recycled into new paper products, such as cardboard packaging and newspapers, as described in the content."
    },
    {
      question: "What happens to plastic items during the recycling process?",
      options: ["They are incinerated", "They are melted and formed into pellets", "They are compressed into blocks"],
      correctAnswer: "They are melted and formed into pellets",
      explanation: "Plastic items are shredded, melted, and formed into pellets during the recycling process, as mentioned in the content."
    },
    {
      question: "What are the benefits of recycling?",
      options: ["Increased pollution", "Reduced energy consumption", "Decreased job opportunities"],
      correctAnswer: "Reduced energy consumption",
      explanation: "Recycling reduces energy consumption by diverting waste from landfills and minimizing the need for raw materials extraction, as highlighted in the content."
    },
    {
      question: "How does littering affect wildlife?",
      options: ["It provides habitat for animals", "It enhances biodiversity", "It can lead to injury or death"],
      correctAnswer: "It can lead to injury or death",
      explanation: "Littering can harm wildlife by causing ingestion or entanglement, leading to injury or death, as described in the content."
    },  
    {
        question: "What is the term for the process of converting waste materials into new products that are of higher quality or value?",
        options: ["Recycling", "Upcycling", "Downcycling"],
        correctAnswer: "Upcycling",
        explanation: "Upcycling refers to the process of transforming waste materials into new products of higher quality or value, rather than simply recycling them into similar products."
      },
      {
        question: "Which of the following materials cannot be recycled indefinitely?",
        options: ["Plastic", "Glass", "Paper"],
        correctAnswer: "Plastic",
        explanation: "While glass and paper can be recycled indefinitely without losing quality, plastic undergoes degradation during recycling processes and can only be recycled a limited number of times."
      },
      {
        question: "What is the term used to describe the process of breaking down materials into their basic components for reuse?",
        options: ["Recycling", "Repurposing", "Decomposition"],
        correctAnswer: "Decomposition",
        explanation: "Decomposition involves breaking down materials into their basic components for reuse or disposal, typically through natural or chemical processes."
      },
      {
        question: "Which of the following recycling methods involves turning waste materials into energy through high-temperature combustion?",
        options: ["Mechanical recycling", "Chemical recycling", "Waste-to-energy"],
        correctAnswer: "Waste-to-energy",
        explanation: "Waste-to-energy involves converting waste materials into energy, such as electricity or heat, through combustion or other processes, rather than recycling them into new products."
      }
  ];
  
  

  document.addEventListener('DOMContentLoaded', function() {

    function updateQuizCompletion(quizScore) {
        // Get the current user
        const currentUser = auth.currentUser;
        
        if (currentUser) {
            // If user is logged in, get the user ID
            const userId = currentUser.uid;
            
            // Reference to the user's progress in the database
            const userProgressRef = ref(db, `users/${userId}/progress/recycling/quizCompletion`);
            
            // Update quiz completion data in the database
            set(userProgressRef, {
                quizScore: quizScore * 10// Save the quiz score
            }, { merge: true }).then(() => {
                console.log('Quiz completion data updated successfully.');
            }).catch((error) => {
                console.error('Error updating quiz completion data:', error);
            });
        } else {
            console.error('No user is currently logged in.');
        }
    }
    
  const userResponses = [];
  let score = 0;

  let currentQuestionIndex = 0; // Variable to keep track of the current question index
  function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

  function displayQuestion() {
      const questionContainer = document.getElementById('questionContainer');
      const questionNum = document.getElementById('questionnum');
      const quizForm = document.getElementById('quizForm');

      // Clear previous question and options
      questionContainer.innerHTML = '';
      quizForm.innerHTML = '';

      // Check if there are more questions
      if (currentQuestionIndex >= questions.length) {
          // No more questions, show quiz recap
          showRecap();
          // Close the modal
          closeModal();
          return;
      }

      // Get the current question
      const currentQuestion = questions[currentQuestionIndex];

      // Display question number
      questionNum.textContent = `Question ${currentQuestionIndex + 1}`;

      // Display question
      const questionElement = document.createElement('p');
      questionElement.textContent = currentQuestion.question;
      questionContainer.appendChild(questionElement);

      // Display options
      currentQuestion.options.forEach((option, index) => {
          const optionDiv = document.createElement('div'); // Create a div for each option
          const optionElement = document.createElement('label');
          optionElement.innerHTML = `
              <input type="radio" name="answer" value="${option}">
              ${option}
          `;
          optionDiv.appendChild(optionElement); // Append the option to the div
          quizForm.appendChild(optionDiv); // Append the div to the form

      });

        // Add submit button
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Answer';
        quizForm.appendChild(submitButton);

        // Handle form submission
        submitButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            const selectedOption = quizForm.querySelector('input[name="answer"]:checked');
            if (!selectedOption) {
                alert('Please select an answer.');
                return;
            }
            const answer = selectedOption.value;
            const correctAnswer = questions[currentQuestionIndex].correctAnswer;
            checkAnswer(answer, correctAnswer);
        });
    }

      // Function to check answer
      function checkAnswer(answer, correctAnswer) {
        // Push user's response to userResponses array
        userResponses.push(answer);
        if (answer === correctAnswer) {
            score++; // Increment the score for correct answer
        }
        // Move to the next question
        currentQuestionIndex++;
        displayQuestion();

        updateQuizCompletion(score);


    }


    

    function showRecap() {
      const scorePercentage = (score / questions.length) * 100;
      const recapSection = document.getElementById('recapSection');
      recapSection.style.display = 'block';
      recapSection.innerHTML = `
          <div style="text-align:center;" class="recap-header">
              <h3>Score: ${scorePercentage}% (${score}/${questions.length})</h3>
          </div>`;
      
      questions.forEach((question, index) => {
          const questionDiv = document.createElement('div');
          questionDiv.classList.add('recap-question');
          questionDiv.innerHTML = `
              <div class="recap-item">
                  <h4>Question</strong> ${index + 1}: ${question.question}</h4>
                  <p><strong>Your Response:</strong> ${userResponses[index]}</p>
                  <p><strong>The Correct Answer:</strong> ${question.correctAnswer}</p>
                  <p><strong>Explanation:</strong> ${question.explanation}</p>
              </div>`;
          recapSection.appendChild(questionDiv);
      });
      
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            const userScoreRef = ref(db, `users/${userId}/progress/recycling/quizCompletion`);
            set(userScoreRef, {
                quizScore: scorePercentage // Save the quiz score percentage
            }, { merge: true }).then(() => {
                console.log('Score percentage saved successfully.');
            }).catch((error) => {
                console.error('Error saving score percentage:', error);
            });
        } else {
            console.error('No user is currently logged in.');
        }
    
        // Hide the modal
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
    }
    
  

  // Call displayQuestion function to start the quiz
  displayQuestion();
});









