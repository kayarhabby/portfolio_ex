document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action'); // 'add' or 'edit'
    const table = urlParams.get('table');   // 'projects', 'skills', 'bootcamps', 'users'
    const id = urlParams.get('id');         // Only for 'edit'

    const formTitle = document.getElementById('formTitle');
    const formFields = document.getElementById('formFields');

    let fields = [];
    switch (table) {
        case 'projects':
            fields = [
                { label: 'Title', name: 'title', type: 'text' },
                { label: 'Link', name: 'link', type: 'text' },
                { label: 'Image', name: 'image', type: 'text' },
                { label: 'Category', name: 'category', type: 'text' }
            ];
            break;
        case 'skills':
            fields = [
                { label: 'Title', name: 'title', type: 'text' },
                { label: 'Image', name: 'image', type: 'text' },
                { label: 'Category', name: 'category', type: 'text' }
            ];
            break;
        case 'bootcamps':
            fields = [
                { label: 'Date', name: 'date', type: 'date' },
                { label: 'Title', name: 'title', type: 'text' },
                { label: 'Description', name: 'description', type: 'text' },
                { label: 'Image', name: 'image', type: 'text' },
                { label: 'Certification', name: 'certification', type: 'text' }
            ];
            break;
        case 'users':
            fields = [
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Password', name: 'password', type: 'password' }
            ];
            break;
        default:
            console.error('Unknown table:', table);
            return;
    }

    // Set form title and populate fields based on action and table
    if (action === 'edit' && id) {
        formTitle.textContent = 'Edit Item';
        fetch(`/api/${table}/${id}`)
            .then(response => response.json())
            .then(data => {
                fields.forEach(field => {
                    const input = `<div class="mb-3">
                        <label for="${field.name}" class="form-label">${field.label}</label>
                        <input type="${field.type}" class="form-control" id="${field.name}" name="${field.name}" value="${data[field.name] || ''}" required>
                    </div>`;
                    formFields.insertAdjacentHTML('beforeend', input);
                });
                formFields.insertAdjacentHTML('beforeend', `<input type="hidden" name="id" value="${id}">`);
            })
            .catch(error => console.error('Error fetching data for edit:', error));
    } else {
        formTitle.textContent = 'Add Item';
        fields.forEach(field => {
            const input = `<div class="mb-3">
                <label for="${field.name}" class="form-label">${field.label}</label>
                <input type="${field.type}" class="form-control" id="${field.name}" name="${field.name}" required>
            </div>`;
            formFields.insertAdjacentHTML('beforeend', input);
        });
    }

    // Handle form submission
    document.getElementById('itemForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        const method = action === 'edit' ? 'PUT' : 'POST';
        fetch(`/api/${table}${action === 'edit' ? '/' + data.id : ''}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(() => {
                window.location.href = 'dashboard'; // Redirect back to dashboard
            })
            .catch(error => console.error('Error:', error));
    });
});
