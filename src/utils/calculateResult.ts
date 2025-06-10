// src/utils/calculateResult.ts
import { testStatements, Statement } from '@/data/testStatements';

interface ScoreMap {
  [key: string]: number;
}

interface PercentageMap {
  [key: string]: number;
}

interface ResultData {
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
  // 각 지표별 최대 점수를 가정하여 백분율을 계산합니다.
  // 7점 척도 (3 ~ -3)이므로, 각 질문당 최대 3점, 최소 -3점.
  // 예를 들어, E 타입 질문이 총 N개라면, E 점수의 최대값은 N * 3, 최소값은 N * -3
  // 백분율은 (현재 점수 - 최소값) / (최대값 - 최소값) * 100 으로 계산합니다.
  // 이는 0% ~ 100% 사이의 스케일로 정규화하는 방법입니다.

  const percentages: PercentageMap = {};

  const calculateAxisPercentage = (positiveType: string, negativeType: string, statements: Statement[]) => {
    const relevantStatements = statements.filter(stmt => stmt.type.includes(positiveType) || stmt.type.includes(negativeType));
    const numRelevantStatements = relevantStatements.length;

    if (numRelevantStatements === 0) {
      percentages[positiveType] = 50; // 관련 질문이 없으면 50%로 설정
      percentages[negativeType] = 50;
      return;
    }

    const positiveScore = scores[positiveType];
    const negativeScore = scores[negativeType];

    // 예를 들어, E와 I가 있다면, E 질문의 점수와 I 질문의 점수를 합산하여 E-I의 총 점수를 계산합니다.
    // E 질문에 +3, I 질문에 +3이면 E-I 합계는 0이 됩니다.
    // 즉, 각 질문이 해당 지표의 긍정적인 방향으로 점수를 주고 있기 때문에
    // E 질문에 답한 점수 총합과 I 질문에 답한 점수 총합을 비교하여 퍼센트를 계산하는 것이 더 직관적입니다.
    // 여기서는 각 유형에 대한 절대적인 점수를 합산했으므로, 그 점수를 바탕으로 퍼센트를 계산합니다.
    // A-B, C-D는 서로 독립적인 축이므로, 각 타입의 점수를 상대적으로 비교하여 백분율을 산정합니다.

    // 각 지표의 총 점수를 사용하여 백분율을 계산합니다.
    // 각 지표의 질문 개수 * 3 이 최대 점수, * -3 이 최소 점수라고 가정합니다.
    // 이를 정규화하여 0-100%로 나타냅니다.
    // 예를 들어, E와 I 질문의 총 개수
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
    'ISTJ': '논리적이고 현실적인, 책임감 강한 원칙주의자',
    'ISFJ': '용감하고 따뜻한, 헌신적인 수호자',
    'INFJ': '통찰력 있고 창의적인, 이상적인 예언자',
    'INTJ': '독립적이고 전략적인, 뛰어난 전략가',
    'ISTP': '논리적이고 분석적인, 조용한 탐험가',
    'ISFP': '유연하고 호기심 많은, 자유로운 영혼의 예술가',
    'INFP': '온정적이고 상냥한, 열정적인 중재자',
    'INTP': '논리적이고 독창적인, 비판적인 사색가',
    'ESTP': '활동적이고 쾌활한, 현실적인 모험가',
    'ESFP': '사교적이고 즉흥적인, 자유로운 연예인',
    'ENFP': '열정적이고 창의적인, 자유로운 활동가',
    'ENTP': '논리적이고 재치 있는, 똑똑한 변론가',
    'ESTJ': '체계적이고 현실적인, 관리의 달인',
    'ESFJ': '사교적이고 협력적인, 따뜻한 리더',
    'ENFJ': '사교적이고 따뜻한, 정의로운 리더',
    'ENTJ': '도전적이고 진취적인, 대담한 통솔자',
  };

  // CharMTI A/B 유형 설명
  const charMtiADescriptions: { [key: string]: string } = {
    'A': '당신은 감정의 동요가 적은 Atlas(안정형)입니다. 차분하고 평온하며, 어떤 상황에서도 쉽게 흔들리지 않는 강철 같은 마음을 가지고 있습니다. 주변에 안정감을 주는 존재입니다.',
    'B': '당신은 감정 표현이 풍부한 Blaze(신경형)입니다. 열정적이고 감정 기복이 있을 수 있지만, 이는 곧 당신의 활기찬 에너지와 진정한 면모를 보여주는 증거입니다. 당신의 뜨거운 에너지는 주변을 움직이는 원동력이 됩니다.',
  };

  // CharMTI C/D 유형 설명
  const charMtiCDescriptions: { [key: string]: string } = {
    'C': '당신은 매력적이고 주도적인 Charm(매력형)입니다. 당당하고 자신감 넘치며, 사람들의 이목을 집중시키는 특별한 매력을 가지고 있습니다. 어떤 상황에서도 주도적으로 나서며 긍정적인 영향을 미칩니다.',
    'D': '당신은 신중하고 소극적인 Dawn(소극형)입니다. 때로는 자신감이 부족하다고 느낄 수 있지만, 이는 곧 당신의 겸손함과 사려 깊음을 의미합니다. 조용하지만 깊이 있는 매력을 가지고 있으며, 자신만의 속도로 빛을 발합니다.',
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