document.addEventListener("DOMContentLoaded", function () {
    fetchInstruments();
  });
  
  // Fetch and display instruments
  async function fetchInstruments() {
    try {
      const response = await fetch('/instruments', { method: 'GET', headers: getAuthHeaders() });
      const instruments = await response.json();
  
      const tbody = document.querySelector('.manage-instruments tbody');
      tbody.innerHTML = ''; // Clear existing entries
  
      instruments.forEach(instrument => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${instrument.name}</td>
          <td>
            <a href="edit-instrument.html?id=${instrument._id}" class="btn">Edit</a>
            <a href="#" class="btn" onclick="deleteInstrument('${instrument._id}')">Delete</a>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error('Error fetching instruments:', error);
    }
  }
  
  // Delete an instrument
  async function deleteInstrument(id) {
    if (confirm('Are you sure you want to delete this instrument?')) {
      try {
        await fetch(`/instruments/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        fetchInstruments(); // Refresh the instrument list
      } catch (error) {
        console.error('Error deleting instrument:', error);
      }
    }
  }
  
  // Add a new instrument
  document.getElementById('addInstrumentForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const instrumentName = document.getElementById('instrumentName').value;
  
    try {
      await fetch('/instruments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ name: instrumentName }),
      });
  
      alert('Instrument added successfully!');
      window.location.href = 'admin.html'; // Redirect to admin page
    } catch (error) {
      console.error('Error adding instrument:', error);
    }
  });
  
  // Edit an existing instrument
  document.getElementById('editInstrumentForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const instrumentId = document.getElementById('instrumentId').value;
    const instrumentName = document.getElementById('instrumentName').value;
  
    try {
      await fetch(`/instruments/${instrumentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ name: instrumentName }),
      });
  
      alert('Instrument updated successfully!');
      window.location.href = 'admin.html'; // Redirect to admin page
    } catch (error) {
      console.error('Error updating instrument:', error);
    }
  });
  