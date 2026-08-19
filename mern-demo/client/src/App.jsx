import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  // Lấy danh sách sinh viên (dùng đường dẫn tương đối /api/students)
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Gửi sinh viên mới lên API (dùng đường dẫn tương đối /api/students)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error("Lỗi thêm:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quản Lý Sinh Viên</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          placeholder="MSSV"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          required
        />
        <input
          placeholder="Họ và tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">Thêm Sinh Viên</button>
      </form>

      <h3>Danh Sách Sinh Viên</h3>
      <ul>
        {students.map((st) => (
          <li key={st._id}>
            <b>{st.studentId}</b> - {st.name} ({st.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;