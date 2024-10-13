document.addEventListener("DOMContentLoaded", function () {

  /* Helper function to validate email format */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  /* Sign-Up Form Validation */
  function handleSignUpForm() {
    const signUpForm = document.getElementById("signUpForm");
  
    if (signUpForm) {
      signUpForm.addEventListener("submit", async function (event) {
        event.preventDefault();  // Prevent the form from submitting
  
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
  
        // Password match validation
        if (password !== confirmPassword) {
          alert("Passwords do not match! Please try again.");
          return;
        }
  
        // Send the signup data to the backend (Node.js/Express.js)
        try {
          const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert(result.message);  // Display success message
            window.location.href = "/login.html";  // Redirect to login page
          } else {
            alert(result.error);  // Display error message
          }
        } catch (error) {
          console.error('Error during registration:', error);
          alert('An error occurred. Please try again.');
        }
      });
    }
  }
  

  /* Login Form Validation and Submission */
  function handleLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();  // Prevent the form from submitting

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validate email and password length
        if (!validateEmail(email)) {
          alert("Please enter a valid email address.");
          return;
        }

        if (password.length < 6) {
          alert("Password must be at least 6 characters long.");
          return;
        }

        // Send data to the backend (Node.js/Express.js)
        try {
          const response = await fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
          });

          const result = await response.json();

          if (response.ok) {
            alert(result.message);  // Display success message
            window.location.href = "/instrument-detail.html";  // Redirect on successful login
          } else {
            alert(result.error);  // Display error message
          }
        } catch (error) {
          console.error('Error during login:', error);
          alert('An error occurred. Please try again.');
        }
      });
    }
  }

  /* Button Interaction on Home Page */
  function handleExploreButton() {
    const exploreButton = document.querySelector('.btn');
    if (exploreButton) {
      exploreButton.addEventListener("click", function () {
        alert("Let's explore some instruments!");
      });
    }
  }

  /* Admin Panel Delete Confirmation */
  function handleDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    if (deleteButtons.length > 0) {
      deleteButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();  // Prevent default link behavior
          if (confirm("Are you sure you want to delete this item?")) {
            // Placeholder: Add actual delete functionality here
            alert("Item deleted!");
          }
        });
      });
    }
  }

  /* Audio Player Controls */
  function handleAudioPlayers() {
    const audioPlayers = document.querySelectorAll("audio");
    if (audioPlayers.length > 0) {
      audioPlayers.forEach(function (player) {
        player.addEventListener("play", function () {
          console.log(`Audio playing: ${player.src}`);
        });

        player.addEventListener("pause", function () {
          console.log(`Audio paused: ${player.src}`);
        });
      });
    }
  }

  /* Hamburger Menu Toggle for Mobile */
  function handleHamburgerMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
      navToggle.addEventListener('click', function () {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !expanded);
        navLinks.classList.toggle('active');
      });
    }
  }

  // Initialize all event handlers
  function init() {
    handleSignUpForm();
    handleLoginForm();
    handleExploreButton();
    handleDeleteButtons();
    handleAudioPlayers();
    handleHamburgerMenu();
  }

  // Call the init function on DOMContentLoaded
  init();

});
