import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, bulkDeleteEvents } from '../api';
import './EventManage.css';

const today = () => new Date().toLocaleDateString('sv-SE');

const EMPTY_FORM = { content: '', startDate: today(), endDate: today() };

export default function EventManage() {
  const [events, setEvents] = useState([]);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd]     = useState('');
  const [checkedIds, setCheckedIds]   = useState(new Set());

  const load = (s, e) => getEvents(s, e).then(r => {
    setEvents(r.data);
    setCheckedIds(new Set());
  });

  useEffect(() => { load(); }, []);

  /* ── 신규 등록 ── */
  const handleAdd = async (ev) => {
    ev.preventDefault();
    if (!addForm.content.trim()) return;
    await createEvent(addForm);
    setAddForm(EMPTY_FORM);
    load(filterStart || undefined, filterEnd || undefined);
  };

  /* ── 조회 ── */
  const handleSearch = () => load(filterStart || undefined, filterEnd || undefined);
  const handleReset  = () => { setFilterStart(''); setFilterEnd(''); load(); };

  /* ── 인라인 수정 ── */
  const handleEdit = (ev) => {
    setEditId(ev.id);
    setEditForm({ content: ev.content, startDate: ev.startDate, endDate: ev.endDate });
  };
  const handleSave = async () => {
    await updateEvent(editId, editForm);
    setEditId(null);
    load(filterStart || undefined, filterEnd || undefined);
  };
  const handleCancel = () => setEditId(null);

  /* ── 단건 삭제 ── */
  const handleDelete = async (id) => {
    if (window.confirm('일정을 삭제하시겠습니까?')) {
      await deleteEvent(id);
      load(filterStart || undefined, filterEnd || undefined);
    }
  };

  /* ── 체크박스 ── */
  const toggleAll = (checked) => {
    setCheckedIds(checked ? new Set(events.map(e => e.id)) : new Set());
  };
  const toggleOne = (id) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── 일괄 삭제 ── */
  const handleBulkDelete = async () => {
    if (checkedIds.size === 0) return;
    if (window.confirm(`${checkedIds.size}건을 삭제하시겠습니까?`)) {
      await bulkDeleteEvents([...checkedIds]);
      load(filterStart || undefined, filterEnd || undefined);
    }
  };

  const allChecked = events.length > 0 && checkedIds.size === events.length;

  return (
    <div className="em-page">

      {/* 페이지 헤더 */}
      <div className="em-header">
        <div className="em-emoji">🗂️</div>
        <h1 className="em-title">일정 관리</h1>
        <p className="em-desc">전체 일정을 조회하고 관리합니다.</p>
      </div>

      <hr className="em-divider" />

      {/* ① 신규 등록 폼 */}
      <div className="em-section-label">신규 일정 등록</div>
      <form className="em-add-form" onSubmit={handleAdd}>
        <span className="em-form-label">기간</span>
        <input className="em-input" type="date" value={addForm.startDate}
          onChange={e => setAddForm({ ...addForm, startDate: e.target.value })} required />
        <span className="em-date-sep">→</span>
        <input className="em-input" type="date" value={addForm.endDate}
          onChange={e => setAddForm({ ...addForm, endDate: e.target.value })} required />
        <span className="em-form-label" style={{ marginLeft: 12 }}>내용</span>
        <input className="em-input em-input-flex" type="text" placeholder="일정 내용을 입력하세요"
          value={addForm.content}
          onChange={e => setAddForm({ ...addForm, content: e.target.value })} required />
        <button className="em-btn em-btn-primary" type="submit">+ 등록</button>
      </form>

      <hr className="em-divider" />

      {/* ② 조회 조건 */}
      <div className="em-section-label">조회 조건</div>
      <div className="em-toolbar">
        <div className="em-filter-group">
          <input className="em-input" type="date" value={filterStart}
            onChange={e => setFilterStart(e.target.value)} />
          <span className="em-date-sep">→</span>
          <input className="em-input" type="date" value={filterEnd}
            onChange={e => setFilterEnd(e.target.value)} />
          <button className="em-btn em-btn-confirm em-btn-sm" onClick={handleSearch}>조회</button>
          <button className="em-btn em-btn-sm" onClick={handleReset}>초기화</button>
        </div>
        <span className="em-total-chip">전체 {events.length}건</span>
      </div>

      {/* ③ 일괄 삭제 바 */}
      <div className="em-bulk-bar">
        {checkedIds.size > 0 && (
          <>
            <span className="em-checked-dot" />
            <span className="em-bulk-count">{checkedIds.size}건 선택됨</span>
            <button className="em-btn em-btn-danger em-btn-sm" onClick={handleBulkDelete}>
              선택 삭제
            </button>
          </>
        )}
      </div>

      {/* ④ 테이블 */}
      <table className="em-table">
        <thead>
          <tr>
            <th className="td-chk">
              <input type="checkbox" checked={allChecked}
                onChange={e => toggleAll(e.target.checked)} />
            </th>
            <th className="td-num">#</th>
            <th className="td-date">날짜 ↓</th>
            <th>내용</th>
            <th className="td-actions">관리</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan={5} className="em-empty">등록된 일정이 없습니다.</td>
            </tr>
          )}
          {events.map((ev, idx) => {
            const isEdit    = editId === ev.id;
            const isChecked = checkedIds.has(ev.id);
            return (
              <tr key={ev.id}
                className={isEdit ? 'row-editing' : isChecked ? 'row-checked' : ''}>
                <td className="td-chk">
                  <input type="checkbox" checked={isChecked}
                    onChange={() => toggleOne(ev.id)} />
                </td>
                <td className="td-num">{events.length - idx}</td>
                <td className="td-date">
                  {isEdit ? (
                    <div className="date-range-edit">
                      <input className="em-input em-input-sm" type="date"
                        value={editForm.startDate}
                        onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} />
                      <span className="em-date-sep">→</span>
                      <input className="em-input em-input-sm" type="date"
                        value={editForm.endDate}
                        onChange={e => setEditForm({ ...editForm, endDate: e.target.value })} />
                    </div>
                  ) : (
                    <span className="em-date-tag">
                      📅 {ev.startDate}{ev.startDate !== ev.endDate ? ` → ${ev.endDate}` : ''}
                    </span>
                  )}
                </td>
                <td>
                  {isEdit ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input className="em-inline-input" value={editForm.content}
                        onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                        autoFocus />
                      <span className="em-editing-badge">편집 중</span>
                    </div>
                  ) : (
                    ev.content
                  )}
                </td>
                <td className="td-actions">
                  {isEdit ? (
                    <>
                      <button className="em-btn em-btn-confirm em-btn-sm" onClick={handleSave}>저장</button>
                      <button className="em-btn em-btn-sm" onClick={handleCancel}>취소</button>
                    </>
                  ) : (
                    <>
                      <button className="em-btn em-btn-sm" onClick={() => handleEdit(ev)}>수정</button>
                      <button className="em-btn em-btn-danger em-btn-sm" onClick={() => handleDelete(ev.id)}>삭제</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
