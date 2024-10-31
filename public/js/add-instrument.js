document.getElementById('add-instrument-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const newInstrument = {
        name: document.getElementById('name').value,
        group: document.getElementById('group').value,
        region: document.getElementById('region').value,
        image_url: document.getElementById('image_url').value,
        video_url: document.getElementById('video_url').value,
        history: document.getElementById('history').value,
    };

    fetch('/api/instruments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newInstrument)
    })
    .then(response => response.json())
    .then(instrument => {
        alert('Instrument added successfully!');
        // Optionally, redirect to instruments list
        window.location.href = 'instruments.html';
    })
    .catch(error => console.error('Error adding instrument:', error));
});
