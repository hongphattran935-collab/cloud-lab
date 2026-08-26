const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// KẾT NỐI MONGODB ATLAS
// ===============================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Da ket noi thanh cong den MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("Loi ket noi MongoDB Atlas:", err.message);
  });

// ===============================
// IMPORT MODEL STUDENT
// ===============================
const Student = require('./models/Student');

// ===============================
// CÂU 45: API HELLO
// ===============================
app.get('/api/hello', (req, res) => {
  res.json({
    message: "Hello from Backend!"
  });
});

// ===============================
// CÂU 36: GET /api/students
// Lấy danh sách sinh viên
// ===============================
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// ===============================
// CÂU 37: POST /api/students
// Thêm sinh viên mới
// ===============================
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

// ===============================
// CÂU 38: PUT /api/students/:id
// Cập nhật sinh viên
// ===============================
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

// ===============================
// CÂU 39: DELETE /api/students/:id
// Xóa sinh viên
// ===============================
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Xoa sinh vien thanh cong!"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// ===============================
// KHỞI ĐỘNG SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Server dang chay tren port ${PORT}`);
});