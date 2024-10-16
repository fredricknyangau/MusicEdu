document.addEventListener("DOMContentLoaded", function () {
  // Helper function to validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Display response messages on the page
  function displayMessage(selector, message, isError = false) {
    const messageElement = document.querySelector(selector);
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.style.color = isError ? 'red' : 'green';
    }
  }

  // Function to get auth headers (JWT token)
  function getAuthHeaders() {
    const token = localStorage.getItem('token'); // Assumes token is stored in localStorage
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Handle sign-up form validation and submission
  function handleSignUpForm() {
    const signUpForm = document.getElementById("signUpForm");
  
    if (signUpForm) {
      signUpForm.addEventListener("submit", async function (event) {
        event.preventDefault();  // Prevent the default form submission

        // Gather form data
        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;

        // Validate form inputs
        if (password !== confirmPassword) {
          displayMessage('#responseMessage', "Passwords do not match! Please try again.", true);
          return;
        }

        if (!validateEmail(email)) {
          displayMessage('#responseMessage', "Please enter a valid email address.", true);
          return;
        }

        // Send the signup data to the backend
        try {
          const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, username, email, password, role })
          });

          const result = await response.json();
          handleResponse(response, result, "/login.html");
        } catch (error) {
          console.error('Error during registration:', error);
          displayMessage('#responseMessage', 'An error occurred. Please try again.', true);
        }
      });
    }
  }

  // Handle login form validation and submission
  function handleLoginForm() {
    const loginForm = document.getElementById("loginForm");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();  // Prevent the default form submission

        // Gather form data
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validate form inputs
        if (!validateEmail(email)) {
          displayMessage('#responseMessage', "Please enter a valid email address.", true);
          return;
        }

        if (password.length < 6) {
          displayMessage('#responseMessage', "Password must be at least 6 characters long.", true);
          return;
        }

        // Send login data to the backend
        try {
          const response = await fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
          });

          const result = await response.json();
          handleResponse(response, result, "/instrument-detail.html");
        } catch (error) {
          console.error('Error during login:', error);
          displayMessage('#responseMessage', 'An error occurred. Please try again.', true);
        }
      });
    }
  }

  // Common function to handle response messages
  function handleResponse(response, result, redirectUrl) {
    if (response.ok) {
      displayMessage('#responseMessage', result.message);
      window.location.href = redirectUrl;  // Redirect on successful action
    } else {
      displayMessage('#responseMessage', result.error, true);
    }
  }

  // Fetch and display instruments
  async function fetchInstruments() {
    try {
      const response = await fetch('/instruments', { method: 'GET', headers: getAuthHeaders() });
      const instruments = await response.json();
      
      const tbody = document.querySelector('.manage-instruments tbody');
      tbody.innerHTML = ''; // Clear existing entries

      instruments.forEach(instrument => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${instrument.name}</td>
          <td>
            <a href="edit-instrument.html?id=${instrument._id}" class="btn">Edit</a>
            <a href="#" class="btn" onclick="deleteInstrument('${instrument._id}')">Delete</a>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error('Error fetching instruments:', error);
    }
  }

  // Fetch and display users
  async function fetchUsers() {
    try {
      const response = await fetch('/users', { method: 'GET', headers: getAuthHeaders() });
      const users = await response.json();
      
      const tbody = document.querySelector('.manage-users tbody');
      tbody.innerHTML = ''; // Clear existing entries

      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.name}</td>
          <td>
            <a href="#" class="btn">View</a>
            <a href="#" class="btn" onclick="deleteUser('${user._id}')">Delete</a>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  // Delete an instrument
  async function deleteInstrument(id) {
    if (confirm('Are you sure you want to delete this instrument?')) {
      try {
        await fetch(`/instruments/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        fetchInstruments(); // Refresh the instrument list
      } catch (error) {
        console.error('Error deleting instrument:', error);
      }
    }
  }

  // Delete a user
  async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  // Add a new instrument
  document.getElementById('addInstrumentForm')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const instrumentName = document.getElementById('instrumentName').value;

    try {
      await fetch('/instruments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ name: instrumentName }),
      });

      alert('Instrument added successfully!');
      window.location.href = 'admin.html'; // Redirect to admin page
    } catch (error) {
      console.error('Error adding instrument:', error);
    }
  });

  // Edit an existing instrument
  document.getElementById('editInstrumentForm')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const instrumentId = document.getElementById('instrumentId').value;
    const instrumentName = document.getElementById('instrumentName').value;

    try {
      await fetch(`/instruments/${instrumentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ name: instrumentName }),
      });

      alert('Instrument updated successfully!');
      window.location.href = 'admin.html'; // Redirect to admin page
    } catch (error) {
      console.error('Error updating instrument:', error);
    }
  });

  // Button interaction on the home page
  function handleExploreButton() {
    const exploreButton = document.querySelector('.btn');
    if (exploreButton) {
      exploreButton.addEventListener("click", function () {
        alert("Let's explore some instruments!");
      });
    }
  }

  // Admin panel delete confirmation
  function handleDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
  
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

  // Audio player controls
  function handleAudioPlayers() {
    const audioPlayers = document.querySelectorAll("audio");
  
    audioPlayers.forEach(function (player) {
      player.addEventListener("play", function () {
        console.log(`Audio playing: ${player.src}`);
      });

      player.addEventListener("pause", function () {
        console.log(`Audio paused: ${player.src}`);
      });
    });
  }

  // Hamburger menu toggle for mobile
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
    
    // Call fetch functions on page load
    fetchInstruments();
    fetchUsers();
    
    // Load instrument data for editing
    if (window.location.pathname === '/edit-instrument.html') {
      const urlParams = new URLSearchParams(window.location.search);
      const instrumentId = urlParams.get('id');
      document.getElementById('instrumentId').value = instrumentId; // Set the hidden input

      // Fetch instrument details
      fetch(`/instruments/${instrumentId}`, { method: 'GET', headers: getAuthHeaders() })
        .then(response => response.json())
        .then(data => {
          document.getElementById('instrumentName').value = data.name; // Populate the input field
        })
        .catch(error => console.error('Error fetching instrument:', error));
    }
  }

  // Call the init function on DOMContentLoaded
  init();
});
