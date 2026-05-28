import { useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePost } from './api';
import './App.css';

const EMPTY_FORM = { title: '', content: '', author: '' };

export default function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = () => getPosts().then(r => setPosts(r.data));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updatePost(editId, form);
    } else {
      await createPost(form);
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    load();
  };

  const handleEdit = (post) => {
    setEditId(post.id);
    setForm({ title: post.title, content: post.content, author: post.author });
    setSelected(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('삭제하시겠습니까?')) {
      await deletePost(id);
      if (selected?.id === id) setSelected(null);
      load();
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  return (
    <div className="container">
      <h1>게시판</h1>

      <form className="post-form" onSubmit={handleSubmit}>
        <h2>{editId ? '게시글 수정' : '게시글 작성'}</h2>
        <input
          placeholder="제목"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="작성자"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
        />
        <textarea
          placeholder="내용"
          rows={4}
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
        />
        <div className="form-buttons">
          <button type="submit">{editId ? '수정 완료' : '작성'}</button>
          {editId && <button type="button" onClick={handleCancel}>취소</button>}
        </div>
      </form>

      {selected && (
        <div className="post-detail">
          <h2>{selected.title}</h2>
          <p className="meta">작성자: {selected.author} | {new Date(selected.createdAt).toLocaleString()}</p>
          <p className="content">{selected.content}</p>
          <div className="form-buttons">
            <button onClick={() => handleEdit(selected)}>수정</button>
            <button className="danger" onClick={() => handleDelete(selected.id)}>삭제</button>
            <button onClick={() => setSelected(null)}>닫기</button>
          </div>
        </div>
      )}

      <table className="post-table">
        <thead>
          <tr>
            <th>번호</th><th>제목</th><th>작성자</th><th>작성일</th><th>관리</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center' }}>게시글이 없습니다.</td></tr>
          )}
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                <span className="title-link" onClick={() => setSelected(post)}>
                  {post.title}
                </span>
              </td>
              <td>{post.author}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(post)}>수정</button>
                <button className="danger" onClick={() => handleDelete(post.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
