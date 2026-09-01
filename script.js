// 생성: 2026-08-13 23:09 KST
'use strict';

const QUIZ_LENGTH = 10;
const ALL_COUNTS = [3, 3, 2, 2];
const DIFFICULTY_LABELS = { easy: '초급', medium: '중급', hard: '고급' };
const CATEGORY_LIMIT = 5;
const ALL_LIMIT = 10;
const STORAGE_KEY = 'quizGameRankings';
const TOKEN_KEY = 'quizGameToken';
const EXPIRY_BANNER_MS = 5 * 60 * 1000;   // 남은 시간이 이보다 적으면 배너를 띄운다
const EXPIRY_BLOCK_MS = 10 * 60 * 1000;   // 남은 시간이 이보다 적으면 판 시작을 막는다
const EXPIRY_TICK_MS = 30 * 1000;         // 남은 시간을 다시 세는 주기
const PROBE_KEY = 'quizGameStorageProbe';
const ALL_KEY = 'all';

/**
 * 게임 상태. 3단계에서 quiz, index, score가 더해진다.
 * "이미 답했는가" 플래그는 두지 않는다. 재선택은 선택지 버튼의 disabled가 막는다.
 */
const state = {
  playerName: '',
  role: null,
  mode: null,
  categoryId: null,
  quiz: [],
  index: 0,
  score: 0
};

/**
 * 문제 데이터를 검사해 위반 내용을 문자열 배열로 돌려준다.
 * 위반이 없으면 빈 배열이다. 화면에는 일반 문구만 띄우고,
 * 어느 문제가 어떻게 틀렸는지는 이 배열을 콘솔에 출력해 알린다.
 */
function validateData() {
  const errors = [];

  if (typeof CATEGORIES === 'undefined' || !Array.isArray(CATEGORIES)) {
    errors.push('CATEGORIES가 배열로 정의되지 않았습니다');
  }
  if (typeof QUESTIONS === 'undefined' || QUESTIONS === null || typeof QUESTIONS !== 'object') {
    errors.push('QUESTIONS가 객체로 정의되지 않았습니다');
  }
  if (errors.length > 0) {
    return errors;
  }

  const seenIds = new Set();
  const seenQuestions = new Set();

  CATEGORIES.forEach(function (category) {
    const list = QUESTIONS[category.id];

    if (!Array.isArray(list)) {
      errors.push(category.id + ': QUESTIONS에 문제 배열이 없습니다');
      return;
    }
    if (list.length < QUIZ_LENGTH) {
      errors.push(category.id + ': 문제 수가 ' + list.length + '입니다. ' + QUIZ_LENGTH + ' 이상이어야 합니다');
    }

    list.forEach(function (q, i) {
      const label = typeof q.id === 'string' && q.id !== '' ? q.id : category.id + '[' + i + ']';

      if (typeof q.id !== 'string' || q.id.trim() === '') {
        errors.push(label + ': id가 비어 있음');
      } else if (seenIds.has(q.id)) {
        errors.push(label + ': id 중복');
      } else {
        seenIds.add(q.id);
      }

      if (typeof q.question !== 'string' || q.question.trim() === '') {
        errors.push(label + ': question이 비어 있음');
      } else if (seenQuestions.has(q.question)) {
        errors.push(label + ': question 텍스트 중복');
      } else {
        seenQuestions.add(q.question);
      }

      // 길이 두 검사는 PRD 3.6절이 못박은 규칙인데 확인하는 자리가 없었다.
      // 중복 검사와 달리 else if로 잇지 않는다. 중복이면서 길기도 한 문항을
      // 한 번에 다 보고해야 고치는 사람이 두 번 돌리지 않는다.
      if (typeof q.question === 'string' && q.question.length > 60) {
        errors.push(label + ': question이 ' + q.question.length + '자');
      }

      if (typeof q.explanation !== 'string' || q.explanation.trim() === '') {
        errors.push(label + ': explanation이 비어 있음');
      }

      if (!Array.isArray(q.options)) {
        errors.push(label + ': options가 배열이 아님');
      } else if (q.options.length !== 4) {
        errors.push(label + ': options 길이가 ' + q.options.length);
      } else {
        q.options.forEach(function (option, index) {
          if (typeof option !== 'string' || option.trim() === '') {
            errors.push(label + ': options[' + index + ']가 비어 있음');
          } else if (option.length > 20) {
            errors.push(label + ': options[' + index + ']가 ' + option.length + '자');
          }
        });
        // 값이 아니라 인덱스로 판정한다. find는 중복 값이 undefined일 때
        // undefined를 돌려주어 "못 찾음"과 구별되지 않는다.
        const duplicatedIndex = q.options.findIndex(function (option, index) {
          return q.options.indexOf(option) !== index;
        });
        if (duplicatedIndex !== -1) {
          errors.push(label + ": options에 중복된 선택지 '" + q.options[duplicatedIndex] + "'");
        }
      }

      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) {
        errors.push(label + ': answer가 0 이상 3 이하의 정수가 아님 (' + JSON.stringify(q.answer) + ')');
      }

      if (!Object.prototype.hasOwnProperty.call(DIFFICULTY_LABELS, q.difficulty)) {
        errors.push(label + ": difficulty가 '" + q.difficulty + "'");
      }
    });
  });

  return errors;
}

/** 데이터를 쓸 수 없음을 화면에 알린다. 이 뒤로 게임 시작 경로를 잇지 않는다. */
function showDataError() {
  document.getElementById('data-error').hidden = false;
}

/**
 * 네 화면 전체를 감추고 대상만 드러낸 뒤 그 화면의 제목으로 초점을 옮긴다.
 * visibility나 투명도를 쓰지 않는다. hidden이라야 감춘 화면이
 * 스크린리더와 탭 순서에서 빠진다(PRD 3.0절).
 *
 * moveFocus에 false를 넘기면 초점을 옮기지 않는다. 퀴즈 화면은 진입 직후
 * renderQuestion이 문제 텍스트로 초점을 잡으므로, 제목을 거치면 초점이
 * 두 번 움직여 스크린리더가 제목을 읽다 끊긴다(PRD 4.3절).
 */
function showScreen(screenId, moveFocus) {
  document.querySelectorAll('.screen').forEach(function (section) {
    section.hidden = section.id !== screenId;
  });
  if (moveFocus !== false) {
    document.querySelector('#' + screenId + ' .title').focus();
  }
}

/** CATEGORIES를 돌며 카드 버튼을 그린다. 문제 수는 QUIZ_LENGTH에서 조립한다. */
function renderCategoryCards() {
  const container = document.getElementById('category-cards');
  container.textContent = '';

  CATEGORIES.forEach(function (category) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';

    const name = document.createElement('span');
    name.className = 'card-name';
    name.textContent = category.name;

    const count = document.createElement('span');
    count.className = 'card-count';
    count.textContent = QUIZ_LENGTH + '문제';

    card.appendChild(name);
    card.appendChild(count);
    card.addEventListener('click', function () {
      startGame('category', category.id);
    });
    container.appendChild(card);
  });
}

/* 로그인 --------------------------------------------------------------------
 * 라이브러리를 쓰지 않는다(계획서 결정 1). 인증 서비스의 깃허브 인증 경로로
 * 보내고, 돌아온 주소에서 토큰을 직접 꺼내 쓴다.
 */

/**
 * 프로젝트 주소, 공개 키, 깃허브 인증 경로를 서버에서 받는다.
 * 이 요청만 로그인을 요구하지 않는다(계획서 결정 6).
 */
function loadConfig() {
  return fetch('/api/questions?action=config').then(function (res) {
    if (!res.ok) {
      throw new Error('설정을 받지 못했습니다.');
    }
    return res.json();
  });
}

/**
 * 로그인을 마치고 돌아온 주소에서 토큰을 꺼낸다.
 * 꺼낸 뒤 주소창에서 지운다. 지우지 않으면 새로고침이나 주소 공유로 흘러 나간다.
 */
function takeTokenFromUrl() {
  if (location.hash === '') {
    return null;
  }

  const params = new URLSearchParams(location.hash.slice(1));
  const token = params.get('access_token');

  if (token === null) {
    return null;
  }

  history.replaceState(null, '', location.pathname + location.search);
  return token;
}

/** 토큰은 sessionStorage에 둔다. 새로고침에는 남고 탭을 닫으면 사라진다. */
function readToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

/** 서버 함수와 DB 요청의 헤더에 토큰을 싣는다. */
function authHeaders() {
  return { Authorization: 'Bearer ' + readToken() };
}

/**
 * 깃허브 인증 경로로 보낸다. 돌아올 주소를 함께 실어야 한다.
 * 싣지 않으면 인증 서비스가 Site URL로 보내며, 그 값은 localhost:3000이다.
 */
function goToGithubLogin() {
  const error = document.getElementById('login-error');

  loadConfig().then(function (config) {
    const back = location.origin + location.pathname;
    location.href = config.githubAuthPath + '&redirect_to=' + encodeURIComponent(back);
  }).catch(function () {
    error.textContent = '로그인하지 못했습니다. 다시 시도해 주세요.';
    error.hidden = false;
  });
}

/**
 * 로그인한 사람의 행을 찾아 인증 식별자를 기록하고 이름과 역할을 받는다.
 * 이 요청을 건너뛰면 그 뒤가 전부 막힌다. 인증 식별자가 비어 있는 행은
 * 정책이 접근을 허용하지 않아 브라우저가 자기 기록조차 조회하지 못한다.
 */
function callSignin() {
  return fetch('/api/users?action=signin', {
    method: 'POST',
    headers: authHeaders()
  }).then(function (res) {
    if (res.status === 401) {
      throw new Error('expired');
    }
    if (!res.ok) {
      throw new Error('로그인을 마치지 못했습니다.');
    }
    return res.json();
  });
}

/** 로그인한 사용자의 이름과 역할을 화면에 반영하고 시작 화면을 보인다. */
function applySignedIn(user) {
  state.playerName = user.name;
  state.role = user.role;

  document.getElementById('user-name').textContent = user.name;

  // 버튼을 감추는 것은 안내이지 통제가 아니다. 통제는 서버 함수가 한다.
  document.getElementById('btn-open-teacher').hidden = user.role !== 'teacher';

  showScreen('screen-start');

  refreshExpiryBanner();
  window.setInterval(refreshExpiryBanner, EXPIRY_TICK_MS);
}

/** 토큰을 지우고 로그인 화면으로 돌아간다. */
function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  state.playerName = '';
  state.role = null;
  refreshExpiryBanner();
  showScreen('screen-login');
}

/* 로그인 만료 안내 ---------------------------------------------------------
 * 갱신을 만들지 않는다(계획서 결정 1). 토큰 안에 만료 시각이 있으므로
 * 남은 시간은 셀 수 있다.
 */

/**
 * 토큰에서 만료 시각을 읽어 남은 시간을 밀리초로 돌려준다.
 * 토큰은 점으로 나뉜 세 토막이고 가운데 토막이 base64로 인코딩된 JSON이다.
 * 그 안의 exp가 만료 시각이며 초 단위다.
 */
function millisecondsLeft() {
  const token = readToken();
  if (token === null) {
    return 0;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return 0;
  }

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload.exp !== 'number') {
      return 0;
    }
    return payload.exp * 1000 - Date.now();
  } catch (error) {
    return 0;
  }
}

/** 남은 시간이 5분 아래면 배너를 띄우고, 아니면 감춘다. */
function refreshExpiryBanner() {
  const banner = document.getElementById('session-expiry');
  const left = millisecondsLeft();

  if (state.playerName === '' || left > EXPIRY_BANNER_MS) {
    banner.hidden = true;
    banner.textContent = '';
    return;
  }

  // 이미 지난 뒤에는 "곧"이 아니다. 판 도중에는 401을 받을 요청이 없어
  // 배너가 만료를 알리는 유일한 자리다.
  banner.textContent = left <= 0
    ? '로그인이 만료되었습니다. 다시 로그인해 주세요.'
    : '로그인이 곧 만료됩니다. 다시 로그인해 주세요.';
  banner.hidden = false;
}

/**
 * 서버가 401을 보내면 로그인이 만료된 것이다.
 * 토큰을 지우고 로그인 화면으로 보낸다.
 */
function handleExpired() {
  sessionStorage.removeItem(TOKEN_KEY);
  state.playerName = '';
  state.role = null;
  refreshExpiryBanner();
  showLoginScreen('로그인이 만료되었습니다. 다시 로그인해 주세요.');
}

/** 로그인 화면을 띄우고 안내 문구를 낸다. */
function showLoginScreen(message) {
  const error = document.getElementById('login-error');

  if (message === undefined) {
    error.textContent = '';
    error.hidden = true;
  } else {
    error.textContent = message;
    error.hidden = false;
  }

  showScreen('screen-login');
}

/** Fisher-Yates로 섞은 새 배열을 돌려준다. 원본은 건드리지 않는다. */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 선택지를 섞고 정답 텍스트의 새 자리로 answer를 갱신한 새 객체를 만든다.
 * 갱신을 빠뜨려도 화면은 정상으로 보이고 채점만 조용히 틀린다.
 * 원본을 제자리에서 섞으면 다음 판의 데이터까지 오염되므로 새 배열을 만든다.
 */
function prepareQuestion(q, category) {
  const answerText = q.options[q.answer];
  const options = shuffle(q.options);

  return {
    id: q.id,
    question: q.question,
    options: options,
    answer: options.indexOf(answerText),
    difficulty: q.difficulty,
    explanation: q.explanation,
    categoryName: category.name
  };
}

/** 고른 카테고리에서 QUIZ_LENGTH문제를 뽑는다. */
function pickCategoryQuiz(categoryId) {
  const category = CATEGORIES.find(function (c) {
    return c.id === categoryId;
  });

  return shuffle(QUESTIONS[categoryId])
    .slice(0, QUIZ_LENGTH)
    .map(function (q) {
      return prepareQuestion(q, category);
    });
}

/**
 * 카테고리 순서를 섞어 3, 3, 2, 2문제를 뽑고 합친 결과를 다시 섞는다.
 * 마지막 셔플을 빠뜨리면 카테고리 순서대로 출제된다. 뽑기와 최종 순서 섞기는 별개다.
 */
function pickAllQuiz() {
  const picked = [];

  shuffle(CATEGORIES).forEach(function (category, i) {
    shuffle(QUESTIONS[category.id])
      .slice(0, ALL_COUNTS[i])
      .forEach(function (q) {
        picked.push(prepareQuestion(q, category));
      });
  });

  return shuffle(picked);
}

/**
 * 로그인한 상태에서만 판을 시작한다.
 * 이름은 로그인할 때 서버가 돌려준 값이다. 입력란에서 읽지 않는다.
 */
function startGame(mode, categoryId) {
  if (state.playerName === '') {
    showLoginScreen('게임을 시작하려면 로그인해 주세요.');
    return;
  }

  // 판 도중에 만료되면 그 판을 버린다. 이어 하기가 없으므로 시작 전에 막는다.
  if (millisecondsLeft() < EXPIRY_BLOCK_MS) {
    alert('남은 로그인 시간이 한 판을 마치기에 모자랍니다. 먼저 다시 로그인해 주세요.');
    return;
  }

  state.mode = mode;
  state.categoryId = categoryId;
  state.quiz = mode === 'all' ? pickAllQuiz() : pickCategoryQuiz(categoryId);
  state.index = 0;
  state.score = 0;

  // 초점은 renderQuestion이 문제 텍스트로 잡는다. 제목을 거치지 않는다(PRD 4.3절).
  showScreen('screen-quiz', false);
  renderQuestion();
  enableUnloadGuard();
}

/** 현재 문제를 그린다. 피드백과 "다음 문제"는 감추고 문제 텍스트로 초점을 옮긴다. */
function renderQuestion() {
  const question = state.quiz[state.index];

  document.getElementById('quiz-progress').textContent =
    (state.index + 1) + ' / ' + QUIZ_LENGTH + ' 문제';
  document.getElementById('quiz-score').textContent =
    '점수 ' + state.score + ' / ' + QUIZ_LENGTH;
  document.getElementById('quiz-category').textContent = question.categoryName;

  const badge = document.getElementById('quiz-difficulty');
  badge.textContent = DIFFICULTY_LABELS[question.difficulty];
  badge.className = 'badge diff-' + question.difficulty;

  document.getElementById('question-text').textContent = question.question;

  const container = document.getElementById('options');
  container.textContent = '';
  question.options.forEach(function (option, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    button.textContent = option;
    button.addEventListener('click', function () {
      handleAnswer(index);
    });
    container.appendChild(button);
  });

  const feedback = document.getElementById('feedback');
  feedback.textContent = '';
  feedback.hidden = true;
  document.getElementById('btn-next').hidden = true;

  document.getElementById('question-text').focus();
}

/**
 * 채점하고 강조와 해설을 표시한다.
 * 맨 앞에 "이미 답했는가" 가드를 두지 않는다. 재선택은 disabled가 막는다.
 */
function handleAnswer(choiceIndex) {
  const question = state.quiz[state.index];
  const buttons = Array.from(document.querySelectorAll('#options .option'));
  const isCorrect = choiceIndex === question.answer;

  if (isCorrect) {
    state.score += 1;
    document.getElementById('quiz-score').textContent =
      '점수 ' + state.score + ' / ' + QUIZ_LENGTH;
  }

  buttons.forEach(function (button) {
    button.disabled = true;
  });

  // 색만으로 구분하지 않는다. 기호를 함께 붙인다.
  buttons[question.answer].classList.add('option-correct');
  buttons[question.answer].textContent = question.options[question.answer] + ' ✓';

  if (!isCorrect) {
    buttons[choiceIndex].classList.add('option-wrong');
    buttons[choiceIndex].textContent = question.options[choiceIndex] + ' ✗';
  }

  const feedback = document.getElementById('feedback');
  feedback.textContent = '';

  const verdict = document.createElement('p');
  verdict.className = 'feedback-verdict';
  verdict.textContent = isCorrect
    ? '정답입니다.'
    : '오답입니다. 정답은 ' + question.options[question.answer] + '입니다.';

  const explanation = document.createElement('p');
  explanation.className = 'feedback-explanation';
  explanation.textContent = question.explanation;

  feedback.appendChild(verdict);
  feedback.appendChild(explanation);
  feedback.hidden = false;
  feedback.focus();

  const next = document.getElementById('btn-next');
  next.textContent = state.index === QUIZ_LENGTH - 1 ? '결과 보기' : '다음 문제';
  next.hidden = false;
  // 해설이 펼쳐지면 모바일에서 버튼이 화면 밖으로 밀린다. 눌러야 넘어가는 구조라
  // 그대로 두면 게임이 멈춘 것처럼 보인다.
  next.scrollIntoView({ block: 'end' });
}

/** 다음 문제로 넘어간다. 마지막이면 결과 화면으로 간다. */
function goNext() {
  // 즉시 감춰 연타로 문제를 건너뛰는 것을 막는다.
  document.getElementById('btn-next').hidden = true;

  state.index += 1;
  if (state.index >= QUIZ_LENGTH) {
    finishGame();
    return;
  }

  renderQuestion();
  // 앞 문제에서 내려간 위치를 그대로 두면 다음 문제가 중간부터 보인다.
  document.getElementById('screen-quiz').scrollIntoView({ block: 'start' });
}

/** 확인창을 띄우고 확인하면 기록을 남기지 않은 채 시작 화면으로 돌아간다. */
function quitGame() {
  if (!confirm('진행 중인 게임을 그만두시겠습니까? 기록은 남지 않습니다.')) {
    return;
  }

  disableUnloadGuard();
  showScreen('screen-start');
}

/**
 * 이탈 경고. 등록은 판을 시작할 때, 해제는 결과 화면 진입과 그만두기 확인 두 곳뿐이다.
 * 확인창 문구는 지정할 수 없다. 모든 최신 브라우저가 커스텀 메시지를 무시한다.
 * Safari는 beforeunload를 지원하지 않아 동작하지 않는다(PRD 4.1절).
 */
function handleBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = '';
}

function enableUnloadGuard() {
  window.addEventListener('beforeunload', handleBeforeUnload);
}

function disableUnloadGuard() {
  window.removeEventListener('beforeunload', handleBeforeUnload);
}

/**
 * 로컬 시간대 기준 YYYY-MM-DD를 만든다.
 * toISOString().slice(0, 10)을 쓰지 않는다(R4). UTC 기준이라 한국 시간
 * 오전 9시 이전에는 전날 날짜가 찍히고, 화면으로는 알아채기 어렵다.
 * 인자를 받는 것은 시스템 시계를 바꾸지 않고 새벽 시각을 검증하기 위해서다.
 */
function formatDate(date) {
  const target = date || new Date();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return target.getFullYear() + '-' + month + '-' + day;
}

/** 다섯 키가 모두 빈 배열인 객체. 카테고리 넷과 전 범위 하나다. */
function emptyRankings() {
  const data = {};
  CATEGORIES.forEach(function (category) {
    data[category.id] = [];
  });
  data[ALL_KEY] = [];
  return data;
}

/**
 * 순위표 하나를 리스트 단위로 판정한다. 한 항목이라도 형태가 어긋나면
 * 그 목록만 비운다. 다섯 개를 한꺼번에 비우지 않는다(PRD 4.2절 4번).
 */
function sanitizeList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const valid = value.every(function (item) {
    return item !== null && typeof item === 'object' &&
      typeof item.name === 'string' &&
      typeof item.score === 'number' &&
      typeof item.total === 'number' &&
      typeof item.date === 'string';
  });

  return valid ? value : [];
}

/** 저장소에서 읽는다. 접근이나 파싱 자체가 막히면 null이다. */
function readRankings() {
  let raw;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }

  if (raw === null) {
    return emptyRankings();
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return emptyRankings();
  }

  if (parsed === null || typeof parsed !== 'object') {
    return emptyRankings();
  }

  const data = emptyRankings();
  Object.keys(data).forEach(function (key) {
    data[key] = sanitizeList(parsed[key]);
  });
  return data;
}

/**
 * 저장소에 쓸 수 있는지 시험한다.
 * 읽기 성공만으로는 판정할 수 없다. 읽기는 되고 쓰기만 막히는 경우가 흔하고,
 * 그 상태에서는 한 판도 안 한 사용자에게 저장 불가가 전달될 통로가 없다.
 * 순위 기록을 건드리지 않도록 별도 키로 시험하고 곧바로 지운다.
 */
function canWriteRankings() {
  try {
    localStorage.setItem(PROBE_KEY, '1');
    localStorage.removeItem(PROBE_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

/** 저장소에 쓴다. 실패는 예외로 오므로 성공 여부만 돌려준다. */
function writeRankings(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 읽기 → 삽입 → 정렬 → 자르기 → 쓰기.
 * 정수 인덱스, null(미진입), 'unavailable'(저장 불가) 셋 중 하나를 돌려준다.
 */
function saveRanking(key, record) {
  // 화면에 들어올 때 읽어 둔 값을 쓰지 않는다. 두 탭에서 각각 플레이할 때
  // 나중 저장이 앞선 저장을 덮어쓰는 것을 늦은 읽기로 줄인다.
  const data = readRankings();
  if (data === null) {
    return 'unavailable';
  }

  const list = data[key];
  list.unshift(record);
  // 동점 처리를 넣지 않는다. sort가 안정 정렬이라 맨 앞 삽입만으로
  // 동점이면 최근 기록이 위에 온다(PRD 3.4절).
  list.sort(function (a, b) {
    return b.score - a.score;
  });
  data[key] = list.slice(0, key === ALL_KEY ? ALL_LIMIT : CATEGORY_LIMIT);

  if (!writeRankings(data)) {
    return 'unavailable';
  }

  // 이름과 점수로 찾지 않는다(R3). 같은 이름, 같은 점수의 기록과 구별되지 않는다.
  const index = data[key].indexOf(record);
  return index === -1 ? null : index;
}

/** 저장 키를 통째로 지운다. */
function clearAllRankings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 순위, 이름, 점수, 날짜 네 열의 표를 그린다.
 * 순위 번호는 동점이어도 줄 순서대로 매긴다. 강조는 highlightIndex로만 건다.
 */
function renderRankingTable(container, list, highlightIndex) {
  container.textContent = '';

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'ranking-empty';
    empty.textContent = '아직 기록이 없습니다.';
    container.appendChild(empty);
    return;
  }

  const table = document.createElement('table');
  table.className = 'ranking-table';

  const head = document.createElement('tr');
  ['순위', '이름', '점수', '날짜'].forEach(function (label) {
    const th = document.createElement('th');
    // 헤더 행이 본문과 같은 그룹에 놓이므로 scope로 열 머리임을 밝힌다.
    th.scope = 'col';
    th.textContent = label;
    head.appendChild(th);
  });
  table.appendChild(head);

  list.forEach(function (record, index) {
    const row = document.createElement('tr');
    if (index === highlightIndex) {
      row.className = 'ranking-row-highlight';
    }

    const cells = [
      String(index + 1),
      record.name,
      record.score + ' / ' + record.total,
      record.date
    ];
    cells.forEach(function (text) {
      const td = document.createElement('td');
      td.textContent = text;
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  container.appendChild(table);
}

/** 결과 화면을 그린다. 순위 진입 여부는 saveResult 값으로만 판단한다. */
function renderResult(saveResult) {
  document.getElementById('result-score').textContent =
    state.score + ' / ' + QUIZ_LENGTH + ' 정답';
  document.getElementById('result-rate').textContent =
    '정답률 ' + Math.round(state.score / QUIZ_LENGTH * 100) + '%';

  const modeLabel = state.mode === 'all'
    ? '전 범위 도전'
    : CATEGORIES.find(function (category) {
        return category.id === state.categoryId;
      }).name + ' 도전';
  document.getElementById('result-player').textContent =
    state.playerName + ' — ' + modeLabel;

  const message = document.getElementById('result-rank-message');
  const ranking = document.getElementById('result-ranking');
  const notice = document.getElementById('result-storage-notice');

  if (saveResult === 'unavailable') {
    // 진입 여부를 표시하지 않는다. 만점자에게 "들지 못했습니다."가 뜨면 거짓이다.
    message.textContent = '';
    ranking.hidden = true;
    notice.hidden = false;
    return;
  }

  notice.hidden = true;
  ranking.hidden = false;
  message.textContent = saveResult === null
    ? '순위표에 들지 못했습니다.'
    : '순위표 ' + (saveResult + 1) + '위 진입';

  // saveRanking은 인덱스만 돌려주므로 목록은 여기서 다시 읽는다(PRD 3.4절 계약 유지).
  const data = readRankings();
  const key = state.mode === 'all' ? ALL_KEY : state.categoryId;
  renderRankingTable(ranking, data === null ? [] : data[key], saveResult);
}

/** 순위표 화면을 그린다. 저장소를 못 쓰면 표와 지우기 버튼을 함께 감춘다. */
function renderRankingScreen() {
  const data = readRankings();
  const tables = document.getElementById('ranking-tables');
  const clearButton = document.getElementById('btn-clear');
  const notice = document.getElementById('ranking-storage-notice');
  const persistNotice = document.getElementById('ranking-persist-notice');
  const storageOk = data !== null && canWriteRankings();

  // "사라질 수 있습니다"는 저장이 된다는 전제로 쓰인 문장이다. 저장이 아예 막힌
  // 상태에서 이 문장만 남으면 사실과 반대되는 안심을 준다.
  persistNotice.hidden = !storageOk;
  notice.hidden = storageOk;

  if (data === null) {
    // 읽기조차 막힌 상태다. 지울 것이 없는데 버튼만 남으면 눌러도 아무 일이 없어
    // 고장으로 보인다.
    tables.hidden = true;
    clearButton.hidden = true;
    return;
  }

  // 읽기는 되고 쓰기만 막히는 경우. 표는 그대로 그린다. 기존 기록이 있을 수 있고,
  // 용량이 차서 막힌 것이라면 "기록 지우기"가 그 상황을 푸는 수단이다.
  tables.hidden = false;
  clearButton.hidden = false;
  tables.textContent = '';

  const groups = CATEGORIES.map(function (category) {
    return { key: category.id, name: category.name };
  });
  groups.push({ key: ALL_KEY, name: '전 범위' });

  groups.forEach(function (group) {
    const section = document.createElement('section');
    section.className = 'ranking-group';

    const heading = document.createElement('h3');
    heading.textContent = group.name;
    section.appendChild(heading);

    const holder = document.createElement('div');
    renderRankingTable(holder, data[group.key], -1);
    section.appendChild(holder);

    tables.appendChild(section);
  });
}

/** 판을 마친다. 이탈 경고를 끄고 순위를 저장한 뒤 결과 화면을 그린다. */
function finishGame() {
  disableUnloadGuard();

  const key = state.mode === 'all' ? ALL_KEY : state.categoryId;
  const saveResult = saveRanking(key, {
    name: state.playerName,
    score: state.score,
    total: QUIZ_LENGTH,
    date: formatDate()
  });

  renderResult(saveResult);
  showScreen('screen-result');
}

/** 페이지 로드 시 한 번 실행한다. 검사를 통과해야 그 뒤 초기화가 이어진다. */
function init() {
  const errors = validateData();

  if (errors.length > 0) {
    errors.forEach(function (message) {
      console.error(message);
    });
    console.error('데이터 검사 실패: ' + errors.length + '건. 게임을 시작하지 않는다.');
    showDataError();
    showLoginScreen();
    return;
  }

  renderCategoryCards();

  const allButton = document.getElementById('btn-all');
  allButton.textContent = '전 범위 도전 (' + QUIZ_LENGTH + '문제)';
  allButton.addEventListener('click', function () {
    startGame('all', null);
  });

  document.getElementById('btn-login-github').addEventListener('click', goToGithubLogin);
  document.getElementById('btn-logout').addEventListener('click', logout);

  document.getElementById('btn-open-ranking').addEventListener('click', function () {
    renderRankingScreen();
    showScreen('screen-ranking');
  });
  document.getElementById('btn-close-ranking').addEventListener('click', function () {
    showScreen('screen-start');
  });

  document.getElementById('btn-clear').addEventListener('click', function () {
    if (!confirm('저장된 순위 기록을 모두 지우시겠습니까?')) {
      return;
    }
    clearAllRankings();
    renderRankingScreen();
  });

  document.getElementById('btn-retry').addEventListener('click', function () {
    startGame(state.mode, state.categoryId);
  });
  document.getElementById('btn-home').addEventListener('click', function () {
    showScreen('screen-start');
  });

  document.getElementById('btn-quit').addEventListener('click', quitGame);
  document.getElementById('btn-next').addEventListener('click', goNext);

  restoreLogin();
}

/**
 * 로그인 상태를 정하고 첫 화면을 띄운다.
 * 돌아온 주소에 토큰이 있으면 저장하고, 없으면 sessionStorage의 것을 쓴다.
 * 토큰이 없으면 로그인 화면에서 멈춘다.
 */
function restoreLogin() {
  const fresh = takeTokenFromUrl();

  if (fresh !== null) {
    sessionStorage.setItem(TOKEN_KEY, fresh);
  }

  if (readToken() === null) {
    showLoginScreen();
    return;
  }

  callSignin().then(applySignedIn).catch(function (error) {
    if (error.message === 'expired') {
      handleExpired();
      return;
    }
    sessionStorage.removeItem(TOKEN_KEY);
    showLoginScreen('로그인하지 못했습니다. 다시 시도해 주세요.');
  });
}

document.addEventListener('DOMContentLoaded', init);
