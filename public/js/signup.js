document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById('signUpForm');
    
    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, email, password, role }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Registration successful:', data);
            // Redirect to login page after successful registration
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error registering:', error);
            document.getElementById('responseMessage').textContent = 'Error registering. Please try again.';
        }
    });
});
