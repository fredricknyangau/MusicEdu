document.addEventListener('DOMContentLoaded', async () => {
    const feedback = document.getElementById('feedback');
    const instrumentsContainer = document.getElementById('instruments-container');

    // Check if user is authenticated
    fetch('http://localhost:3000/api/session-status')
        .then(response => {
            if (!response.ok) {
                window.location.href = 'login.html'; // Redirect if not authenticated
            }
        })
        .catch(error => console.error('Error:', error));

    // Fetch instruments from the API
    try {
        const response = await fetch('http://localhost:3000/api/instruments');
        if (response.ok) {
            const instruments = await response.json();
            displayInstruments(instruments);
        } else {
            feedback.textContent = 'Failed to load instruments.';
            feedback.className = 'error-message';
        }
    } catch (error) {
        console.error('Error:', error);
        feedback.textContent = 'An error occurred while fetching instruments.';
        feedback.className = 'error-message';
    }

    function displayInstruments(instruments) {
        if (instruments.length === 0) {
            instrumentsContainer.innerHTML = '<p>No instruments found.</p>';
            return;
        }

        instruments.forEach(instrument => {
            const instrumentDiv = document.createElement('div');
            instrumentDiv.className = 'instrument';
            instrumentDiv.innerHTML = `
                <h3>${instrument.name}</h3>
                <img src="${instrument.image_url}" alt="${instrument.name}" />
                <p>${instrument.description}</p>
                <video controls>
                    <source src="${instrument.video_url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <p>Origin: ${instrument.origin_country}</p>
                <p>${instrument.historical_background}</p>
            `;
            instrumentsContainer.appendChild(instrumentDiv);
        });
    }

    // Logout functionality
    document.getElementById('logout').addEventListener('click', async () => {
        await fetch('http://localhost:3000/api/logout', { method: 'POST' });
        window.location.href = 'login.html'; // Redirect to login page
    });
});
