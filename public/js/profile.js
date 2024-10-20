// Function to get authentication headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
}

// Fetch user profile details
async function fetchUserProfile() {
    try {
        const response = await fetch('/auth/profile', {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
        }
        const user = await response.json();

        // Populate the form fields with user data
        document.getElementById('name').value = user.name;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        document.getElementById('responseMessage').textContent = 'Error loading profile details.';
    }
}

// Function to handle form submission and update profile
document.getElementById('profileForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ name, username, email, role }),
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('responseMessage').textContent = 'Profile updated successfully!';
        } else {
            document.getElementById('responseMessage').textContent = result.message;
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        document.getElementById('responseMessage').textContent = 'Error updating profile.';
    }
});

// Load the user profile on page load
document.addEventListener('DOMContentLoaded', fetchUserProfile);
