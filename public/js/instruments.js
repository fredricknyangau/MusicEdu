// Fetch all instruments and display them
fetch('/api/instruments')
    .then(response => response.json())
    .then(data => {
        const instrumentList = document.getElementById('instrument-list');
        data.forEach(instrument => {
            const item = document.createElement('li');
            item.innerHTML = `
                <h3>${instrument.name}</h3>
                <img src="${instrument.image_url}" alt="${instrument.name}">
                <p>${instrument.group} - <a href="instrument.html?id=${instrument._id}">View Details</a></p>
            `;
            instrumentList.appendChild(item);
        });
    })
    .catch(error => console.error('Error fetching instruments:', error));
