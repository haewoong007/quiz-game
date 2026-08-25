// 생성: 2026-08-13 23:09 KST

const CATEGORIES = [
  { id: 'korean_history', name: '한국사' },
  { id: 'science',        name: '과학' },
  { id: 'geography',      name: '지리' },
  { id: 'art_culture',    name: '예술과 문화' }
];

const QUESTIONS = {
  korean_history: [
    {
      id: 'kh_01',
      question: '조선을 건국한 인물은 누구인가?',
      options: ['이성계', '이방원', '최영', '왕건'],
      answer: 0,
      difficulty: 'easy',
      explanation: '이성계는 1392년 고려를 무너뜨리고 조선을 세워 태조가 되었다.'
    },
    {
      id: 'kh_02',
      question: '훈민정음을 창제한 조선의 왕은 누구인가?',
      options: ['성종', '세조', '세종', '정조'],
      answer: 2,
      difficulty: 'easy',
      explanation: '세종은 1443년 훈민정음을 만들고 1446년에 백성에게 반포했다.'
    },
    {
      id: 'kh_03',
      question: '삼국 통일을 완성한 신라의 왕은 누구인가?',
      options: ['진흥왕', '문무왕', '법흥왕', '무열왕'],
      answer: 1,
      difficulty: 'medium',
      explanation: '문무왕은 676년 당의 세력을 몰아내고 삼국 통일을 완성했다.'
    },
    {
      id: 'kh_04',
      question: '고려를 세운 인물은 누구인가?',
      options: ['궁예', '견훤', '왕건', '최승로'],
      answer: 2,
      difficulty: 'easy',
      explanation: '왕건은 918년 궁예를 몰아내고 왕위에 올라 나라 이름을 고려라 했다.'
    },
    {
      id: 'kh_05',
      question: '임진왜란 때 한산도 대첩을 이끈 장수는 누구인가?',
      options: ['권율', '이순신', '김시민', '원균'],
      answer: 1,
      difficulty: 'easy',
      explanation: '이순신은 1592년 한산도 앞바다에서 학익진으로 일본 수군을 크게 깨뜨렸다.'
    },
    {
      id: 'kh_06',
      question: '고구려 유민을 이끌고 발해를 세운 인물은 누구인가?',
      options: ['대조영', '장보고', '연개소문', '을지문덕'],
      answer: 0,
      difficulty: 'medium',
      explanation: '대조영은 698년 고구려 유민과 말갈족을 이끌고 동모산에서 발해를 세웠다.'
    },
    {
      id: 'kh_07',
      question: '조선의 의서 『동의보감』을 지은 사람은 누구인가?',
      options: ['정약용', '이제마', '허준', '유형원'],
      answer: 2,
      difficulty: 'medium',
      explanation: '허준은 선조의 명을 받아 조선과 중국의 의서를 두루 모아 『동의보감』을 엮었다.'
    },
    {
      id: 'kh_08',
      question: '1919년에 전국으로 퍼진 독립 만세 운동은 무엇인가?',
      options: ['6·10 만세 운동', '물산 장려 운동', '광주 학생 항일 운동', '3·1 운동'],
      answer: 3,
      difficulty: 'medium',
      explanation: '3·1 운동은 1919년 3월 1일 서울에서 시작해 전국과 국외로 퍼졌다.'
    },
    {
      id: 'kh_09',
      // 근거: 문항이 "반포한 왕"을 물으므로 시행(1485, 성종) 기준. 편찬 시작은 세조 때.
      question: '조선의 기본 법전인 『경국대전』을 반포한 왕은 누구인가?',
      options: ['태종', '세조', '중종', '성종'],
      answer: 3,
      difficulty: 'hard',
      explanation: '『경국대전』은 세조 때 편찬을 시작해 성종 때 반포되어 1485년부터 시행되었다.'
    },
    {
      id: 'kh_10',
      question: '몽골의 침입에 맞서 도읍을 강화도로 옮긴 집권자는 누구인가?',
      options: ['최우', '김부식', '정중부', '최충헌'],
      answer: 0,
      difficulty: 'hard',
      explanation: '무신 정권의 최우는 1232년 몽골의 침입을 피해 도읍을 개경에서 강화도로 옮겼다.'
    },
    {
      id: 'kh_11',
      question: '후연을 물리치고 요동을 차지한 고구려의 왕은 누구인가?',
      options: ['장수왕', '광개토대왕', '소수림왕', '고국천왕'],
      answer: 1,
      difficulty: 'easy',
      explanation: '광개토대왕은 후연과의 싸움에서 이겨 요동을 차지하고 동부여를 복속시켜 만주 일대를 세력권에 두었다.'
    },
    {
      id: 'kh_12',
      question: '1909년 하얼빈역에서 이토 히로부미를 저격한 인물은 누구인가?',
      options: ['안중근', '윤봉길', '이봉창', '김좌진'],
      answer: 0,
      difficulty: 'easy',
      explanation: '안중근은 1909년 10월 26일 하얼빈역에서 이토 히로부미를 저격했다. 블라디보스토크를 떠나 하얼빈으로 가 거사 장소를 정한 뒤였다.'
    },
    {
      id: 'kh_13',
      question: '수령이 지켜야 할 지침을 담은 『목민심서』를 지은 사람은 누구인가?',
      options: ['박지원', '정약용', '유형원', '홍대용'],
      answer: 1,
      difficulty: 'medium',
      explanation: '정약용이 강진 유배에서 풀려난 1818년에 완성한 책으로, 지방 수령이 백성을 다스리며 지켜야 할 일을 조목별로 적었다.'
    },
    {
      id: 'kh_14',
      question: '1897년 고종이 황제에 오르며 정한 나라 이름은?',
      options: ['조선', '대한민국', '대한제국', '고려'],
      answer: 2,
      difficulty: 'medium',
      explanation: '고종은 1897년 10월 11일 국호를 대한으로 정하고, 이튿날 환구단에서 황제 즉위식을 치른 뒤 10월 13일 대한제국 출범을 선포했다. 연호 광무는 그해 8월에 이미 제정되어 있었다.'
    },
    {
      id: 'kh_15',
      question: '당의 빈공과에 급제하고 「토황소격문」을 지은 신라의 학자는?',
      options: ['설총', '김대문', '강수', '최치원'],
      answer: 3,
      difficulty: 'hard',
      explanation: '최치원은 6두품 출신으로 당에 유학해 빈공과에 급제했고, 황소의 난 때 「토황소격문」을 지어 문장으로 이름을 알렸다.'
    }
  ],

  science: [
    {
      id: 'sc_01',
      question: '물 분자를 나타내는 화학식은 무엇인가?',
      options: ['CO2', 'H2O', 'O2', 'NaCl'],
      answer: 1,
      difficulty: 'easy',
      explanation: '물 분자는 수소 원자 두 개와 산소 원자 한 개로 이루어져 H2O로 적는다.'
    },
    {
      id: 'sc_02',
      question: '1기압에서 순수한 물이 끓는 온도는 몇 도인가?',
      options: ['0도', '50도', '80도', '100도'],
      answer: 3,
      difficulty: 'easy',
      explanation: '물은 100도에서 액체와 기체가 함께 있을 수 있고, 이 온도가 1기압에서의 끓는점이다.'
    },
    {
      id: 'sc_03',
      question: '태양계에서 지름이 가장 큰 행성은 무엇인가?',
      options: ['목성', '토성', '천왕성', '지구'],
      answer: 0,
      difficulty: 'easy',
      explanation: '목성은 지름이 지구의 약 11배로 태양계의 행성 가운데 가장 크다.'
    },
    {
      id: 'sc_04',
      question: '식물이 빛으로 양분을 만드는 과정을 무엇이라 하는가?',
      options: ['호흡', '증산', '광합성', '발효'],
      answer: 2,
      difficulty: 'easy',
      explanation: '광합성은 식물이 빛에너지로 이산화 탄소와 물에서 양분을 만드는 과정이다.'
    },
    {
      id: 'sc_05',
      question: '일반적으로 소리가 가장 빠르게 전달되는 물질의 상태는 무엇인가?',
      options: ['고체', '액체', '기체', '진공'],
      answer: 0,
      difficulty: 'medium',
      explanation: '소리는 대체로 고체에서 가장 빠르고 기체에서 가장 느리며, 진공에서는 전달되지 않는다.'
    },
    {
      id: 'sc_06',
      question: '공기 중에 부피 기준으로 가장 많이 들어 있는 기체는 무엇인가?',
      options: ['산소', '질소', '이산화 탄소', '수소'],
      answer: 1,
      difficulty: 'medium',
      explanation: '공기의 약 78%가 질소이고 산소는 약 21%다.'
    },
    {
      id: 'sc_07',
      question: '혈액에서 산소를 실어 나르는 세포는 무엇인가?',
      options: ['백혈구', '혈소판', '혈장', '적혈구'],
      answer: 3,
      difficulty: 'medium',
      explanation: '적혈구 속 헤모글로빈이 산소와 결합해 온몸으로 산소를 실어 나른다.'
    },
    {
      id: 'sc_08',
      question: '주기율표에서 원자 번호가 1번인 원소는 무엇인가?',
      options: ['헬륨', '산소', '수소', '탄소'],
      answer: 2,
      difficulty: 'medium',
      explanation: '수소는 원자핵에 양성자가 하나뿐이어서 원자 번호가 1이다.'
    },
    {
      id: 'sc_09',
      question: '빛이 프리즘을 지나 여러 색으로 나뉘는 현상은 무엇인가?',
      options: ['굴절', '분산', '반사', '회절'],
      answer: 1,
      difficulty: 'hard',
      explanation: '색마다 굴절되는 정도가 달라 흰빛이 여러 색으로 갈라지는데, 이를 분산이라 한다.'
    },
    {
      id: 'sc_10',
      // 근거: 주류 학설. 프랭클린의 X선 회절 자료가 결정적이었다는 평가는 정착했으나,
      //       구조를 밝혀 발표한 사람으로는 왓슨과 크릭이 표준 서술이다.
      question: 'DNA가 이중 나선 구조임을 밝힌 과학자는 누구인가?',
      options: ['왓슨과 크릭', '멘델과 다윈', '파스퇴르와 코흐', '퀴리와 러더퍼드'],
      answer: 0,
      difficulty: 'hard',
      explanation: '왓슨과 크릭은 1953년 DNA가 두 가닥이 꼬인 이중 나선 구조임을 밝혔다.'
    },
    {
      id: 'sc_11',
      question: '지진이 낸 에너지의 절대적 크기를 나타내는 값은 무엇인가?',
      options: ['규모', '진도', '진앙', '진원'],
      answer: 0,
      difficulty: 'easy',
      explanation: '규모는 지진이 낸 에너지의 크기라 재는 장소가 달라도 값이 같다. 진도는 어느 지점이 얼마나 흔들렸는지를 나타내 장소마다 다르다.'
    },
    {
      id: 'sc_12',
      question: '고체가 액체를 거치지 않고 바로 기체가 되는 현상은 무엇인가?',
      options: ['융해', '응고', '승화', '기화'],
      answer: 2,
      difficulty: 'easy',
      explanation: '드라이아이스가 녹지 않고 곧바로 기체가 되는 것이 승화다. 드라이아이스의 승화점은 영하 78.5도다.'
    },
    {
      id: 'sc_13',
      question: '버스가 급정거할 때 몸이 앞으로 쏠리는 까닭은 무엇인가?',
      options: ['마찰력', '관성', '중력', '부력'],
      answer: 1,
      difficulty: 'medium',
      explanation: '관성은 물체가 밖의 힘을 받지 않는 한 운동 상태를 지키려는 성질이다. 뉴턴의 운동 제1법칙이 이것을 정한다.'
    },
    {
      id: 'sc_14',
      question: '25도의 수용액에서 산성과 염기성을 가르는 pH 값은 얼마인가?',
      options: ['0', '5', '7', '14'],
      answer: 2,
      difficulty: 'medium',
      explanation: '25도의 순수한 물은 수소 이온과 수산화 이온의 양이 같아 pH가 7이다. 7보다 낮으면 산성이고 높으면 염기성이다.'
    },
    {
      id: 'sc_15',
      question: '원소를 원자량 순으로 배열해 주기율표를 만든 사람은 누구인가?',
      options: ['보어', '돌턴', '라부아지에', '멘델레예프'],
      answer: 3,
      difficulty: 'hard',
      explanation: '멘델레예프는 1869년 원소를 원자량 순으로 늘어놓으면 성질이 주기적으로 되풀이되는 것을 보였고, 빈칸에 들어갈 원소의 성질까지 예측했다.'
    }
  ],

  geography: [
    {
      id: 'ge_01',
      question: '우리나라에서 면적이 가장 큰 섬은 어디인가?',
      options: ['거제도', '울릉도', '제주도', '강화도'],
      answer: 2,
      difficulty: 'easy',
      explanation: '제주도는 본섬 면적이 약 1,833제곱킬로미터로 우리나라에서 가장 큰 섬이다.'
    },
    {
      id: 'ge_02',
      // 근거: 2020년 중국, 네팔 공동 재측량치. 이전 자료는 8,848m라 교과서에 따라 다르다.
      question: '해발 기준으로 세계에서 가장 높은 산은 무엇인가?',
      options: ['에베레스트산', 'K2', '킬리만자로산', '몽블랑산'],
      answer: 0,
      difficulty: 'easy',
      explanation: '에베레스트산은 2020년 재측량으로 확정된 해발 약 8,849미터로 가장 높다.'
    },
    {
      id: 'ge_03',
      question: '태평양과 대서양을 잇는 중앙아메리카의 운하는 무엇인가?',
      options: ['수에즈 운하', '킬 운하', '코린트 운하', '파나마 운하'],
      answer: 3,
      difficulty: 'medium',
      explanation: '파나마 운하는 1914년에 열려 두 대양을 오가는 뱃길을 크게 줄였다.'
    },
    {
      id: 'ge_04',
      // 근거: 510km는 유로연장(발원지~하구) 기준. 하천연장은 지정 구간만 재고
      // 그 기준으로는 한강이 더 길어 답이 뒤집힌다. 용어 대신 뜻을 풀어 적었다.
      question: '남한에서 가장 긴 강은 무엇인가?',
      options: ['한강', '낙동강', '금강', '섬진강'],
      answer: 1,
      difficulty: 'medium',
      explanation: '낙동강은 발원지에서 하구까지가 약 510킬로미터로 남한의 강 가운데 가장 길다.'
    },
    {
      id: 'ge_05',
      question: '오스트레일리아의 수도는 어디인가?',
      options: ['시드니', '멜버른', '캔버라', '브리즈번'],
      answer: 2,
      difficulty: 'medium',
      explanation: '오스트레일리아는 시드니와 멜버른이 수도를 두고 다투자 그 사이에 캔버라를 세웠다.'
    },
    {
      id: 'ge_06',
      question: '지구에서 가장 넓은 바다는 무엇인가?',
      options: ['태평양', '대서양', '인도양', '북극해'],
      answer: 0,
      difficulty: 'easy',
      explanation: '태평양은 지구에 있는 바다 넓이의 약 절반을 차지한다.'
    },
    {
      id: 'ge_07',
      question: '사하라 사막이 있는 대륙은 어디인가?',
      options: ['아시아', '아프리카', '남아메리카', '오세아니아'],
      answer: 1,
      difficulty: 'easy',
      explanation: '사하라 사막은 아프리카 북부에 걸쳐 있으며, 더운 사막 가운데 가장 넓다. 면적만 보면 남극이 세계에서 가장 넓은 사막이다.'
    },
    {
      id: 'ge_08',
      question: '경도 0도인 본초 자오선이 지나는 영국의 지역은 어디인가?',
      options: ['에든버러', '옥스퍼드', '케임브리지', '그리니치'],
      answer: 3,
      difficulty: 'hard',
      explanation: '본초 자오선은 런던 그리니치 천문대를 지나는 경도 0도의 기준선이다.'
    },
    {
      id: 'ge_09',
      question: '국토 면적이 세계에서 가장 넓은 나라는 어디인가?',
      options: ['러시아', '캐나다', '중국', '미국'],
      answer: 0,
      difficulty: 'medium',
      explanation: '러시아는 국토 면적이 약 1,710만 제곱킬로미터로 세계에서 가장 넓다.'
    },
    {
      id: 'ge_10',
      question: '화산과 지진이 잦은 태평양 가장자리를 무엇이라 부르는가?',
      options: ['판게아', '불의 고리', '대순환', '해구'],
      answer: 1,
      difficulty: 'hard',
      explanation: '태평양 가장자리를 따라 화산대와 지진대가 고리 모양으로 이어져 불의 고리라 부른다.'
    },
    {
      id: 'ge_11',
      question: '일 년 내내 기온이 높고 비가 많아 밀림이 발달하는 기후는?',
      options: ['사막 기후', '툰드라 기후', '열대 우림 기후', '지중해성 기후'],
      answer: 2,
      difficulty: 'easy',
      explanation: '열대 우림 기후는 가장 추운 달의 평균 기온이 18도를 넘고 비가 연중 고르게 내려 상록활엽수 밀림이 발달한다.'
    },
    {
      id: 'ge_12',
      question: '대한민국 영토 가운데 가장 동쪽에 있는 섬은 어디인가?',
      options: ['울릉도', '독도', '마라도', '백령도'],
      answer: 1,
      difficulty: 'easy',
      explanation: '독도는 동경 131도 52분에 있는 대한민국 최동단의 섬으로, 울릉도에서 동남쪽으로 87.4킬로미터 떨어져 있다.'
    },
    {
      id: 'ge_13',
      question: '염호를 포함해 면적이 세계에서 가장 넓은 호수는 무엇인가?',
      options: ['바이칼호', '슈피리어호', '빅토리아호', '카스피해'],
      answer: 3,
      difficulty: 'medium',
      explanation: '카스피해는 면적이 약 37만 제곱킬로미터로 세계에서 가장 넓은 호수다. 염분이 있어 바다라는 이름이 붙었고, 담수호 가운데 가장 넓은 것은 슈피리어호다.'
    },
    {
      id: 'ge_14',
      question: '동해안을 따라 남북으로 길게 뻗은 우리나라의 산맥은?',
      options: ['태백산맥', '소백산맥', '차령산맥', '노령산맥'],
      answer: 0,
      difficulty: 'medium',
      explanation: '태백산맥은 강원도에서 부산까지 한반도 동부를 남북으로 뻗은 약 500킬로미터의 산맥으로, 한강과 낙동강이 여기서 발원한다.'
    },
    {
      id: 'ge_15',
      question: '바다에서 수심이 가장 깊은 곳으로 알려진 해구는 어디인가?',
      options: ['일본 해구', '통가 해구', '마리아나 해구', '페루-칠레 해구'],
      answer: 2,
      difficulty: 'hard',
      explanation: '마리아나 해구의 챌린저 해연은 수심이 약 1만 1천 미터로 바다에서 가장 깊다. 측정에 따라 1만 935미터에서 1만 994미터로 값이 조금씩 다르다.'
    }
  ],

  art_culture: [
    {
      id: 'ac_01',
      question: '「모나리자」를 그린 화가는 누구인가?',
      options: ['라파엘로', '레오나르도 다빈치', '미켈란젤로', '보티첼리'],
      answer: 1,
      difficulty: 'easy',
      explanation: '레오나르도 다빈치는 16세기 초에 「모나리자」를 그렸고 지금은 루브르 박물관에 있다.'
    },
    {
      id: 'ac_02',
      question: '「해바라기」 연작을 그린 네덜란드 화가는 누구인가?',
      options: ['빈센트 반 고흐', '폴 고갱', '폴 세잔', '에드가 드가'],
      answer: 0,
      difficulty: 'easy',
      explanation: '반 고흐는 파리에서 1887년에 그리기 시작해 아를에서 화병에 꽂힌 「해바라기」 연작을 남겼다.'
    },
    {
      id: 'ac_03',
      question: '판소리에서 북으로 장단을 맞추는 사람을 무엇이라 하는가?',
      options: ['악사', '창자', '고수', '명창'],
      answer: 2,
      difficulty: 'medium',
      explanation: '고수는 북으로 장단을 짚고 추임새를 넣어 소리꾼의 소리를 받쳐 준다.'
    },
    {
      id: 'ac_04',
      question: '「운명」이라 불리는 교향곡 5번을 작곡한 사람은 누구인가?',
      options: ['모차르트', '하이든', '바흐', '베토벤'],
      answer: 3,
      difficulty: 'easy',
      explanation: '베토벤의 교향곡 5번은 첫머리 네 음이 운명이 문을 두드리는 소리에 비유되어 그렇게 불린다.'
    },
    {
      id: 'ac_05',
      question: '「씨름」과 「서당」을 그린 조선 후기의 화가는 누구인가?',
      options: ['김홍도', '신윤복', '정선', '장승업'],
      answer: 0,
      difficulty: 'medium',
      explanation: '김홍도는 「씨름」, 「서당」처럼 백성의 일상을 담은 풍속화를 여럿 남겼다.'
    },
    {
      id: 'ac_06',
      question: '조선 태조부터 철종까지의 역사를 날짜순으로 적은 책은?',
      options: ['승정원일기', '조선왕조실록', '직지심체요절', '동의보감'],
      answer: 1,
      difficulty: 'medium',
      explanation: '사관이 매일 적은 사초를 왕이 죽은 뒤 모아 엮었으며, 유네스코 세계기록유산이다.'
    },
    {
      id: 'ac_07',
      question: '『햄릿』과 『로미오와 줄리엣』을 쓴 영국의 극작가는?',
      options: ['찰스 디킨스', '제인 오스틴', '셰익스피어', '오스카 와일드'],
      answer: 2,
      difficulty: 'easy',
      explanation: '셰익스피어는 16세기 말부터 『햄릿』, 『로미오와 줄리엣』 등 여러 희곡을 썼다.'
    },
    {
      id: 'ac_08',
      question: '「수련」 연작을 남긴 프랑스 인상주의 화가는 누구인가?',
      options: ['에두아르 마네', '오귀스트 르누아르', '카미유 피사로', '클로드 모네'],
      answer: 3,
      difficulty: 'medium',
      explanation: '모네는 지베르니의 정원에 연못을 만들고 그곳에 핀 수련을 30년 가까이 그렸다.'
    },
    {
      id: 'ac_09',
      question: '「절규」를 그린 노르웨이 화가는 누구인가?',
      options: ['에드바르 뭉크', '구스타프 클림트', '파블로 피카소', '살바도르 달리'],
      answer: 0,
      difficulty: 'hard',
      explanation: '뭉크는 1893년 「절규」에서 다리 위 인물의 불안을 강렬한 색과 곡선으로 담았다.'
    },
    {
      id: 'ac_10',
      // 근거: 문항이 "작곡한"을 물으므로 작곡(1876) 기준. 초연 1877년은 다른 사건.
      question: '발레 「백조의 호수」를 작곡한 러시아 작곡가는 누구인가?',
      options: ['스트라빈스키', '차이콥스키', '라흐마니노프', '무소륵스키'],
      answer: 1,
      difficulty: 'hard',
      explanation: '차이콥스키는 1876년에 발레 「백조의 호수」를 작곡했다.'
    },
    {
      id: 'ac_11',
      question: '「생각하는 사람」을 만든 프랑스 조각가는 누구인가?',
      options: ['미켈란젤로', '오귀스트 로댕', '파블로 피카소', '도나텔로'],
      answer: 1,
      difficulty: 'easy',
      explanation: '오귀스트 로댕이 1880년 「지옥의 문」 윗부분에 앉힐 인물상으로 구상했고, 뒤에 독립된 작품으로 발표했다.'
    },
    {
      id: 'ac_12',
      question: '열두 줄을 손으로 뜯어 연주하는 우리나라 전통 현악기는?',
      options: ['거문고', '해금', '가야금', '아쟁'],
      answer: 2,
      difficulty: 'easy',
      explanation: '가야금은 열두 줄을 손가락으로 뜯어 소리를 낸다. 여섯 줄을 술대로 치는 거문고와 이 점이 다르다.'
    },
    {
      id: 'ac_13',
      question: '조선 왕실이 종묘에서 제사를 지낼 때 연주하던 음악은?',
      options: ['종묘제례악', '판소리', '강강술래', '사물놀이'],
      answer: 0,
      difficulty: 'medium',
      explanation: '종묘제례악은 역대 왕과 왕비의 신주를 모신 종묘의 제례에서 연주하던 음악으로, 유네스코 인류무형유산 대표 목록에 올라 있다.'
    },
    {
      id: 'ac_14',
      question: '안토니 가우디가 설계를 맡은 바르셀로나의 성당은?',
      options: ['노트르담 대성당', '쾰른 대성당', '성 베드로 대성당', '사그라다 파밀리아'],
      answer: 3,
      difficulty: 'medium',
      explanation: '사그라다 파밀리아는 1882년 바르셀로나에서 착공했고, 이듬해 안토니 가우디가 설계를 넘겨받아 오래도록 지었다.'
    },
    {
      id: 'ac_15',
      // 근거: 초연의 소란은 여러 출처가 전한다. 해설은 음악과 안무를 원인으로 든 주류 서술을 따랐고,
      // 초연 전부터 방해할 무리가 있었다는 견해도 있다. 문항은 소란이 있었던 사실만 쓴다.
      question: '1913년 파리 초연 때 객석이 소란했던 「봄의 제전」의 작곡가는?',
      options: ['클로드 드뷔시', '모리스 라벨', '이고르 스트라빈스키', '세르게이 프로코피예프'],
      answer: 2,
      difficulty: 'hard',
      explanation: '이고르 스트라빈스키의 발레 음악으로, 1913년 파리 샹젤리제 극장 초연 때 파격적인 음악과 안무에 객석이 크게 술렁였다.'
    }
  ]
};
