import { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getEvents, createEvent, deleteEvent } from '../api';
import './Calendar.css';

function toDateStr(date) {
  return date.toLocaleDateString('sv-SE'); // yyyy-MM-dd
}

export default function Calendar() {
  const [selected, setSelected] = useState(new Date());
  const [allEvents, setAllEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => getEvents().then(r => setAllEvents(r.data));
  useEffect(() => { load(); }, []);

  const dateStr = toDateStr(selected);
  const dayEvents = allEvents.filter(e => e.date === dateStr);
  const eventDates = new Set(allEvents.map(e => e.date));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent({ ...form, date: dateStr });
    setForm({ title: '', description: '' });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    load();
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
            onChange={setSelected}
            value={selected}
            tileContent={tileContent}
            locale="ko-KR"
          />
        </div>

        <div className="event-panel">
          <div className="event-panel-header">
            <h2>{dateStr}</h2>
            <button onClick={() => setShowForm(v => !v)}>
              {showForm ? '취소' : '+ 일정 추가'}
            </button>
          </div>

          {showForm && (
            <form className="event-form" onSubmit={handleSubmit}>
              <input
                placeholder="일정 제목"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                placeholder="메모 (선택)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <button type="submit">저장</button>
            </form>
          )}

          <ul className="event-list">
            {dayEvents.length === 0 && (
              <li className="no-event">등록된 일정이 없습니다.</li>
            )}
            {dayEvents.map(ev => (
              <li key={ev.id} className="event-item">
                <div className="event-info">
                  <span className="event-title">{ev.title}</span>
                  {ev.description && <span className="event-desc">{ev.description}</span>}
                </div>
                <button className="danger" onClick={() => handleDelete(ev.id)}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
