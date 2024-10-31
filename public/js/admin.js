document.addEventListener('DOMContentLoaded', () => {
    const feedback = document.getElementById('feedback');
    const instrumentsContainer = document.getElementById('instruments-container');
    const instrumentForm = document.getElementById('instrument-form');
    let editMode = false;
    let editInstrumentId = null;

    // Function to show feedback messages
    const displayFeedback = (message, isSuccess = true) => {
        feedback.textContent = message;
        feedback.className = isSuccess ? 'success-message' : 'error-message';
        feedback.style.display = 'block';
        setTimeout(() => { feedback.style.display = 'none'; }, 3000);
    };

    // Updated checkAuthStatus to include Authorization header
    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token missing. Redirecting to login.');
            window.location.href = 'login.html';
            return;
        }
        try {
            const response = await fetch('/api/session-status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                console.log('Authentication successful');
            } else {
                console.log('Authentication failed. Redirecting to login.');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            window.location.href = 'login.html';
        }
    };
    

    // Fetch and display instruments
    const fetchInstruments = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/instruments', {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the request
                }
            });
            if (response.ok) {
                const instruments = await response.json();
                displayInstruments(instruments);
            } else {
                displayFeedback('Failed to load instruments.', false);
            }
        } catch (error) {
            console.error('Error fetching instruments:', error);
        }
    };

    // Function to display instruments in the UI
    const displayInstruments = (instruments) => {
        instrumentsContainer.innerHTML = '';
        instruments.forEach(instrument => {
            const instrumentDiv = document.createElement('div');
            instrumentDiv.className = 'instrument';
            instrumentDiv.innerHTML = `
                <h3>${instrument.name}</h3>
                <p><strong>Origin:</strong> ${instrument.origin_country}</p>
                <p><strong>Category:</strong> ${instrument.category}</p>
                <p><strong>Description:</strong> ${instrument.description}</p>
                <img src="${instrument.image_url}" alt="${instrument.name}" />
                <video controls>
                    <source src="${instrument.video_url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <button class="edit-btn" data-id="${instrument._id}">Edit</button>
            `;
            instrumentsContainer.appendChild(instrumentDiv);
        });
    };

    // Form submission handling for adding/editing instruments
    instrumentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const token = localStorage.getItem('token');

        try {
            const url = editMode ? `/api/instruments/${editInstrumentId}` : '/api/instruments';
            const method = editMode ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                displayFeedback('Instrument saved successfully!');
                instrumentForm.reset();
                fetchInstruments();
                editMode = false;
                editInstrumentId = null;
            } else {
                displayFeedback('Error saving instrument', false);
                console.error('Server response:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
            displayFeedback('An error occurred. Please try again.', false);
        }
    });

    // Logout function
    document.getElementById('logout').addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.removeItem('token'); // Remove token from storage
            window.location.href = 'login.html'; // Redirect to login page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    });

    // Run authentication check and load instruments on page load
    checkAuthStatus();
    fetchInstruments();
});
