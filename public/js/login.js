document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Basic validation for empty fields
  if (!email || !password) {
    document.getElementById('responseMessage').innerText = 'Please enter both email and password.';
    return;
  }

  const loginData = { email, password };

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    document.getElementById('responseMessage').innerText = result.message;

    if (response.ok) {
      // Store the token in local storage
      localStorage.setItem('token', result.token); // Assuming your backend returns the token

      // Fetch the user profile
      const token = localStorage.getItem('token');
      const profileResponse = await fetch('/auth/profile', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`, // Include the token in the request
          },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('User Profile:', profileData); // You can use this data to display on the page
        
        // Redirect based on user role or update UI with profile information
        const userRole = profileData.role; // Assuming this is how you get the role from the profile
        switch (userRole) {
          case 'student':
            window.location.href = 'user.html';
            break;
          case 'admin':
            window.location.href = 'admin.html';
            break;
          default:
            window.location.href = 'index.html'; // Fallback page
        }
      } else {
        document.getElementById('responseMessage').innerText = 'Failed to fetch profile.';
      }
    } else {
      // Handle specific errors based on the status code
      if (response.status === 400) {
        document.getElementById('responseMessage').innerText = 'Invalid email or password.';
      } else {
        document.getElementById('responseMessage').innerText = 'An unexpected error occurred. Please try again.';
      }
    }
  } catch (error) {
    document.getElementById('responseMessage').innerText = 'Error occurred during login. Please check your network connection.';
  }
});
