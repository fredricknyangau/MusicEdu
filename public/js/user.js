document.addEventListener('DOMContentLoaded', async () => {
    const instrumentsContainer = document.getElementById('instruments-container');

    // Fetch instruments data
    try {
        const response = await fetch('/api/instruments');
        const instruments = await response.json();

        instruments.forEach(instrument => {
            const card = document.createElement('div');
            card.classList.add('instrument-card');

            card.innerHTML = `
                <img src="${instrument.image_url}" alt="${instrument.name}">
                <h2>${instrument.name}</h2>
                <button onclick="viewDetails('${instrument._id}')">View Details</button>
            `;

            instrumentsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching instruments:', error);
    }
});

// Function to view instrument details in a modal
function viewDetails(id) {
    const modal = document.getElementById('feedback-modal');
    const instrumentNameModal = document.getElementById('instrumentNameModal');
    const instrumentImageModal = document.getElementById('instrumentImageModal');
    const instrumentVideoModal = document.getElementById('instrumentVideoModal');
    const instrumentDescriptionModal = document.getElementById('instrumentDescriptionModal');
    const feedbackListModal = document.getElementById('feedbackListModal');

    fetch(`/api/instruments/${id}`)
        .then(response => response.json())
        .then(instrument => {
            instrumentNameModal.textContent = instrument.name;
            instrumentImageModal.src = instrument.image_url;
            instrumentVideoModal.src = instrument.video_url;
            instrumentDescriptionModal.textContent = instrument.description;

            // Clear existing feedback
            feedbackListModal.innerHTML = '';

            // Fetch feedback for the instrument
            fetch(`/api/instruments/${id}/feedback`)
                .then(feedbackResponse => feedbackResponse.json())
                .then(feedbackList => {
                    feedbackList.forEach(feedback => {
                        const feedbackItem = document.createElement('p');
                        feedbackItem.textContent = feedback;
                        feedbackListModal.appendChild(feedbackItem);
                    });
                });

            // Show the modal
            modal.style.display = 'block';
        })
        .catch(error => console.error('Error fetching instrument details:', error));
}

// Close modal
document.getElementById('closeModal').onclick = function() {
    document.getElementById('feedback-modal').style.display = 'none';
};

// Handle feedback form submission
document.getElementById('feedbackForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const feedback = event.target.feedback.value;

    try {
        const response = await fetch(`/api/instruments/${instrumentId}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ feedback }),
        });

        if (response.ok) {
            alert('Feedback submitted!');
            event.target.reset();
            document.getElementById('feedback-modal').style.display = 'none'; // Close modal after feedback submission
        } else {
            alert('Failed to submit feedback');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
    }
});
