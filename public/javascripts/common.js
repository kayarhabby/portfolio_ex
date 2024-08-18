/**
 * populateTable - This function dynamically populates the table rows based on the data provided.
 * @param {Array} data - The data to populate the table with.
 * @param {Array} columns - Configuration of columns including label and corresponding field in the data.
 * @param {String} tableBodyId - The ID of the table body where rows will be inserted.
 */
function populateTable(data, columns, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = ''; // Clear any existing rows

    data.forEach(item => {
        let row = '<tr>';
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
 * setupTable - This function sets up the table headers dynamically based on the columns provided.
 * @param {Array} columns - Configuration of columns including label and corresponding field in the data.
 * @param {String} tableHeaderId - The ID of the table header where column headers will be inserted.
 */
function setupTable(columns, tableHeaderId) {
    const tableHeader = document.getElementById(tableHeaderId);
    let headerRow = '<tr>';
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
