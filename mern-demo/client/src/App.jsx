import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);

  // ID sinh viên đang được sửa
  const [editingId, setEditingId] = useState(null);

  // =========================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');

      if (!res.ok) {
        throw new Error('Không thể tải danh sách sinh viên');
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách:', err);
      alert('Không thể kết nối Backend!');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // THAY ĐỔI INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // THÊM / CẬP NHẬT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.name || !form.email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);

    try {
      // =========================
      // CẬP NHẬT SINH VIÊN
      // =========================
      if (editingId) {
        const res = await fetch(
          `http://localhost:5000/api/students/${editingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify(form)
          }
        );

        if (!res.ok) {
          let message = 'Cập nhật sinh viên thất bại';

          try {
            const errorData = await res.json();
            message = errorData.message || message;
          } catch {}

          throw new Error(message);
        }

        alert('Cập nhật sinh viên thành công!');

        // Thoát chế độ sửa
        setEditingId(null);

        // Xóa form
        setForm({
          studentId: '',
          name: '',
          email: ''
        });

        // Tải lại danh sách
        await fetchStudents();
      }

      // =========================
      // THÊM SINH VIÊN
      // =========================
      else {
        const res = await fetch(
          'http://localhost:5000/api/students',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify(form)
          }
        );

        if (!res.ok) {
          let message = 'Thêm sinh viên thất bại';

          try {
            const errorData = await res.json();
            message = errorData.message || message;
          } catch {}

          throw new Error(message);
        }

        alert('Thêm sinh viên thành công!');

        setForm({
          studentId: '',
          name: '',
          email: ''
        });

        await fetchStudents();
      }
    } catch (err) {
      console.error('Lỗi:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // BẮT ĐẦU SỬA
  // =========================
  const handleEdit = (student) => {
    setEditingId(student._id);

    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });

    // Cuộn lên đầu trang
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // =========================
  // HỦY SỬA
  // =========================
  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      studentId: '',
      name: '',
      email: ''
    });
  };

  // =========================
  // XÓA SINH VIÊN
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa sinh viên này không?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: 'DELETE'
        }
      );

      if (!res.ok) {
        let message = 'Xóa sinh viên thất bại';

        try {
          const errorData = await res.json();
          message = errorData.message || message;
        } catch {}

        throw new Error(message);
      }

      alert('Xóa sinh viên thành công!');

      await fetchStudents();
    } catch (err) {
      console.error('Lỗi xóa:', err);
      alert(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#15161c',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        padding: '30px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto'
        }}
      >
        {/* TIÊU ĐỀ */}
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '32px'
          }}
        >
          Quản Lý Sinh Viên
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            marginBottom: '20px'
          }}
        >
          {/* MSSV */}
          <input
            name="studentId"
            type="text"
            placeholder="MSSV"
            value={form.studentId}
            onChange={handleChange}
            required
            style={{
              flex: 1,
              padding: '13px',
              fontSize: '16px',
              color: '#ffffff',
              backgroundColor: '#3b3b3b',
              border: '1px solid #777',
              boxSizing: 'border-box'
            }}
          />

          {/* HỌ TÊN */}
          <input
            name="name"
            type="text"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              flex: 1,
              padding: '13px',
              fontSize: '16px',
              color: '#ffffff',
              backgroundColor: '#3b3b3b',
              border: '1px solid #777',
              boxSizing: 'border-box'
            }}
          />

          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              flex: 1,
              padding: '13px',
              fontSize: '16px',
              color: '#ffffff',
              backgroundColor: '#3b3b3b',
              border: '1px solid #777',
              boxSizing: 'border-box'
            }}
          />

          {/* NÚT */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '13px 20px',
              fontSize: '16px',
              backgroundColor: editingId ? '#28a745' : '#25c7f5',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {loading
              ? 'Đang xử lý...'
              : editingId
              ? 'Cập nhật'
              : 'Thêm Sinh Viên'}
          </button>

          {/* NÚT HỦY */}
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: '13px 18px',
                fontSize: '16px',
                backgroundColor: '#6c757d',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Hủy
            </button>
          )}
        </form>

        {/* TRẠNG THÁI SỬA */}
        {editingId && (
          <p
            style={{
              color: '#ffc107',
              textAlign: 'center',
              marginBottom: '20px'
            }}
          >
            Đang chỉnh sửa thông tin sinh viên...
          </p>
        )}

        {/* TIÊU ĐỀ */}
        <h2
          style={{
            textAlign: 'center',
            color: '#aebbd0',
            marginTop: '35px',
            marginBottom: '25px'
          }}
        >
          Danh Sách Sinh Viên
        </h2>

        {/* BẢNG SINH VIÊN */}
        {students.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: '#888'
            }}
          >
            Chưa có sinh viên nào.
          </p>
        ) : (
          <div
            style={{
              overflowX: 'auto'
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#202127'
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>STT</th>
                  <th style={thStyle}>MSSV</th>
                  <th style={thStyle}>Họ và tên</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {students.map((st, index) => (
                  <tr key={st._id || st.studentId}>
                    <td style={tdStyle}>
                      {index + 1}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: 'bold'
                      }}
                    >
                      {st.studentId}
                    </td>

                    <td style={tdStyle}>
                      {st.name}
                    </td>

                    <td style={tdStyle}>
                      {st.email}
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() => handleEdit(st)}
                        style={{
                          padding: '8px 14px',
                          marginRight: '8px',
                          backgroundColor: '#ffc107',
                          color: '#000000',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => handleDelete(st._id)}
                        style={{
                          padding: '8px 14px',
                          backgroundColor: '#dc3545',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// CSS cho bảng
const thStyle = {
  padding: '14px',
  border: '1px solid #555',
  backgroundColor: '#30323a',
  color: '#ffffff',
  textAlign: 'center'
};

const tdStyle = {
  padding: '14px',
  border: '1px solid #444',
  color: '#d7ddea',
  textAlign: 'center'
};

export default App;