document.addEventListener('DOMContentLoaded', () => {
    const instrumentsContainer = document.getElementById('instruments-container');
    const feedback = document.getElementById('feedback');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeModal = document.getElementById('closeModal');

    // Function to show feedback messages
    const displayFeedback = (message, isSuccess = true) => {
        feedback.textContent = message;
        feedback.className = isSuccess ? 'success-message' : 'error-message';
        feedback.style.display = 'block';
        setTimeout(() => { feedback.style.display = 'none'; }, 3000);
    };

    // Function to check authentication
    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, redirecting to login.');
            window.location.href = 'login.html';
            return;
        }
        try {
            const response = await fetch('/api/session-status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                console.log('User authenticated');
            } else {
                console.log('Auth check failed, redirecting to login.');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error during auth check:', error);
            window.location.href = 'login.html';
        }
    };

    // Fetch and display instruments
    const fetchInstruments = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/instruments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const instruments = await response.json();
                console.log('Fetched instruments:', instruments);
                displayInstruments(instruments);
            } else {
                console.error('Failed to load instruments:', response.statusText);
                displayFeedback('Failed to load instruments.', false);
            }
        } catch (error) {
            console.error('Error fetching instruments:', error);
            displayFeedback('Error fetching instruments. Please try again.', false);
        }
    };

    // Display instruments in UI
    const displayInstruments = (instruments) => {
        if (instruments.length === 0) {
            displayFeedback('No instruments found.');
            return;
        }
        instrumentsContainer.innerHTML = '';
        instruments.forEach(instrument => {
            const instrumentDiv = document.createElement('div');
            instrumentDiv.className = 'instrument-card';
            instrumentDiv.innerHTML = `
                <h2>${instrument.name}</h2>
                <p><strong>Origin:</strong> ${instrument.origin_country}</p>
                <p><strong>Categories:</strong> ${instrument.categories.join(', ') || 'None'}</p>
                <p><strong>Description:</strong> ${instrument.description}</p>
                <img src="${instrument.image_url}" alt="${instrument.name} image" onerror="this.onerror=null; this.src='path/to/default-image.jpg';" />
                <video controls>
                    <source src="${instrument.video_url}" type="video/mp4">
                    Your browser does not support the video tag.
                    <p>Video not available</p>
                </video>
                <button class="view-button" data-id="${instrument._id}">View Details</button>
            `;
            instrumentsContainer.appendChild(instrumentDiv);
        });

        // Add event listeners to view buttons
        const viewButtons = document.querySelectorAll('.view-button');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const instrumentId = button.getAttribute('data-id');
                openFeedbackModal(instrumentId);
            });
        });
    };

    // Open feedback modal for detailed view
    const openFeedbackModal = async (instrumentId) => {
        try {
            const response = await fetch(`/api/instruments/${instrumentId}`);
            const instrument = await response.json();

            document.getElementById('instrumentNameModal').innerText = instrument.name;
            document.getElementById('instrumentImageModal').src = instrument.image_url;
            document.getElementById('instrumentVideoModal').src = instrument.video_url;
            document.getElementById('instrumentDescriptionModal').innerText = instrument.description;

            feedbackModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching instrument details:', error);
        }
    };

    // Close modal
    closeModal.onclick = () => {
        feedbackModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === feedbackModal) {
            feedbackModal.style.display = 'none';
        }
    };

    // Logout function
    document.getElementById('logout').addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    // Run authentication check and load instruments on page load
    checkAuthStatus();
    fetchInstruments();
});
