

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
    console.log("Table Body Element:", tableBody); // Débogage
    if (!tableBody) {
        console.error(`Element with ID ${tableBodyId} not found.`);
        return;
    }
    tableBody.innerHTML = ''; // Clear any existing rows

    data.forEach(item => {
        let row = '<tr>';
        // Ajouter la cellule ID
        row += `<td>${item.id || 'N/A'}</td>`;
        // Ajouter les autres cellules basées sur les colonnes
        columns.forEach(col => {
            row += `<td>${item[col.field] || 'N/A'}</td>`; // Fill row with data or 'N/A' if field is missing
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
    console.log("Table Header Element:", tableHeader); // Débogage
    if (!tableHeader) {
        console.error(`Element with ID ${tableHeaderId} not found.`);
        return;
    }
    let headerRow = '<tr>';
    // Ajouter l'en-tête ID
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
    console.log("Edit item with ID:", id);
    // Implement the logic to edit an item (e.g., opening a modal with the item's details)
}

/**
 * deleteItem - Handles the delete action for a specific item.
 * @param {Number} id - The ID of the item to be deleted.
 */
function deleteItem(id) {
    console.log("Delete item with ID:", id);
    // Implement the logic to delete an item (e.g., sending a delete request to the server)
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
}

/**
 * loadBootcamp - Sets up and loads the bootcamp table.
 */
function loadBootcamp() {
    const columns = [
        { label: 'Date', field: 'Date' },
        { label: 'Title', field: 'title' },
        { label: 'Description', field: 'description' },
        { label: 'Image', field: 'image' },
        { label: 'Certification', field: 'certification' }
    ];

    setupTable(columns, "tableHeader");
    fetchData('/api/bootcamps', function(data) {
        populateTable(data, columns, "tableBody");
    });
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
            }
        });
    });

    // Load the projects by default on page load
    loadProjects();
});