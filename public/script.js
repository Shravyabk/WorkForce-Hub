document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('departments.html')) {
        fetchDepartments();
    } else if (window.location.pathname.endsWith('employees.html')) {
        const deptId = new URLSearchParams(window.location.search).get('deptId');
        fetchEmployees(deptId);
    }
});
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Example of login validation (replace with actual logic)
    if (username === 'Shravya' && password === '123456') {
        
        window.location.href = 'departments.html'; // Redirect to departments.html after login
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

function cancel() {
    // Example of cancel action (replace with actual logic)
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}
let departments = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Data Science' },
    { id: 3, name: 'IT' }
];

function addDepartment() {
    let newDepartmentName = prompt('Enter new department name:');
    if (newDepartmentName) {
        let newDepartment = {
            id: departments.length + 1,
            name: newDepartmentName
        };
        departments.push(newDepartment);
        loadDepartments(); // Reload table
    }
}

function loadDepartments() {
    const table = document.getElementById('departmentsTable');
    table.innerHTML = ''; // Clear existing table rows

    departments.forEach(department => {
        let row = table.insertRow();
        row.innerHTML = `<td>${department.id}</td><td>${department.name}</td><td><button onclick="editDepartment(${department.id})">Edit</button></td>`;
    });
}

function editDepartment(id) {
    let index = departments.findIndex(dep => dep.id === id);
    if (index !== -1) {
        let newName = prompt('Enter new department name:');
        if (newName) {
            departments[index].name = newName;
            loadDepartments(); // Reload table
        }
    }
}

function deleteDepartment() {
    let idToDelete = prompt('Enter department ID to delete:');
    if (idToDelete) {
        departments = departments.filter(dep => dep.id != idToDelete);
        loadDepartments(); // Reload table
    }
}

// Initial load of departments
loadDepartments();

// Fetch departments and populate the departments table
function fetchDepartments() {
    fetch('/departments')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('departmentsTable').getElementsByTagName('tbody')[0];
            table.innerHTML = '';

            data.forEach(department => {
                const row = table.insertRow();
                const cellId = row.insertCell(0);
                const cellName = row.insertCell(1);

                cellId.textContent = department.deptId;
                cellName.innerHTML = `<a href="employees.html?deptId=${department.deptId}">${department.deptName}</a>`;
            });
        });
}

// Fetch employees for a specific department and populate the employees table
function fetchEmployees(deptId) {
    fetch(`/employees?deptId=${deptId}`)
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('employeesTable').getElementsByTagName('tbody')[0];
            table.innerHTML = '';

            data.forEach(employee => {
                const row = table.insertRow();
                const cellId = row.insertCell(0);
                const cellName = row.insertCell(1);

                cellId.textContent = employee.empId;
                cellName.textContent = employee.empName;
            });
        });
}

// Add department
function confirmAddDepartment() {
    const deptId = document.getElementById('addDeptId').value;
    const deptName = document.getElementById('addDeptName').value;

    fetch('/departments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deptId, deptName })
    })
    .then(response => response.json())
    .then(data => {
        closeAddDepartmentModal();
        fetchDepartments();
    });
}


function addDepartment() {
    let newDepartmentName = prompt('Enter new department name:');
    if (newDepartmentName) {
        let newDepartment = {
            id: departments.length + 1,
            name: newDepartmentName
        };
        departments.push(newDepartment);
        loadDepartments(); // Reload table
    }
}

function loadDepartments() {
    const table = document.getElementById('departmentsTable');
    table.innerHTML = ''; // Clear existing table rows

    departments.forEach(department => {
        let row = table.insertRow();
        row.innerHTML = `<td>${department.id}</td><td>${department.name}</td><td><button onclick="editDepartment(${department.id})">Edit</button></td>`;
    });
}

function editDepartment(id) {
    let index = departments.findIndex(dep => dep.id === id);
    if (index !== -1) {
        let newName = prompt('Enter new department name:');
        if (newName) {
            departments[index].name = newName;
            loadDepartments(); // Reload table
        }
    }
}

function deleteDepartment() {
    let idToDelete = prompt('Enter department ID to delete:');
    if (idToDelete) {
        departments = departments.filter(dep => dep.id != idToDelete);
        loadDepartments(); // Reload table
    }
}

// Initial load of departments
loadDepartments();


// Update department
function confirmUpdateDepartment() {
    const deptId = document.getElementById('updateDeptId').value;
    const deptName = document.getElementById('newDeptName').value;

    fetch('/departments', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deptId, deptName })
    })
    .then(response => response.json())
    .then(data => {
        closeUpdateDepartmentModal();
        fetchDepartments();
    });
}

// Delete department
function confirmDeleteDepartment() {
    const deptId = document.getElementById('deleteDeptId').value;

    fetch('/departments', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deptId })
    })
    .then(response => response.json())
    .then(data => {
        closeDeleteDepartmentModal();
        fetchDepartments();
    });
}

// Add employee
function confirmAddEmployee() {
    const deptId = new URLSearchParams(window.location.search).get('deptId');
    const empId = document.getElementById('addEmpId').value;
    const empName = document.getElementById('addEmpName').value;

    fetch('/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ empId, empName, deptId })
    })
    .then(response => response.json())
    .then(data => {
        closeAddEmployeeModal();
        fetchEmployees(deptId);
    });
}

// Update employee
function confirmUpdateEmployee() {
    const deptId = new URLSearchParams(window.location.search).get('deptId');
    const empId = document.getElementById('updateEmpId').value;
    const empName = document.getElementById('newEmpName').value;

    fetch('/employees', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ empId, empName, deptId })
    })
    .then(response => response.json())
    .then(data => {
        closeUpdateEmployeeModal();
        fetchEmployees(deptId);
    });
}

// Delete employee
function confirmDeleteEmployee() {
    const deptId = new URLSearchParams(window.location.search).get('deptId');
    const empId = document.getElementById('deleteEmpId').value;

    fetch('/employees', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ empId, deptId })
    })
    .then(response => response.json())
    .then(data => {
        closeDeleteEmployeeModal();
        fetchEmployees(deptId);
    });
}

// Modal functions for departments
function openAddDepartmentModal() {
    document.getElementById('addDepartmentModal').style.display = 'block';
}

function closeAddDepartmentModal() {
    document.getElementById('addDepartmentModal').style.display = 'none';
}

function openUpdateDepartmentModal() {
    document.getElementById('updateDepartmentModal').style.display = 'block';
}

function closeUpdateDepartmentModal() {
    document.getElementById('updateDepartmentModal').style.display = 'none';
}

function openDeleteDepartmentModal() {
    document.getElementById('deleteDepartmentModal').style.display = 'block';
}

function closeDeleteDepartmentModal() {
    document.getElementById('deleteDepartmentModal').style.display = 'none';
}

// Modal functions for employees
function openAddEmployeeModal() {
    document.getElementById('addEmployeeModal').style.display = 'block';
}

function closeAddEmployeeModal() {
    document.getElementById('addEmployeeModal').style.display = 'none';
}

function openUpdateEmployeeModal() {
    document.getElementById('updateEmployeeModal').style.display = 'block';
}

function closeUpdateEmployeeModal() {
    document.getElementById('updateEmployeeModal').style.display = 'none';
}

function openDeleteEmployeeModal() {
    document.getElementById('deleteEmployeeModal').style.display = 'block';
}

function closeDeleteEmployeeModal() {
    document.getElementById('deleteEmployeeModal').style.display = 'none';
}
