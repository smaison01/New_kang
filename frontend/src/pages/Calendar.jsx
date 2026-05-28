import { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api';
import './Calendar.css';

function toDateStr(date) {
  return date.toLocaleDateString('sv-SE');
}

const EMPTY_FORM = { title: '', description: '' };

export default function Calendar() {
  const [selected, setSelected] = useState(new Date());
  const [allEvents, setAllEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => getEvents().then(r => setAllEvents(r.data));
  useEffect(() => { load(); }, []);

  const dateStr = toDateStr(selected);
  const dayEvents = allEvents.filter(e => e.date === dateStr);
  const eventDates = new Set(allEvents.map(e => e.date));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateEvent(editId, { ...form, date: dateStr });
    } else {
      await createEvent({ ...form, date: dateStr });
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (ev) => {
    setEditId(ev.id);
    setForm({ title: ev.title, description: ev.description || '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('일정을 삭제하시겠습니까?')) {
      await deleteEvent(id);
      load();
    }
  };

  const handleDateChange = (date) => {
    setSelected(date);
    handleCancel();
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    if (eventDates.has(toDateStr(date))) {
      return <div className="event-dot" />;
    }
    return null;
  };

  return (
    <div className="page">
      <h1 className="page-title">캘린더</h1>
      <div className="calendar-layout">
        <div className="calendar-wrap">
          <ReactCalendar
            onChange={handleDateChange}
            value={selected}
            tileContent={tileContent}
            locale="ko-KR"
          />
        </div>

        <div className="event-panel">
          <div className="event-panel-header">
            <h2>{dateStr}</h2>
            {!showForm && (
              <button onClick={() => setShowForm(true)}>+ 일정 추가</button>
            )}
          </div>

          {showForm && (
            <form className="event-form" onSubmit={handleSubmit}>
              <p className="form-label">{editId ? '일정 수정' : '새 일정'}</p>
              <input
                placeholder="일정 제목"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                autoFocus
              />
              <input
                placeholder="메모 (선택)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <div className="form-buttons">
                <button type="submit">{editId ? '수정 완료' : '저장'}</button>
                <button type="button" onClick={handleCancel}>취소</button>
              </div>
            </form>
          )}

          <ul className="event-list">
            {dayEvents.length === 0 && !showForm && (
              <li className="no-event">등록된 일정이 없습니다.</li>
            )}
            {dayEvents.map(ev => (
              <li key={ev.id} className={`event-item${editId === ev.id ? ' editing' : ''}`}>
                <div className="event-info">
                  <span className="event-title">{ev.title}</span>
                  {ev.description && <span className="event-desc">{ev.description}</span>}
                </div>
                <div className="event-actions">
                  <button onClick={() => handleEdit(ev)}>수정</button>
                  <button className="danger" onClick={() => handleDelete(ev.id)}>삭제</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
