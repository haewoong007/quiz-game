// 문항과 설정을 다루는 서버 함수
// 생성: 2026-08-31 21:44 KST
//
// 2차 구현 2단계에서는 config만 만든다. start는 구현 3단계다.
// 요청은 쿼리 문자열의 action으로 가른다.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

// config — 브라우저가 로그인을 시작하는 데 필요한 값을 돌려준다.
// 이 요청만 로그인을 요구하지 않는다(계획서 결정 6).
// 로그인한 요청만 받는 함수에 두면 아무도 로그인을 시작할 수 없기 때문이다.
// 공개 키는 그 자체로 아무 권한도 주지 않는다(PRD 4.4절).
function config(response) {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return response.status(500).json({ error: '서버 설정이 갖춰지지 않았습니다.' });
  }

  return response.status(200).json({
    url: SUPABASE_URL,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
    githubAuthPath: `${SUPABASE_URL}/auth/v1/authorize?provider=github`
  });
}

module.exports = (request, response) => {
  const action = request.query.action;

  if (action === 'config') {
    return config(response);
  }

  return response.status(400).json({
    error: `처리할 수 없는 요청입니다: ${action || '(없음)'}`
  });
};
