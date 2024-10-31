const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Fetch instrument details
fetch(`/api/instruments/${id}`)
    .then(response => response.json())
    .then(instrument => {
        const details = document.getElementById('instrument-details');
        details.innerHTML = `
            <h2>${instrument.name}</h2>
            <img src="${instrument.image_url}" alt="${instrument.name}">
            <video src="${instrument.video_url}" controls></video>
            <p>${instrument.history}</p>
        `;
    })
    .catch(error => console.error('Error fetching instrument details:', error));

// Handle feedback submission
document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const feedbackContent = document.getElementById('feedback-content').value;

    fetch(`/api/feedback/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: feedbackContent })
    })
    .then(response => response.json())
    .then(feedback => {
        alert('Feedback submitted!');
        // Optionally, reload the feedback list
    })
    .catch(error => console.error('Error submitting feedback:', error));
});
