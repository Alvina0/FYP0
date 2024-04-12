// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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

console.log("JavaScript file is connected!");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();


const questions = [
    {
      question: "What are the primary drivers of rising sea levels?",
      options: ["Deforestation and industrialization", "Climate change and melting polar ice caps", "Ocean pollution and overfishing"],
      correctAnswer: "Climate change and melting polar ice caps",
      explanation: "Rising sea levels are primarily driven by climate change and the melting of polar ice caps, as stated in the content."
    },
    {
      question: "How does ocean warming affect coral reefs?",
      options: ["It promotes coral growth", "It causes coral bleaching and habitat loss", "It increases biodiversity"],
      correctAnswer: "It causes coral bleaching and habitat loss",
      explanation: "Ocean warming leads to coral bleaching and habitat loss, making coral reefs vulnerable to extinction, as mentioned in the content."
    },
    {
      question: "What is the main consequence of ocean acidification on marine organisms?",
      options: ["Enhanced shell formation", "Decreased shell strength", "Increased reproductive rates"],
      correctAnswer: "Decreased shell strength",
      explanation: "Ocean acidification results in decreased shell strength in marine organisms, impacting their survival and ecosystem function, as highlighted in the content."
    },
    {
      question: "How do rising sea levels affect coastal communities?",
      options: ["They reduce flood risks", "They increase saltwater intrusion into freshwater sources", "They improve coastal biodiversity"],
      correctAnswer: "They increase saltwater intrusion into freshwater sources",
      explanation: "Rising sea levels lead to increased saltwater intrusion into freshwater sources, posing challenges for coastal communities, as mentioned in the content."
    },
    {
      question: "What role do changing ocean currents play in climate patterns?",
      options: ["They have no impact on climate", "They redistribute heat and moisture globally", "They cause ocean acidification"],
      correctAnswer: "They redistribute heat and moisture globally",
      explanation: "Changing ocean currents redistribute heat and moisture globally, influencing climate patterns, as described in the content."
    },
    {
      question: "How does pollution contribute to the degradation of marine habitats?",
      options: ["It promotes biodiversity", "It reduces plastic accumulation", "It contaminates coastal waters and harms marine life"],
      correctAnswer: "It contaminates coastal waters and harms marine life",
      explanation: "Pollution contaminates coastal waters and harms marine life, contributing to the degradation of marine habitats, as highlighted in the content."
    },
    {
      question: "What is the socio-economic impact of rising sea levels on coastal communities?",
      options: ["Decreased risk of displacement", "Loss of livelihoods and infrastructure", "Increased access to coastal resources"],
      correctAnswer: "Loss of livelihoods and infrastructure",
      explanation: "Rising sea levels result in the loss of livelihoods and infrastructure for coastal communities, leading to socio-economic challenges, as mentioned in the content."
    },
    {
      question: "What measures are essential for addressing rising sea levels?",
      options: ["Overfishing and deforestation", "Climate change mitigation and coastal habitat protection", "Increased greenhouse gas emissions"],
      correctAnswer: "Climate change mitigation and coastal habitat protection",
      explanation: "Addressing rising sea levels requires climate change mitigation efforts and the protection of coastal habitats, as highlighted in the content."
    },
    {
      question: "How do rising sea levels impact global biodiversity?",
      options: ["They enhance biodiversity in marine ecosystems", "They decrease biodiversity due to habitat loss", "They have no impact on biodiversity"],
      correctAnswer: "They decrease biodiversity due to habitat loss",
      explanation: "Rising sea levels decrease biodiversity due to habitat loss in marine ecosystems, as stated in the content."
    },
    {
      question: "What is the significance of sustainable ocean management practices?",
      options: ["They exacerbate marine pollution", "They promote overfishing and habitat destruction", "They contribute to ocean conservation and ecosystem resilience"],
      correctAnswer: "They contribute to ocean conservation and ecosystem resilience",
      explanation: "Sustainable ocean management practices contribute to ocean conservation and ecosystem resilience, aiding in addressing rising sea levels, as mentioned in the content."
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
            const userProgressRef = ref(db, `users/${userId}/progress/risingSea/quizCompletion`);
            
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
    
  // Put your JavaScript code here
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
            // Correct answer
            // You can add your logic for what to do when the answer is correct
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
            const userScoreRef = ref(db, `users/${userId}/progress/risingSea/quizCompletion`);
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