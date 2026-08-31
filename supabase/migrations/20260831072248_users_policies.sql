-- 사용자 테이블의 행 수준 보안 정책 — 2차 구현 2단계
-- 생성: 2026-08-31 16:22 KST
--
-- 계획서 「2차 구현 2단계 — 인증」 — 학생은 자기 행 하나, 선생님은 전체를 조회함.
-- 역할은 요청한 사람의 행에서 읽음. 브라우저가 보낸 값을 쓰지 않음(PRD 3.7절).
-- 쓰기 정책은 두지 않음. 쓰기는 서버 함수가 비밀 키로 함(PRD 3.8절).
-- 개발 용도와 운영 용도 두 프로젝트에서 각각 한 번씩 실행함.

-- 요청한 사람이 선생님인지 판정하는 함수.
-- 정책 안에서 사용자 테이블을 그대로 조회하면 정책이 자기 자신을 다시 불러
-- 무한 반복 오류가 나므로, 정책의 검사를 거치지 않는(security definer) 함수로 분리함.
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from users
    where auth_id = (select auth.uid()) and role = 'teacher'
  );
$$;

-- 학생: 인증 식별자가 자기 것인 행 하나만 조회함.
-- 인증 식별자가 비어 있는 행은 어느 조건에도 걸리지 않아 조회되지 않음.
drop policy if exists users_select_self on users;
create policy users_select_self
  on users for select
  to authenticated
  using (auth_id = (select auth.uid()));

-- 선생님: 전체 행을 조회함.
drop policy if exists users_select_all_teacher on users;
create policy users_select_all_teacher
  on users for select
  to authenticated
  using (public.is_teacher());
