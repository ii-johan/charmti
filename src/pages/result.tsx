// src/pages/result.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { calculateResult } from '@/utils/calculateResult';

// calculateResult.ts에서 정의된 ResultData 인터페이스를 가져옵니다.
import { ResultData } from '@/utils/calculateResult'; 

import styles from '../styles/Result.module.css';

const ResultPage = () => {
  const router = useRouter();
  // result 상태 변수의 타입을 'any' 대신 'ResultData | null'로 명시합니다.
  const [result, setResult] = useState<ResultData | null>(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const { query } = router;
      const answers: number[] = [];
      let totalQuestions = 0;

      Object.keys(query).forEach(key => {
        if (key.startsWith('ans')) {
          answers.push(parseInt(query[key] as string));
        } else if (key === 'totalQuestions') {
          totalQuestions = parseInt(query[key] as string);
        }
      });

      if (answers.length > 0 && totalQuestions > 0) {
        // calculateResult 함수는 ResultData 타입을 반환하므로 타입 문제가 없습니다.
        const calculatedResult = calculateResult(answers, totalQuestions);
        setResult(calculatedResult);
        setIsLoading(false);
      } else {
        router.push('/');
      }
    }
  }, [router.isReady, router.query, router]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Head>
          <title>CharMTI 결과 로딩 중...</title>
        </Head>
        <p className={styles.loadingText}>결과를 분석하고 있습니다...</p>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.container}>
        <Head>
          <title>CharMTI 결과 오류</title>
        </Head>
        <p className={styles.loadingText}>결과를 불러오는 데 문제가 발생했습니다.</p>
        <button onClick={() => router.push('/')} className={styles.goHomeButton}>
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  const { mbtiType, charMtiType, percentages, mbtiDescription, charMtiADescription, charMtiCDescription } = result;

  const mbtiAxesData = [
    { leftType: 'E', rightType: 'I', leftLabel: '<--외향형(외부에서 에너지를 얻음)', rightLabel: '내향형(내부에서 에너지를 얻음)-->', leftPercentage: percentages['E'] || 50, rightPercentage: percentages['I'] || 50 },
    { leftType: 'S', rightType: 'N', leftLabel: '<--감각형(가시적인 현재에 집중함)', rightLabel: '직관형(추상적인 세계를 상상함)-->', leftPercentage: percentages['S'] || 50, rightPercentage: percentages['N'] || 50 },
    { leftType: 'T', rightType: 'F', leftLabel: '<--사고형(논리와 원칙으로 판단함)', rightLabel: '감정형(관계와 상황따라 판단함)-->', leftPercentage: percentages['T'] || 50, rightPercentage: percentages['F'] || 50 },
    { leftType: 'J', rightType: 'P', leftLabel: '<--판단형(계획,체계적으로 생활함)', rightLabel: '인식형(자유,즉흥적으로 생활함)-->', leftPercentage: percentages['J'] || 50, rightPercentage: percentages['P'] || 50 },
  ];

  const charMtiAxesData = [
    { leftType: 'A', rightType: 'B', leftLabel: '<--안정형(평온하고 낙천적인 기질)', rightLabel: '열정형(예민하고 비판적인 기질)-->', leftPercentage: percentages['A'] || 50, rightPercentage: percentages['B'] || 50 },
    { leftType: 'C', rightType: 'D', leftLabel: '<--매력형(당당하고 매력적인 기질)', rightLabel: '관망형(주저하고 소극적인 기질)-->', leftPercentage: percentages['C'] || 50, rightPercentage: percentages['D'] || 50 },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>CharmTi 결과: {mbtiType}-{charMtiType}</title>
        <meta name="description" content={`My CharMTI Style ${mbtiType}-${charMtiType}입니다!`} />
      </Head>

      <main className={styles.mainContent}>
        <h1 className={styles.resultTitle}>My CharmTi Style</h1>
        <div className={styles.typeDisplay}>
          <span className={styles.mbtiType}>{mbtiType}</span>
          <span className={styles.charMtiHyphen}>-</span>
          <span className={styles.charMtiType}>{charMtiType}</span>
        </div>

        <p className={styles.typeDescription}>{mbtiDescription}</p>
        <p className={styles.typeDescription}>{charMtiADescription}</p>
        <p className={styles.typeDescription}>{charMtiCDescription}</p>


        <div className={styles.chartSection}>
          <h2 className={styles.chartTitle}>MBTI 지표 분석</h2>
          <div className={styles.barChartContainer}>
            {mbtiAxesData.map((axis, index) => (
              <div key={index} className={styles.barChartRow}>
                <span className={styles.axisLabelLeft}>{axis.leftLabel}</span>
                <div className={styles.barWrapper}>
                  <div className={styles.bar}>
                    <div
                      className={styles.barFillLeft}
                      style={{ width: `${axis.leftPercentage}%` }}
                    >
                      {axis.leftPercentage > 0 && <span className={styles.percentageTextInside}>{axis.leftPercentage}%</span>}
                    </div>
                    <div
                      className={styles.barFillRight}
                      style={{ width: `${axis.rightPercentage}%` }}
                    >
                      {axis.rightPercentage > 0 && <span className={styles.percentageTextInside}>{axis.rightPercentage}%</span>}
                    </div>
                  </div>
                </div>
                <span className={styles.axisLabelRight}>{axis.rightLabel}</span>
              </div>
            ))}
          </div>

          <h2 className={styles.chartTitle} style={{ marginTop: '40px' }}>CharMTI 지표 분석</h2>
          <div className={styles.barChartContainer}>
            {charMtiAxesData.map((axis, index) => (
              <div key={index} className={styles.barChartRow}>
                <span className={styles.axisLabelLeft}>{axis.leftLabel}</span>
                <div className={styles.barWrapper}>
                  <div className={styles.bar}>
                    <div
                      className={styles.barFillLeft}
                      style={{ width: `${axis.leftPercentage}%` }}
                    >
                      {axis.leftPercentage > 0 && <span className={styles.percentageTextInside}>{axis.leftPercentage}%</span>}
                    </div>
                    <div
                      className={styles.barFillRight}
                      style={{ width: `${axis.rightPercentage}%` }}
                    >
                      {axis.rightPercentage > 0 && <span className={styles.percentageTextInside}>{axis.rightPercentage}%</span>}
                    </div>
                  </div>
                </div>
                <span className={styles.axisLabelRight}>{axis.rightLabel}</span>
              </div>
            ))}
          </div>
        </div>

        <button className={styles.goHomeButton} onClick={() => router.push('/')}>
          다시 테스트하기
        </button>
      </main>
    </div>
  );
};

export default ResultPage;