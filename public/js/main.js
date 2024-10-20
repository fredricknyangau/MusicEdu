document.addEventListener("DOMContentLoaded", function () {
    handleHamburgerMenu();
    handleExploreButton();
    handleDeleteButtons();
    handleAudioPlayers();
    
    // Load instrument data for editing
    if (window.location.pathname === '/edit-instrument.html') {
      const urlParams = new URLSearchParams(window.location.search);
      const instrumentId = urlParams.get('id');
      document.getElementById('instrumentId').value = instrumentId; // Set the hidden input
  
      // Fetch instrument details
      fetch(`/instruments/${instrumentId}`, { method: 'GET', headers: getAuthHeaders() })
        .then(response => response.json())
        .then(data => {
          document.getElementById('instrumentName').value = data.name; // Populate the input field
        })
        .catch(error => console.error('Error fetching instrument:', error));
    }
  });
  