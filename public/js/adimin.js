document.addEventListener('DOMContentLoaded', () => {
    const feedback = document.getElementById('feedback');
    const instrumentsContainer = document.getElementById('instruments-container');

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
            const instruments = await response.json();
            displayInstruments(instruments);
        } catch (error) {
            console.error('Error fetching instruments:', error);
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
                <p><strong>Category:</strong> ${instrument.category}</p>
                <p><strong>Description:</strong> ${instrument.description}</p>
                <img src="${instrument.image}" alt="${instrument.name}" />
                <video controls>
                    <source src="${instrument.video}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <button class="edit-btn" data-id="${instrument._id}">Edit</button>
            `;
            instrumentsContainer.appendChild(instrumentDiv);
        });
    };

    // Handle form submission
    document.getElementById('instrument-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(event.target);

        try {
            const response = await fetch('/api/instruments', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                feedback.textContent = 'Instrument added successfully!';
                feedback.className = 'success-message';
                feedback.style.display = 'block'; // Show feedback
                event.target.reset(); // Clear the form
                fetchInstruments(); // Refresh the instrument list
            } else {
                feedback.textContent = 'Error adding instrument';
                feedback.className = 'error-message';
                feedback.style.display = 'block'; // Show feedback
                const errorText = await response.text();
                console.error('Server response:', errorText);
            }
        } catch (error) {
            console.error('Error:', error);
            feedback.textContent = 'An error occurred. Please try again.';
            feedback.className = 'error-message';
            feedback.style.display = 'block'; // Show feedback
        }
    });

    // Edit functionality
    instrumentsContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const instrumentId = event.target.getAttribute('data-id');
            const response = await fetch(`/api/instruments/${instrumentId}`);
            const instrument = await response.json();
            populateFormWithInstrumentData(instrument);
        }
    });

    const populateFormWithInstrumentData = (instrument) => {
        document.getElementById('name').value = instrument.name;
        document.getElementById('origin_country').value = instrument.origin_country;
        document.getElementById('category').value = instrument.category;
        document.getElementById('description').value = instrument.description;
        // Optionally handle image and video previews
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

    fetchInstruments(); // Initial fetch of instruments
});
