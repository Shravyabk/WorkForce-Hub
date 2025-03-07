// Function to fetch departments from backend and populate table
function fetchDepartments() {
    fetch('/departments')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('departmentsTable').getElementsByTagName('tbody')[0];
            table.innerHTML = ''; // Clear existing rows

            data.forEach(department => {
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${department.deptId}</td>
                    <td>${department.deptName}</td>
                    <td><button onclick="openUpdateDepartmentModal('${department.id}', '${department.deptId}', '${department.deptName}')">Update</button></td>
                `;
            });
        })
        .catch(error => {
            console.error('Error fetching departments:', error);
        });
}

// Function to handle opening update modal and pre-fill form fields
function openUpdateDepartmentModal(id, deptId, deptName) {
    document.getElementById('updateDeptId').value = deptId;
    document.getElementById('newDeptId').value = deptId; // Initially set to current value
    document.getElementById('newDeptName').value = deptName;
    document.getElementById('updateDepartmentModal').style.display = 'block';
}

// Function to close update modal
function closeUpdateDepartmentModal() {
    document.getElementById('updateDepartmentModal').style.display = 'none';
}

// Function to confirm and send update request to backend
function confirmUpdateDepartment() {
    const id = document.getElementById('updateDeptId').value;
    const newDeptId = document.getElementById('newDeptId').value;
    const newDeptName = document.getElementById('newDeptName').value;

    fetch(`/departments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            deptId: newDeptId,
            deptName: newDeptName,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Update successful:', data);
        fetchDepartments(); // Refresh department list after update
        closeUpdateDepartmentModal(); // Close modal after update
    })
    .catch(error => {
        console.error('Error updating department:', error);
        alert('Error updating department. Please try again.');
    });
}

// Initial fetch of departments on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDepartments();
});
