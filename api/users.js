// 사용자를 다루는 서버 함수
// 생성: 2026-08-31 21:44 KST
//
// 2차 구현 2단계에서는 signin만 만든다. add, role, remove는 구현 5단계다.
// 요청은 쿼리 문자열의 action으로 가른다.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

// 비밀 키로 DB에 요청한다. 비밀 키는 행 수준 보안 정책을 지나가므로,
// 요청한 사람이 누구인지는 서버가 직접 확인한다(계획서 함수 계약의 「공통」).
function db(path, options = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
}

// 요청에 실린 토큰으로 로그인 정보를 읽는다.
// 깃허브 아이디를 요청 본문에서 받지 않는 까닭이 여기 있다.
// 로그인 정보에만 있으므로 남의 아이디를 실어 보낼 자리가 없다.
async function readSignedInUser(request) {
  const header = request.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;

  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) return null;

  const user = await res.json();
  const meta = user.user_metadata || {};
  const githubId = meta.user_name || meta.preferred_username || '';
  if (!user.id || !githubId) return null;

  return {
    authId: user.id,
    githubId,
    displayName: meta.full_name || meta.name || githubId
  };
}

// signin — 로그인한 뒤 브라우저가 가장 먼저 부르는 요청이다.
// 이 요청만 선생님 검사를 하지 않는다. 처음 로그인하는 학생도 지나야 하기 때문이다.
// 대신 자기 행 하나만 건드린다. 다른 행을 지정할 입력이 없다.
async function signin(request, response) {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || !SUPABASE_SECRET_KEY) {
    return response.status(500).json({ error: '서버 설정이 갖춰지지 않았습니다.' });
  }

  const who = await readSignedInUser(request);
  if (!who) {
    return response.status(401).json({ error: '로그인 정보를 확인하지 못했습니다.' });
  }

  const query = `users?github_id=eq.${encodeURIComponent(who.githubId)}&select=github_id,auth_id,name,role`;
  const found = await db(query);
  if (!found.ok) {
    return response.status(500).json({ error: '사용자를 조회하지 못했습니다.' });
  }
  const rows = await found.json();

  // 행이 없으면 만들고 역할을 학생으로 둔다.
  if (rows.length === 0) {
    const created = await db('users', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        github_id: who.githubId,
        auth_id: who.authId,
        name: who.displayName,
        role: 'student'
      })
    });
    if (!created.ok) {
      return response.status(500).json({ error: '사용자를 만들지 못했습니다.' });
    }

    const [made] = await created.json();
    return response.status(200).json({ name: made.name, role: made.role });
  }

  const row = rows[0];

  // 이미 채워진 인증 식별자를 다시 쓰지 않는다. 값이 갈리면 그 행의 주인이 바뀐다.
  if (row.auth_id && row.auth_id !== who.authId) {
    return response.status(409).json({ error: '이미 다른 계정에 연결된 사용자입니다.' });
  }

  // 인증 식별자가 비어 있으면 채운다. 두 열을 잇는 것이 이 첫 로그인이다.
  if (!row.auth_id) {
    const filled = await db(`users?github_id=eq.${encodeURIComponent(who.githubId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ auth_id: who.authId })
    });
    if (!filled.ok) {
      return response.status(500).json({ error: '인증 식별자를 기록하지 못했습니다.' });
    }
  }

  return response.status(200).json({ name: row.name, role: row.role });
}

module.exports = async (request, response) => {
  const action = request.query.action;

  if (action === 'signin') {
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'signin은 POST로 보냅니다.' });
    }
    return signin(request, response);
  }

  return response.status(400).json({
    error: `처리할 수 없는 요청입니다: ${action || '(없음)'}`
  });
};
