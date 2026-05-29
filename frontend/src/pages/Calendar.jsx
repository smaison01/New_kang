import { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getEvents, getEventsByDate, createEvent, updateEvent, deleteEvent } from '../api';
import './Calendar.css';

function toDateStr(date) {
  return date.toLocaleDateString('sv-SE');
}

const EMPTY_FORM = { content: '' };

export default function Calendar() {
  const [selected, setSelected] = useState(new Date());
  const [allEvents, setAllEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadAll = () => getEvents().then(r => setAllEvents(r.data));
  const loadDay = (d) => getEventsByDate(d).then(r => setDayEvents(r.data));

  useEffect(() => { loadAll(); }, []);

  const dateStr = toDateStr(selected);
  useEffect(() => { loadDay(dateStr); }, [dateStr]);

  const hasDot = (date) => {
    const d = toDateStr(date);
    return allEvents.some(e => e.startDate <= d && e.endDate >= d);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const ev = dayEvents.find(e => e.id === editId);
      await updateEvent(editId, { ...form, startDate: ev.startDate, endDate: ev.endDate });
    } else {
      await createEvent({ ...form, startDate: dateStr, endDate: dateStr });
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
    loadAll();
    loadDay(dateStr);
  };

  const handleEdit = (ev) => {
    setEditId(ev.id);
    setForm({ content: ev.content });
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
      loadAll();
      loadDay(dateStr);
    }
  };

  const handleDateChange = (date) => {
    setSelected(date);
    handleCancel();
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    return hasDot(date) ? <div className="event-dot" /> : null;
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
                placeholder="일정 내용"
                value={form.content}
                onChange={e => setForm({ content: e.target.value })}
                required
                autoFocus
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
                  <span className="event-title">{ev.content}</span>
                  {ev.startDate !== ev.endDate &&
                    <span className="event-desc">{ev.startDate} → {ev.endDate}</span>}
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
