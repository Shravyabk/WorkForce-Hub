const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('database.sqlite');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create tables if they do not exist
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS de (id INTEGER PRIMARY KEY AUTOINCREMENT, deptId TEXT, deptName TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS em (id INTEGER PRIMARY KEY AUTOINCREMENT, empId TEXT, empName TEXT, deptId TEXT)');

    // Insert initial data if not already present
    db.get('SELECT COUNT(*) AS count FROM de', (err, row) => {
        if (!err && row.count === 0) {
            db.run('INSERT INTO de (deptId, deptName) VALUES ("1", "Computer Science"), ("2", "Data Science")');
        }
    });

    db.get('SELECT COUNT(*) AS count FROM em', (err, row) => {
        if (!err && row.count === 0) {
            db.run('INSERT INTO em (empId, empName, deptId) VALUES ("E1", "John", "1"), ("E2", "Jahnvi", "2")');
        }
    });
});

// CRUD for Departments
app.get('/departments', (req, res) => {
    db.all('SELECT * FROM de', (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.post('/departments', (req, res) => {
    const { deptId, deptName } = req.body;
    db.run('INSERT INTO de (deptId, deptName) VALUES (?, ?)', [deptId, deptName], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Department added successfully' });
    });
});

app.put('/departments', (req, res) => {
    const { deptId, deptName } = req.body;
    db.run('UPDATE de SET deptName = ? WHERE deptId = ?', [deptName, deptId], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Department updated successfully' });
    });
});

app.delete('/departments', (req, res) => {
    const { deptId } = req.body;
    db.run('DELETE FROM de WHERE deptId = ?', [deptId], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Department deleted successfully' });
    });
});

// CRUD for Employees
app.get('/employees', (req, res) => {
    const deptId = req.query.deptId;
    db.all('SELECT * FROM em WHERE deptId = ?', [deptId], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.post('/employees', (req, res) => {
    const { empId, empName, deptId } = req.body;
    db.run('INSERT INTO em (empId, empName, deptId) VALUES (?, ?, ?)', [empId, empName, deptId], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Employee added successfully' });
    });
});

app.put('/employees', (req, res) => {
    const { empId, empName, deptId } = req.body;
    db.run('UPDATE em SET empName = ? WHERE empId = ? AND deptId = ?', [empName, empId, deptId], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Employee updated successfully' });
    });
});

app.delete('/employees', (req, res) => {
    const { empId, deptId } = req.body;
    db.run('DELETE FROM em WHERE empId = ? AND deptId = ?', [empId, deptId], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Employee deleted successfully' });
    });
});

// Serve static HTML pages
app.get('/departments.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'departments.html'));
});

app.get('/employees.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'employees.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
