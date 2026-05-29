import { useState, useEffect } from 'react';
import { getEvents, updateEvent, deleteEvent } from '../api';
import './EventManage.css';

const EMPTY_FORM = { title: '', description: '' };

export default function EventManage() {
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterDate, setFilterDate] = useState('');

  const load = () => getEvents().then(r => {
    const sorted = r.data.sort((a, b) => a.date.localeCompare(b.date));
    setEvents(sorted);
  });

  useEffect(() => { load(); }, []);

  const handleEdit = (ev) => {
    setEditId(ev.id);
    setForm({ title: ev.title, description: ev.description || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const ev = events.find(e => e.id === editId);
    await updateEvent(editId, { ...form, date: ev.date });
    setEditId(null);
    setForm(EMPTY_FORM);
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('일정을 삭제하시겠습니까?')) {
      await deleteEvent(id);
      load();
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const filtered = filterDate
    ? events.filter(e => e.date === filterDate)
    : events;

  return (
    <div className="page">
      <h1 className="page-title">일정 관리</h1>

      <div className="em-toolbar">
        <div className="em-filter">
          <label>날짜 필터</label>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
          {filterDate && (
            <button className="btn-clear" onClick={() => setFilterDate('')}>초기화</button>
          )}
        </div>
        <span className="em-count">전체 {filtered.length}건</span>
      </div>

      <table className="em-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>날짜</th>
            <th>제목</th>
            <th>메모</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: '#aaa' }}>
                등록된 일정이 없습니다.
              </td>
            </tr>
          )}
          {filtered.map(ev => (
            <tr key={ev.id} className={editId === ev.id ? 'editing' : ''}>
              <td>{ev.id}</td>
              <td className="td-date">{ev.date}</td>
              {editId === ev.id ? (
                <>
                  <td>
                    <input
                      className="inline-input"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      autoFocus
                    />
                  </td>
                  <td>
                    <input
                      className="inline-input"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="메모"
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdate}>저장</button>
                    <button className="btn-cancel" onClick={handleCancel}>취소</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="td-title">{ev.title}</td>
                  <td className="td-desc">{ev.description || '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(ev)}>수정</button>
                    <button className="danger" onClick={() => handleDelete(ev.id)}>삭제</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
