document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();
  });
  
  // Fetch and display users
  async function fetchUsers() {
    try {
      const response = await fetch('/users', { method: 'GET', headers: getAuthHeaders() });
      const users = await response.json();
  
      const tbody = document.querySelector('.manage-users tbody');
      tbody.innerHTML = ''; // Clear existing entries
  
      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.name}</td>
          <td>
            <a href="#" class="btn">View</a>
            <a href="#" class="btn" onclick="deleteUser('${user._id}')">Delete</a>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
  // Delete a user
  async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }
  