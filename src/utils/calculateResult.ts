// src/utils/calculateResult.ts
import { testStatements, Statement } from '@/data/testStatements';

interface ScoreMap {
  [key: string]: number;
}

interface PercentageMap {
  [key: string]: number;
}

// ResultData 인터페이스 앞에 'export' 키워드를 추가하여 외부에서 임포트 가능하게 합니다.
export interface ResultData {
  mbtiType: string;
  charMtiType: string;
  percentages: PercentageMap;
  mbtiDescription: string;
  charMtiADescription: string;
  charMtiCDescription: string;
}

export const calculateResult = (answers: number[], totalQuestions: number): ResultData => {
  const scores: ScoreMap = {
    'E': 0, 'I': 0,
    'S': 0, 'N': 0,
    'T': 0, 'F': 0,
    'J': 0, 'P': 0,
    'A': 0, 'B': 0,
    'C': 0, 'D': 0,
  };

  // 실제로 사용된 질문들만 가져옵니다 (60문항 또는 120문항)
  const statementsUsed = testStatements.slice(0, totalQuestions);

  // 답변을 기반으로 점수 합산
  answers.forEach((answer, index) => {
    const statement = statementsUsed[index];
    if (statement) {
      statement.type.forEach(type => {
        // 각 타입에 점수를 직접 더합니다.
        // 예를 들어, 'E' 질문에 긍정 답변(+3)이면 E 점수가 +3 됩니다.
        // MBTI의 경우 양극단이므로, 한쪽 점수가 높으면 다른 쪽은 자연스레 낮아집니다.
        // CharMTI도 마찬가지입니다.
        scores[type] += answer;
      });
    }
  });

  // MBTI 유형 결정 로직 (각 축의 점수를 비교하여 더 높은 쪽 선택)
  let mbtiType = '';
  mbtiType += scores['E'] >= scores['I'] ? 'E' : 'I';
  mbtiType += scores['S'] >= scores['N'] ? 'S' : 'N';
  mbtiType += scores['T'] >= scores['F'] ? 'T' : 'F';
  mbtiType += scores['J'] >= scores['P'] ? 'J' : 'P';

  // CharMTI 유형 결정 로직
  let charMtiType = '';
  charMtiType += scores['A'] >= scores['B'] ? 'A' : 'B';
  charMtiType += scores['C'] >= scores['D'] ? 'C' : 'D';

  // --- 백분율 계산 ---
  const percentages: PercentageMap = {};

  // positiveType과 negativeType의 타입을 구체적인 리터럴 유니언으로 지정하여 오류 해결
  const calculateAxisPercentage = (
    positiveType: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' | 'A' | 'B' | 'C' | 'D',
    negativeType: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' | 'A' | 'B' | 'C' | 'D',
    statements: Statement[]
  ) => {
    const relevantStatements = statements.filter(stmt => stmt.type.includes(positiveType) || stmt.type.includes(negativeType));
    const numRelevantStatements = relevantStatements.length;

    if (numRelevantStatements === 0) {
      percentages[positiveType] = 50; // 관련 질문이 없으면 50%로 설정
      percentages[negativeType] = 50;
      return;
    }

    // 각 지표의 총 점수를 사용하여 백분율을 계산합니다.
    // 각 지표의 질문 개수 * 3 이 최대 점수, * -3 이 최소 점수라고 가정합니다.
    // 이를 정규화하여 0-100%로 나타냅니다.

    const totalEStatements = statements.filter(stmt => stmt.type.includes('E')).length;
    const totalIStatements = statements.filter(stmt => stmt.type.includes('I')).length;
    const totalSStatements = statements.filter(stmt => stmt.type.includes('S')).length;
    const totalNStatements = statements.filter(stmt => stmt.type.includes('N')).length;
    const totalTStatements = statements.filter(stmt => stmt.type.includes('T')).length;
    const totalFStatements = statements.filter(stmt => stmt.type.includes('F')).length;
    const totalJStatements = statements.filter(stmt => stmt.type.includes('J')).length;
    const totalPStatements = statements.filter(stmt => stmt.type.includes('P')).length;
    const totalAStatements = statements.filter(stmt => stmt.type.includes('A')).length;
    const totalBStatements = statements.filter(stmt => stmt.type.includes('B')).length;
    const totalCStatements = statements.filter(stmt => stmt.type.includes('C')).length;
    const totalDStatements = statements.filter(stmt => stmt.type.includes('D')).length;

    // 각 지표의 최대 가능한 점수
    const maxScoreE = totalEStatements * 3;
    const maxScoreI = totalIStatements * 3;
    const maxScoreS = totalSStatements * 3;
    const maxScoreN = totalNStatements * 3;
    const maxScoreT = totalTStatements * 3;
    const maxScoreF = totalFStatements * 3;
    const maxScoreJ = totalJStatements * 3;
    const maxScoreP = totalPStatements * 3;
    const maxScoreA = totalAStatements * 3;
    const maxScoreB = totalBStatements * 3;
    const maxScoreC = totalCStatements * 3;
    const maxScoreD = totalDStatements * 3;

    // 각 지표의 최소 가능한 점수
    const minScoreE = totalEStatements * -3;
    const minScoreI = totalIStatements * -3;
    const minScoreS = totalSStatements * -3;
    const minScoreN = totalNStatements * -3;
    const minScoreT = totalTStatements * -3;
    const minScoreF = totalFStatements * -3;
    const minScoreJ = totalJStatements * -3;
    const minScoreP = totalPStatements * -3;
    const minScoreA = totalAStatements * -3;
    const minScoreB = totalBStatements * -3;
    const minScoreC = totalCStatements * -3;
    const minScoreD = totalDStatements * -3;

    // E vs I
    const totalRangeE_I = (maxScoreE - minScoreE) + (maxScoreI - minScoreI);
    const scoreE_I = scores['E'] - scores['I']; // E가 높으면 양수, I가 높으면 음수
    const normalizedScoreE_I = scoreE_I - (minScoreE - maxScoreI); // 이 축의 최소값 기준
    if (totalRangeE_I > 0) {
      percentages['E'] = Math.round((normalizedScoreE_I / totalRangeE_I) * 100);
      percentages['I'] = 100 - percentages['E'];
    } else { percentages['E'] = 50; percentages['I'] = 50; }

    // S vs N
    const totalRangeS_N = (maxScoreS - minScoreS) + (maxScoreN - minScoreN);
    const scoreS_N = scores['S'] - scores['N'];
    const normalizedScoreS_N = scoreS_N - (minScoreS - maxScoreN);
    if (totalRangeS_N > 0) {
      percentages['S'] = Math.round((normalizedScoreS_N / totalRangeS_N) * 100);
      percentages['N'] = 100 - percentages['S'];
    } else { percentages['S'] = 50; percentages['N'] = 50; }

    // T vs F
    const totalRangeT_F = (maxScoreT - minScoreT) + (maxScoreF - minScoreF);
    const scoreT_F = scores['T'] - scores['F'];
    const normalizedScoreT_F = scoreT_F - (minScoreT - maxScoreF);
    if (totalRangeT_F > 0) {
      percentages['T'] = Math.round((normalizedScoreT_F / totalRangeT_F) * 100);
      percentages['F'] = 100 - percentages['T'];
    } else { percentages['T'] = 50; percentages['F'] = 50; }

    // J vs P
    const totalRangeJ_P = (maxScoreJ - minScoreJ) + (maxScoreP - minScoreP);
    const scoreJ_P = scores['J'] - scores['P'];
    const normalizedScoreJ_P = scoreJ_P - (minScoreJ - maxScoreP);
    if (totalRangeJ_P > 0) {
      percentages['J'] = Math.round((normalizedScoreJ_P / totalRangeJ_P) * 100);
      percentages['P'] = 100 - percentages['J'];
    } else { percentages['J'] = 50; percentages['P'] = 50; }


    // CharMTI (A/B, C/D)는 각 지표의 총합을 기준으로 백분율 계산
    // A vs B
    const totalRangeA_B = (maxScoreA - minScoreA) + (maxScoreB - minScoreB);
    const scoreA_B = scores['A'] - scores['B'];
    const normalizedScoreA_B = scoreA_B - (minScoreA - maxScoreB);
    if (totalRangeA_B > 0) {
      percentages['A'] = Math.round((normalizedScoreA_B / totalRangeA_B) * 100);
      percentages['B'] = 100 - percentages['A'];
    } else { percentages['A'] = 50; percentages['B'] = 50; }

    // C vs D
    const totalRangeC_D = (maxScoreC - minScoreC) + (maxScoreD - minScoreD);
    const scoreC_D = scores['C'] - scores['D'];
    const normalizedScoreC_D = scoreC_D - (minScoreC - maxScoreD);
    if (totalRangeC_D > 0) {
      percentages['C'] = Math.round((normalizedScoreC_D / totalRangeC_D) * 100);
      percentages['D'] = 100 - percentages['C'];
    } else { percentages['C'] = 50; percentages['D'] = 50; }
  };

  calculateAxisPercentage('E', 'I', statementsUsed);
  calculateAxisPercentage('S', 'N', statementsUsed);
  calculateAxisPercentage('T', 'F', statementsUsed);
  calculateAxisPercentage('J', 'P', statementsUsed);
  calculateAxisPercentage('A', 'B', statementsUsed); // CharMTI
  calculateAxisPercentage('C', 'D', statementsUsed); // CharMTI

  // MBTI 유형 설명
  const mbtiDescriptions: { [key: string]: string } = {
    'ISTJ': '(부지런한 개미) 당신은 성실하고 꼼꼼한 원칙주의자입니다. 첫번째 강점은 성실성, 두번째 강점은 통솔력, 약점은 창의력입니다. 주어진 일을 잘 처리하는 사람으로 조직생활에 없어서는 안되는 사람입니다. 법없이 사는 사람 또는 꼰대입니다.',
    'ISFJ': '(이타적인 사슴) 당신은 정의롭고 헌신적인 수호자입니다. 첫번째 강점은 성실성, 두번째 강점은 친화력, 약점은 창의력입니다. 다른 사람 돕는 것을 좋아하며, 조용하지만 강한 영향력을 행사하는 사람입니다. 헌신적인 봉사자 또는 호구입니다.',
    'INFJ': '(희생적인 까마귀) 당신은 따뜻하고 희생적인 예언자입니다. 첫번째 강점은 통찰력, 두번째 강점은 친화력, 약점은 추진력입니다. 깊은 통찰력으로 세상을 바라보며 타인 마음을 잘 헤아릴 수 있는 사람입니다. 희생적인 자선가 또는 오지랖입니다.',
    'INTJ': '(민첩한 치타) 당신은 독립적이고 날카로운 전략가입니다. 첫번째 강점은 통찰력, 두번째 강점은 통솔력, 약점은 추진력입니다. 상황을 분석하는 능력이 탁월하며, 목표를 향해 계획적으로 나아가는 사람입니다. 제갈공명 또는 고집불통입니다.',
    'ISTP': '(느긋한 나무늘보) 당신은 여유롭고 섬세한 기술자입니다. 첫번째 강점은 분석력, 두번째 강점은 추진력, 약점은 친화력입니다. 타인에게 간섭하지도 간섭받지도 않는 사람으로 손재주가 뛰어납니다. 기술장인 또는 나만 아니면 돼~ 주의자입니다.',
    'ISFP': '(온순한 고양이) 당신은 자유롭고 감성적인 예술가입니다. 첫번째 장점은 공감력, 두번째 장점은 추진력, 약점은 통솔력입니다. 친화적인 성격으로 예술적 감각이 뛰어나며 자유로운 삶을 추구하는 사람입니다. 예술가 또는 회피적 방랑자입니다.',
    'INFP': '(꿈꾸는 토끼) 당신은 상냥하고 생각이 깊은 몽상가입니다. 첫번째 장점은 공감력, 두번째 장점은 창의력, 약점은 통솔력입니다. 상냥하며 타인의 감정을 잘 이해하고 자신의 가치관이 뚜렷한 사람입니다. 이상주의자 또는 현실도피주의자입니다.',
    'INTP': '(논리적인 부엉이) 당신은 독창적이고 비판적인 사색가입니다. 첫번째 강점은 분석력, 두번째 강점은 창의력, 약점은 공감력입니다. 정답을 알아내는 과학자적 능력이 있으며, 세상을 바꿀 아이디어를 탐구합니다. 발명가 또는 꼬투리꾼입니다.',
    'ESTP': '(거침없는 황소) 당신은 쾌활하고 현실적인 행동가입니다. 첫번째 강점은 추진력, 두번째 강점은 분석력, 약점은 통찰력입니다. 세련되고 매력적이며 즉흥적으로 행동하길 좋아하고 새로운 경험을 추구하는 사람입니다. 행동대장 또는 카사노바입니다.',
    'ESFP': '(천방지축 강아지) 당신은 즉흥적이고 자유로운 연예인입니다. 첫번째 강점은 추진력, 두번째 강점은 공감력, 약점은 통찰력입니다. 사람들과의 교류를 즐기며, 주목받기를 좋아하고, 순간을 즐기는 낙천적인 사람입니다. 연예인 또는 사고뭉치입니다.',
    'ENFP': '(귀여운 참새) 당신은 발랄하고 자유로운 모험가입니다. 첫번째 강점은 창의력, 두번째 강점은 공감력, 약점은 성실성입니다. 이것저것 호기심이 아주 많으며, 사람들과의 관계를 좋아하는 다정한 사람입니다. 매력쟁이 또는 습관성 중도포기자입니다.',
    'ENTP': '(똑똑한 여우) 당신은 재치있고 주장이 강한 달변가입니다. 첫번째 강점은 창의력, 두번째 강점은 분석력, 약점은 성실성입니다. 센스가 많고 청산유수로 말을 잘하며 문제의 핵심을 잘 파악하는 능력이 있습니다. 변호사 또는 지적질 대마왕입니다.',
    'ESTJ': '(엄격한 호랑이) 당신은 책임감과 리더십이 있는 관리자입니다. 첫번째 강점은 통솔력, 두번째 강점은 성실성, 약점은 공감력입니다. 일을 체계적으로 잘 처리하며, 목표를 향해 사람들을 잘 통솔하는 리더형 사람입니다. 사장님 또는 독재자입니다.',
    'ESFJ': '(평화의 비둘기) 당신은 협력적이고 사교적인 외교관입니다. 첫번째 강점은 친화력, 두번째 강점은 성실성, 약점은 분석력입니다. 사람을 좋아하고 그들을 서로 연결합니다. 적이 별로 없으며 발이 넓은 사람입니다. 인기쟁이 또는 설레발입니다.',
    'ENFJ': '(정의로운 독수리) 당신은 다정하고 정의로운 사회운동가입니다. 첫번째 강점은 친화력, 두번째 강점은 통찰력, 약점은 분석력입니다. 다정하고 사욕이 없으며, 헌신적으로 사람들을 이끄는 능력이 뛰어난 사람입니다. 지도자 또는 선동가입니다.',
    'ENTJ': '(신비로운 사자) 당신은 진취적이고 대담한 통솔자입니다. 첫번째 강점은 통솔력, 두번째 강점은 통찰력, 약점은 공감력입니다. 목표를 향해 사람들을 이끌어나가는 리더십의 소유자로 왕의 자질을 가진 사람입니다. 왕 또는 준 소시오패스입니다.',
  };

  // CharMTI A/B 유형 설명
  const charMtiADescriptions: { [key: string]: string } = {
    'A': '(고요한 바다) 당신은 감정의 동요가 적은 Atlas(안정형)입니다. 당신은 물과 같이 고요하고 차분한 기질을 소유하고 있습니다. 어떤 상황에서도 화를 잘 내지않는 평온한 마음의 소유자입니다. 편안하고 안정적인 사람 또는 우유부단한 사람입니다. ',
    'B': '(타오르는 불꽃) 당신은 감정 표현이 풍부한 Blaze(열정형)입니다. 당신은 불과 같이 날카롭고 뜨거운 기질을 소유하고 있습니다. 활기찬 에너지와 열정으로 낙심에 빠진 사람들에게 힘을 줍니다. 화끈하고 열정적인 사람 또는 자주 욱하는 사람입니다.',
  };

  // CharMTI C/D 유형 설명
  const charMtiCDescriptions: { [key: string]: string } = {
    'C': '(AC-공작, BC-백작) 당신은 주도적인 Charm(매력형)입니다. 당신은 당당하고 자신감이 넘치는 주도적인 사람입니다. 어려운 상황에도 피하지 않고 나서서 사람들을 이끌어 나가는 주도적이고 매력적인 사람입니다. 인기쟁이 또는 바람둥이입니다.',
    'D': '(AD-평민, BD-천민) 당신은 소극적인 Dawn(관망형)입니다. 당신은 조용하고 함부로 나서지 않는 신중한 사람입니다. 앞에 나서서 사람들의 관심을 받기보다 뒤에서 조용히 돕는, 겸손함과 배려심을 가진 사람입니다. 조력자 또는 찌질이입니다.',
  };


  return {
    mbtiType,
    charMtiType,
    percentages,
    mbtiDescription: mbtiDescriptions[mbtiType] || 'MBTI 유형 설명 없음',
    charMtiADescription: charMtiADescriptions[charMtiType[0]] || 'CharMTI A/B 설명 없음',
    charMtiCDescription: charMtiCDescriptions[charMtiType[1]] || 'CharMTI C/D 설명 없음',
  };
};