// Format date function remains unchanged
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

/**
 * fetchData - Fetches data from the server using the provided API endpoint.
 * @param {String} apiEndpoint - The API endpoint to fetch data from.
 * @param {Function} callback - A callback function that processes the data after fetching.
 */
function fetchData(apiEndpoint, callback) {
    fetch(apiEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            callback(data); // Call the provided callback function with the fetched data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

/**
 * populateTable - Dynamically populates the table rows based on the data provided.
 * @param {Array} data - The data to populate the table with.
 * @param {Array} columns - Configuration of columns including label and corresponding field in the data.
 * @param {String} tableBodyId - The ID of the table body where rows will be inserted.
 */
function populateTable(data, columns, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) {
        console.error(`Element with ID ${tableBodyId} not found.`);
        return;
    }
    tableBody.innerHTML = ''; // Clear any existing rows

    data.forEach(item => {
        let row = '<tr>';
        // Add ID cell
        row += `<td>${item.id || 'N/A'}</td>`;
        // Add other cells based on columns
        columns.forEach(col => {
            let cellData = item[col.field] || 'N/A';
            if (col.field === 'date' && cellData !== 'N/A') {
                cellData = formatDate(cellData); // Format date field
            }
            row += `<td>${cellData}</td>`; // Fill row with data or 'N/A' if field is missing
        });
        row += `
            <td>
                <button class="btn btn-primary btn-sm" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        row += '</tr>';
        tableBody.innerHTML += row; // Add the constructed row to the table body
    });
}

/**
 * setupTable - Sets up the table headers dynamically based on the columns provided.
 * @param {Array} columns - Configuration of columns including label and corresponding field in the data.
 * @param {String} tableHeaderId - The ID of the table header where column headers will be inserted.
 */
function setupTable(columns, tableHeaderId) {
    const tableHeader = document.getElementById(tableHeaderId);
    if (!tableHeader) {
        console.error(`Element with ID ${tableHeaderId} not found.`);
        return;
    }
    let headerRow = '<tr>';
    // Add ID header
    headerRow += '<th>ID</th>';
    columns.forEach(col => {
        headerRow += `<th>${col.label}</th>`; // Add header columns dynamically
    });
    headerRow += '<th>Actions</th></tr>'; // Add an 'Actions' column for Edit/Delete buttons
    tableHeader.innerHTML = headerRow; // Set the constructed header row to the table header
}

/**
 * editItem - Handles the edit action for a specific item.
 * @param {Number} id - The ID of the item to be edited.
 */
function editItem(id) {
    window.location.href = `/form?action=edit&id=${id}&table=${window.currentTable}`;
}

/**
 * deleteItem - Handles the delete action for a specific item.
 * @param {Number} id - The ID of the item to be deleted.
 */
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/api/${window.currentTable}/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error deleting item: ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                // Reload the table data after deletion
                reloadTable();
            })
            .catch(error => console.error('Error:', error));
    }
}

/**
 * reloadTable - Reloads the table data based on the current table name.
 */
function reloadTable() {
    if (window.currentTable === 'projects') {
        loadProjects();
    } else if (window.currentTable === 'skills') {
        loadSkills();
    } else if (window.currentTable === 'bootcamps') {
        loadBootcamp();
    } else if (window.currentTable === 'users') {
        loadUsers();
    }
}

/**
 * loadProjects - Sets up and loads the projects table.
 */
function loadProjects() {
    const columns = [
        { label: 'Title', field: 'title' },
        { label: 'Link', field: 'link' },
        { label: 'Image', field: 'image' },
        { label: 'Category', field: 'category' }
    ];

    setupTable(columns, "tableHeader");
    fetchData('/api/projects', function(data) {
        populateTable(data, columns, "tableBody");
    });
    window.currentTable = 'projects';
}

/**
 * loadSkills - Sets up and loads the skills table.
 */
function loadSkills() {
    const columns = [
        { label: 'Title', field: 'title' },
        { label: 'Image', field: 'image' },
        { label: 'Category', field: 'category' }
    ];

    setupTable(columns, "tableHeader");
    fetchData('/api/skills', function(data) {
        populateTable(data, columns, "tableBody");
    });
    window.currentTable = 'skills';
}

/**
 * loadBootcamp - Sets up and loads the bootcamp table.
 */
function loadBootcamp() {
    const columns = [
        { label: 'Date', field: 'date' },
        { label: 'Title', field: 'title' },
        { label: 'Description', field: 'description' },
        { label: 'Image', field: 'image' },
        { label: 'Certification', field: 'certification' }
    ];

    setupTable(columns, "tableHeader");
    fetchData('/api/bootcamps', function(data) {
        populateTable(data, columns, "tableBody");
    });
    window.currentTable = 'bootcamps';
}

/**
 * loadUsers - Sets up and loads the users table.
 */
function loadUsers() {
    const columns = [
        { label: 'Email', field: 'email' },
        { label: 'Password', field: 'password' }
    ];

    setupTable(columns, "tableHeader");
    fetchData('/api/users', function(data) {
        populateTable(data, columns, "tableBody");
    });
    window.currentTable = 'users';
}

// Main event listener to handle navigation and load the correct data
document.addEventListener("DOMContentLoaded", function() {
    // Set up event listeners for the navigation links
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent the default anchor behavior
            const category = this.getAttribute('data-category');
            if (category === 'projects') {
                loadProjects();
            } else if (category === 'skills') {
                loadSkills();
            } else if (category === 'bootcamps') {
                loadBootcamp();
            } else if (category === 'users') {
                loadUsers();
            }
        });
    });

    // Add event listener for the 'Add new' button
    document.getElementById('addNew').addEventListener('click', function() {
        window.location.href = `/form?action=add&table=${window.currentTable}`;
    });

    // Load the projects by default on page load
    loadProjects();
});
