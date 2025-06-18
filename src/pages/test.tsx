// pages/test.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { testStatements, Statement } from '@/data/testStatements'; // 이 파일은 다음 단계에서 생성할 것입니다!
import styles from '../styles/Test.module.css'; // 이 파일을 생성해야 합니다.

const TestPage = () => {
  const router = useRouter();
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [questionsToLoad, setQuestionsToLoad] = useState<Statement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 시작 페이지에서 넘어온 쿼리 파라미터 (questions)를 사용하여 문항 수 결정
  useEffect(() => {
    if (router.isReady) {
      const { questions } = router.query;
      let numQuestions = 60; // 기본값은 60문항

      if (questions === '120') {
        numQuestions = 120;
      }

      // testStatements에서 필요한 문항 수만큼만 로드
      // 중요: testStatements 파일에 충분한 문항이 있어야 합니다.
      const loadedQuestions = testStatements.slice(0, numQuestions);
      setQuestionsToLoad(loadedQuestions);
      setIsLoading(false);

      if (loadedQuestions.length === 0) {
        console.error("문항 데이터를 불러올 수 없거나 문항 수가 0입니다. testStatements.ts 파일을 확인해주세요.");
        router.push('/'); // 문항이 없으면 홈으로 돌려보냅니다.
      }
    }
  }, [router.isReady, router.query, router]);

  // 현재 보여줄 문항
  const currentStatement = questionsToLoad[currentStatementIndex];

  // 답변 버튼 색상 설정
  const buttonColors = {
    strongPositive: '#bef264', // Yes++
    positive: '#bef264',     // Yes+
    mildPositive: '#bef264', // Yes
    neutral: '#99bb',      // Mid
    mildNegative: '#ffcc80', // No
    negative: '#ffcc80',     // No+
    strongNegative: '#ffcc80' // No++
  };

  // 답변 처리 함수
  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    // 모든 문항에 답변했는지 확인
    if (currentStatementIndex < questionsToLoad.length - 1) {
      setCurrentStatementIndex(currentStatementIndex + 1); // 다음 문항으로
    } else {
      // 모든 문항에 답변했으면 결과 페이지로 이동
      const queryParams = new URLSearchParams();
      newAnswers.forEach((ans, index) => {
        queryParams.append(`ans${index}`, ans.toString());
      });
      // 결과를 계산할 때 어떤 문항이 사용되었는지 알려주기 위해 numQuestions 추가
      queryParams.append('totalQuestions', questionsToLoad.length.toString());
      router.push(`/result?${queryParams.toString()}`);
    }
  };

  if (isLoading || !currentStatement) {
    return (
      <div className={styles.container}>
        <Head>
          <title>CharMTI 테스트 로딩 중...</title>
        </Head>
        <p className={styles.loadingText}>테스트를 준비하고 있습니다...</p>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>CharMTI Test({questionsToLoad.length}문항)</title>
        <meta name="description" content="CharMTI 테스트 진행 중" />
      </Head>

      <main className={styles.mainContent}>
        <h1 className={styles.title}></h1>
        <p className={styles.questionCounter}>
          {currentStatementIndex + 1} / {questionsToLoad.length}
        </p>
        <div className={styles.statementBox}>
          <p className={styles.statementText}>{currentStatement.statement}</p>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.answerButton}
            style={{ backgroundColor: buttonColors.strongPositive }}
            onClick={() => handleAnswer(3)}
          >
            ⭕ 매우 그렇다 ⭕
          </button>
          <button
            className={styles.answerButton}
            style={{ backgroundColor: buttonColors.positive }}
            onClick={() => handleAnswer(2)}
          >
            ⭕ 중간 그렇다 ⭕
          </button>
          <button
            className={styles.answerButton}
            style={{ backgroundColor: buttonColors.mildPositive }}
            onClick={() => handleAnswer(1)}
          >
            ⭕ 조금 그렇다 ⭕
          </button>
          <button
            className={styles.answerButton}
            style={{ backgroundColor: buttonColors.neutral }}
            onClick={() => handleAnswer(0)}
          >
            ❓ 잘 모르겠다 ❓
          </button>
          <button
            className={styles.answerButton}
            style={{ backgroundColor: buttonColors.mildNegative }}
            onClick={() => handleAnswer(-1)}
          >
            ❌ 조금 아니다 ❌
          </button>
          <button
            className={styles.answerButton}
            style={{ backgroundColor: buttonColors.negative }}
            onClick={() => handleAnswer(-2)}
          >
            ❌ 중간 아니다 ❌
          </button>
          <button
            className={styles.answerButton}
            style={{ backgroundColor: buttonColors.strongNegative }}
            onClick={() => handleAnswer(-3)}
          >
            ❌ 매우 아니다 ❌
          </button>
        </div>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${
                ((currentStatementIndex + 1) / questionsToLoad.length) * 100
              }%`,
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default TestPage;