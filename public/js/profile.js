document.addEventListener('DOMContentLoaded', () => {
    const feedback = document.getElementById('feedback');

    // Function to check if the user is authenticated (optional)
    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/session-status'); // Using relative path
            if (!response.ok) {
                window.location.href = 'login.html'; // Redirect if not authenticated
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            window.location.href = 'login.html'; // Redirect to login on error
        }
    };

    checkAuthStatus(); // Check authentication when the page loads

    // Handle form submission
    document.getElementById('instrument-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target); // Collect form data including files

        try {
            const response = await fetch('/api/instruments', { // Using relative path
                method: 'POST',
                body: formData // Send FormData directly
            });
            if (response.ok) {
                feedback.textContent = 'Instrument added successfully!';
                feedback.className = 'success-message';
                event.target.reset(); // Clear the form
            } else {
                feedback.textContent = 'Error adding instrument';
                feedback.className = 'error-message';
                const errorText = await response.text(); // Capture error message from server
                console.error('Server response:', errorText);
            }
        } catch (error) {
            console.error('Error:', error);
            feedback.textContent = 'An error occurred. Please try again.';
            feedback.className = 'error-message';
        }
    });

    // Logout functionality
    document.getElementById('logout').addEventListener('click', async () => {
        try {
            await fetch('/api/logout', { method: 'POST' }); // Using relative path
            window.location.href = 'login.html'; // Redirect to login page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    });
});
