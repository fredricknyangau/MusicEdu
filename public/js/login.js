document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Attempting to log in with:', { email, password }); // Log the credentials

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json(); // Parse the JSON response

        console.log('Response:', response);
        console.log('Data:', data);
        console.log('Status:', response.status);

        if (response.ok) {
            localStorage.setItem('token', data.token); // Store token
            window.location.href = 'profile.html'; // Redirect to profile page
        } else if (response.status === 401) {
            document.getElementById('errorMessage').textContent = 'Unauthorized: Invalid credentials provided.';
        } else {
            document.getElementById('errorMessage').textContent = data.message || 'An error occurred. Please try again.';
        }
    } catch (error) {
        console.error('Error logging in:', error);
        document.getElementById('errorMessage').textContent = 'Failed to connect to the server.';
    }
});
