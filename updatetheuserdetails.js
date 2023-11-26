async function addUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (name && email && phone) {
        const user = { name, email, phone };

        try {
            // Make a POST request to crudcrud.com
            const response = await axios.post('https://crudcrud.com/api/48224b75f11442a8a4142cac006d855b/appointdata', user);

            // Display user details on the page
            displayUser(response.data);
        } catch (error) {
            console.error('Error adding user:', error);
        }

        // Clear input fields after adding user
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
    }
}

function displayUser(user) {
    const userEntry = document.createElement('div');
    userEntry.className = 'userEntry';
    userEntry.id = user._id; // Add the user ID to the entry
    userEntry.innerHTML = `
        <div>${user.name}, ${user.email}, ${user.phone}</div>
        <div>
            <span class="editBtn" onclick="editUser(this)">Edit</span>
            <span class="deleteBtn" onclick="deleteUser(this, '${user._id}')">Delete</span>
        </div>
    `;

    document.getElementById('userList').appendChild(userEntry);
}

async function deleteUser(button, userId) {
    const userEntry = button.parentElement.parentElement;

    try {
        // Make a DELETE request to crudcrud.com
        await axios.delete(`https://crudcrud.com/api/48224b75f11442a8a4142cac006d855b/appointdata/${userId}`);

        // Remove the entry from the list
        userEntry.remove();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

function editUser(button) {
    const userEntry = button.parentElement.parentElement;
    const userDetails = userEntry.firstChild;

    // Extracting name, email, phone, and user ID from the displayed text
    const [name, email, phone] = userDetails.textContent.split(', ');

    // Populating the form with existing values
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;

    // Add the user ID as a data attribute to the form
    document.getElementById('userForm').dataset.userId = userEntry.id;

    // Remove the entry from the list
    userEntry.remove();
}

async function addOrUpdateUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (name && email && phone) {
        const user = { name, email, phone };

        try {
            const userId = document.getElementById('userForm').dataset.userId;

            if (userId) {
                // If editing, make a PUT request to crudcrud.com
                await axios.put(`https://crudcrud.com/api/48224b75f11442a8a4142cac006d855b/appointdata/${userId}`, user);
                document.getElementById('userForm').removeAttribute('data-user-id'); // Reset editing user ID
            } else {
                // If adding, make a POST request to crudcrud.com
                const response = await axios.post('https://crudcrud.com/api/48224b75f11442a8a4142cac006d855b/appointdata', user);

                // Display user details on the page
                displayUser(response.data);
            }

            // Clear input fields after adding/updating user
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
        } catch (error) {
            console.error('Error adding/updating user:', error);
        }
    }
}

// Load existing users from the cloud on page load
window.onload = async function () {
    try {
        const response = await axios.get('https://crudcrud.com/api/48224b75f11442a8a4142cac006d855b/appointdata');
        const users = response.data;
        users.forEach(displayUser);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
