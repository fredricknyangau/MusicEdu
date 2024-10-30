document.getElementById('instrument-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    try {
        const response = await fetch('http://localhost:3000/api/instruments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) alert('Instrument added successfully');
        else alert('Error adding instrument');
    } catch (error) {
        console.error('Error:', error);
    }
});
