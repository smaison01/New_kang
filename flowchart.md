# 게시판 소스 흐름도

## 1. 전체 아키텍처

```
브라우저 (http://localhost:5173)
        │
        ▼
┌───────────────────────────────┐
│         Frontend (React)      │
│  App.jsx → BrowserRouter      │
│   ├── /board  → Board.jsx     │
│   └── /calendar → Calendar.jsx│
└───────────────┬───────────────┘
                │ HTTP (axios)
                │ http://localhost:8080/api
                ▼
┌───────────────────────────────┐
│        Backend (Spring Boot)  │
│  PostController               │
│  └── PostService              │
│       └── PostRepository      │
│            └── H2 DB (메모리) │
└───────────────────────────────┘
```

---

## 2. 프론트엔드 컴포넌트 구조

```
App.jsx
├── BrowserRouter
│   ├── Sidebar.jsx          ← 왼쪽 고정 메뉴 (게시판 / 캘린더)
│   └── <main>
│       ├── Route: /         → Navigate to /board
│       ├── Route: /board    → Board.jsx
│       └── Route: /calendar → Calendar.jsx
│
Board.jsx (상태)
├── posts[]          ← 게시글 목록
├── form{}           ← 입력폼 (title, content, author)
├── editId           ← 수정 중인 게시글 ID (null이면 신규작성)
└── selected         ← 상세보기 중인 게시글

Calendar.jsx (상태)
├── selected         ← 선택된 날짜
├── allEvents[]      ← 전체 일정 목록
├── form{}           ← 입력폼 (title, description)
├── editId           ← 수정 중인 일정 ID
└── showForm         ← 폼 표시 여부
```

---

## 3. 게시판 CRUD 흐름

### 조회 (Read)
```
Board.jsx 마운트
    │
    ▼ useEffect 실행
api.getPosts()
    │ GET /api/posts
    ▼
PostController.getAll()
    │
    ▼
PostService.findAll()
    │
    ▼
PostRepository.findAll()   ← JPA → H2 DB
    │ List<Post> 반환
    ▼
setPosts(r.data)           ← 화면 목록 갱신
```

### 작성 (Create)
```
사용자: 제목/작성자/내용 입력 후 [작성] 클릭
    │
    ▼ handleSubmit() - editId === null
api.createPost({ title, content, author })
    │ POST /api/posts  (JSON body)
    ▼
PostController.create(@RequestBody Post)
    │
    ▼
PostService.save(post)
    │
    ▼
PostRepository.save(post)  ← INSERT INTO post
    │ @PrePersist: createdAt 자동 설정
    ▼
load()                     ← 목록 재조회
```

### 수정 (Update)
```
사용자: 목록에서 [수정] 클릭
    │
    ▼ handleEdit(post)
editId = post.id           ← 폼에 기존 값 채움
form = { title, content, author }
    │
사용자: 내용 수정 후 [수정 완료] 클릭
    │
    ▼ handleSubmit() - editId !== null
api.updatePost(editId, form)
    │ PUT /api/posts/{id}  (JSON body)
    ▼
PostController.update(@PathVariable id, @RequestBody Post)
    │
    ▼
PostService.update(id, updated)
    ├── findById(id)       ← 기존 Post 조회
    ├── post.setTitle()
    ├── post.setContent()
    ├── post.setAuthor()
    └── postRepository.save(post)  ← UPDATE post SET ...
    │
    ▼
load()                     ← 목록 재조회
```

### 삭제 (Delete)
```
사용자: [삭제] 클릭
    │
    ▼ handleDelete(id)
window.confirm('삭제하시겠습니까?')
    │ 확인
    ▼
api.deletePost(id)
    │ DELETE /api/posts/{id}
    ▼
PostController.delete(@PathVariable id)
    │
    ▼
PostService.delete(id)
    │
    ▼
PostRepository.deleteById(id)  ← DELETE FROM post WHERE id=?
    │
    ▼
load()                         ← 목록 재조회
```

---

## 4. 백엔드 레이어 역할

```
┌──────────────────────────────────────────────────────────┐
│ Controller  (PostController / EventController)           │
│  - HTTP 요청/응답 처리                                    │
│  - @RestController, @CrossOrigin(5173)                   │
│  - URL: /api/posts, /api/events                          │
├──────────────────────────────────────────────────────────┤
│ Service  (PostService / EventService)                    │
│  - 비즈니스 로직                                          │
│  - 수정 시 기존 Entity 조회 후 필드 변경                  │
├──────────────────────────────────────────────────────────┤
│ Repository  (PostRepository / EventRepository)           │
│  - JpaRepository 상속 → CRUD 자동 제공                   │
│  - EventRepository: findByDate(String) 커스텀 쿼리       │
├──────────────────────────────────────────────────────────┤
│ Entity  (Post / Event)                                   │
│  Post:  id, title, content, author, createdAt            │
│  Event: id, title, date, description, createdAt          │
│  @PrePersist → createdAt 저장 시 자동 입력               │
├──────────────────────────────────────────────────────────┤
│ H2 In-Memory DB                                          │
│  - 앱 실행 시 테이블 자동 생성 (create-drop)             │
│  - 재시작 시 데이터 초기화                                │
└──────────────────────────────────────────────────────────┘
```

---

## 5. API 전체 목록

| 메서드 | URL | 동작 | Controller → Service |
|--------|-----|------|----------------------|
| GET | /api/posts | 전체 목록 | getAll() → findAll() |
| GET | /api/posts/{id} | 단건 조회 | getOne() → findById() |
| POST | /api/posts | 작성 | create() → save() |
| PUT | /api/posts/{id} | 수정 | update() → update() |
| DELETE | /api/posts/{id} | 삭제 | delete() → delete() |
| GET | /api/events | 전체 일정 | getAll() → findAll() |
| GET | /api/events/date/{date} | 날짜별 일정 | getByDate() → findByDate() |
| POST | /api/events | 일정 작성 | create() → save() |
| PUT | /api/events/{id} | 일정 수정 | update() → update() |
| DELETE | /api/events/{id} | 일정 삭제 | delete() → delete() |
