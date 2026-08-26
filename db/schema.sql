-- 상식 퀴즈 게임 2차 구현 — 테이블
-- 구현 1단계: 빈 테이블 넷을 만들고 행 수준 보안(RLS)을 켠다.
-- 정책은 만들지 않는다. 사용자 정책은 2단계, 응시 기록 정책은 4단계에서 만든다.
-- 개발 용도와 운영 용도 두 프로젝트에서 각각 한 번씩 실행한다.

-- 1. 사용자 ------------------------------------------------------------------
-- 깃허브 아이디가 사람이 읽는 키다. 인증 식별자는 정책이 행을 거를 때 쓰며
-- 그 사람의 첫 로그인 때 api/users.js의 signin이 채운다.

create table if not exists users (
  github_id   text primary key,
  auth_id     uuid unique references auth.users (id) on delete set null,
  name        text not null,
  role        text not null default 'student' check (role in ('student', 'teacher')),
  created_at  timestamptz not null default now()
);

-- 2. 문항 --------------------------------------------------------------------
-- PRD 3.6절의 필드에 만든 이, 만든 때, 요청 식별자를 더한다.

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
-- 판을 시작할 때 행을 만들고 마칠 때 마감한다. 판 테이블을 따로 두지 않는다.

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
-- 채택 전 문항도 여기에는 들어간다. 채택한 것만 문항 테이블로 간다.

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
-- 켜지 않은 테이블은 공개 키로 전부 조회된다.

alter table users               enable row level security;
alter table questions           enable row level security;
alter table attempts            enable row level security;
alter table generation_requests enable row level security;

-- 첫 선생님 ------------------------------------------------------------------
-- 아래 줄의 아이디와 이름을 자기 것으로 바꾸고 앞의 -- 를 지운 뒤 실행한다.
-- 이 행이 없으면 아무도 선생님이 될 수 없다.

-- insert into users (github_id, name, role) values ('깃허브아이디', '이름', 'teacher');
