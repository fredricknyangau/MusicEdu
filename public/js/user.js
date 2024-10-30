document.addEventListener('DOMContentLoaded', () => {
    const feedback = document.getElementById('feedback');
    const instrumentsContainer = document.getElementById('instruments-container');
    const profileInfo = document.getElementById('profile-info');

    // Function to check if the user is authenticated
    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/session-status');
            if (!response.ok) {
                window.location.href = 'login.html'; // Redirect if not authenticated
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            window.location.href = 'login.html'; // Redirect to login on error
        }
    };

    checkAuthStatus(); // Check authentication when the page loads

    // Fetch and display instruments
    const fetchInstruments = async () => {
        try {
            const response = await fetch('/api/instruments');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const instruments = await response.json();
            displayInstruments(instruments);
        } catch (error) {
            console.error('Error fetching instruments:', error);
            feedback.textContent = 'Failed to load instruments.';
            feedback.className = 'error-message';
        }
    };

    const displayInstruments = (instruments) => {
        instrumentsContainer.innerHTML = '';
        instruments.forEach(instrument => {
            const instrumentDiv = document.createElement('div');
            instrumentDiv.className = 'instrument';
            instrumentDiv.innerHTML = `
                <h3>${instrument.name}</h3>
                <p><strong>Origin:</strong> ${instrument.origin_country}</p>
                <p><strong>Category:</strong> ${instrument.categories.join(', ')}</p>
                <p><strong>Description:</strong> ${instrument.description}</p>
                <img src="${instrument.image_url}" alt="${instrument.name}" />
                <video controls>
                    <source src="${instrument.video_url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            instrumentsContainer.appendChild(instrumentDiv);
        });
    };

    // Fetch and display user profile information
    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/user-profile'); // Adjust this endpoint to get user data
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const userProfile = await response.json();
            displayUserProfile(userProfile);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            feedback.textContent = 'Failed to load profile information.';
            feedback.className = 'error-message';
        }
    };

    const displayUserProfile = (profile) => {
        profileInfo.innerHTML = `
            <p><strong>Name:</strong> ${profile.name}</p>
            <p><strong>Email:</strong> ${profile.email}</p>
            <p><strong>Joined:</strong> ${new Date(profile.createdAt).toLocaleDateString()}</p>
        `;
    };

    // Logout functionality
    document.getElementById('logout').addEventListener('click', async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = 'login.html'; // Redirect to login page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    });

    fetchInstruments(); // Fetch and display instruments
    fetchUserProfile(); // Fetch and display user profile
});
