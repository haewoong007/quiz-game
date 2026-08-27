-- 상식 퀴즈 게임 2차 구현 — 테이블 넷
--
-- 구현 1단계에서 빈 테이블을 만들고 행 수준 보안(RLS)을 켬. 정책은 만들지 않음.
-- 사용자 정책은 구현 2단계, 응시 기록 정책은 구현 4단계에서 만듦.
-- 개발 용도와 운영 용도 두 프로젝트에서 각각 한 번씩 실행함.

-- 1. 사용자 ------------------------------------------------------------------
-- PRD 3.10절 — 아이디, 이름, 역할. 비밀번호는 담지 않고 인증 서비스가 보관함.

create table if not exists users (
  github_id   text primary key,
  auth_id     uuid unique references auth.users (id) on delete set null,
  name        text not null,
  role        text not null default 'student' check (role in ('student', 'teacher')),
  created_at  timestamptz not null default now()
);

-- 2. 문항 --------------------------------------------------------------------
-- PRD 3.6절의 필드에 만든 이, 만든 때를 더하고(PRD 3.10절),
-- 계획서 결정 5에 따라 요청 식별자를 더함.

create table if not exists questions (
  id           text primary key,
  category     text not null check (category in ('korean_history', 'science', 'geography', 'art_culture')),
  question     text not null,
  options      jsonb not null,
  answer       smallint not null check (answer between 0 and 3),
  difficulty   text not null,
  explanation  text not null,
  created_by   text references users (github_id),
  created_at   timestamptz not null default now(),
  request_id   uuid
);

-- 3. 응시 기록 ---------------------------------------------------------------
-- PRD 3.10절 — 응시자, 카테고리, 점수, 총 문제 수, 응시 때,
-- 섞인 순서, 문항별 응답, 마감 여부.
-- 계획서 결정 10 — 판을 시작할 때 행을 만들고 마칠 때 마감함.

create table if not exists attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null references users (github_id) on delete cascade,
  category      text not null,
  score         smallint,
  total         smallint not null,
  shuffle_order jsonb not null,
  answers       jsonb not null default '[]'::jsonb,
  is_practice   boolean not null default false,
  is_finished   boolean not null default false,
  started_at    timestamptz not null default now(),
  finished_at   timestamptz
);

-- 4. 생성 요청 ---------------------------------------------------------------
-- 계획서 결정 5 — 요청한 사람, 요청 때, 요청 문자열, 생성된 문항 전문,
-- 검사에서 걸린 항목, 판정 결과, 채택 여부.

create table if not exists generation_requests (
  id            uuid primary key default gen_random_uuid(),
  requested_by  text not null references users (github_id),
  requested_at  timestamptz not null default now(),
  prompt        text not null,
  generated     jsonb not null,
  check_result  jsonb,
  review_result jsonb,
  adopted       boolean not null default false
);

-- 행 수준 보안 ---------------------------------------------------------------
-- PRD 3.8절 — 켜지 않은 테이블은 공개 키로 전부 조회됨.

alter table users               enable row level security;
alter table questions           enable row level security;
alter table attempts            enable row level security;
alter table generation_requests enable row level security;
