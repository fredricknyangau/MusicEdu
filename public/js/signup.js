document.getElementById('signUpForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
  
    if (password !== confirmPassword) {
      document.getElementById('responseMessage').innerText = 'Passwords do not match!';
      return;
    }
  
    const userData = {
      name,
      username,
      email,
      password,
      role,
    };
  
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
      document.getElementById('responseMessage').innerText = result.message;
  
      if (response.ok) {
        // Redirect to login page
        window.location.href = 'login.html';
      }
    } catch (error) {
      document.getElementById('responseMessage').innerText = 'Error occurred during registration.';
    }
  });
  