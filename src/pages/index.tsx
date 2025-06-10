// pages/index.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'; // 이 파일을 생성해야 합니다.

export default function Home() {
  const router = useRouter();

  const handleStartTest = (numQuestions: number) => {
    // 선택된 문항 수에 따라 쿼리 파라미터를 넘겨줍니다.
    router.push(`/test?questions=${numQuestions}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>CharMTI Test</title>
        <meta name="description" content="나만의 매력을 찾아주는 CharMTI 테스트" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Mbti <span className={styles.highlight}>CharMTI</span> Test
        </h1>

        <p className={styles.description}>
          당신의 감정 스타일(Atlas/Blaze)과 매력 스타일(Charm/Dawn)을 알아보세요!
        </p>

        <div className={styles.buttonContainer}>
          <button
            className={styles.startButton}
            onClick={() => handleStartTest(60)}
          >
            60문항으로 시작하기 (간편)
          </button>
          <button
            className={styles.startButton}
            onClick={() => handleStartTest(120)}
          >
            120문항으로 시작하기 (심층)
          </button>
        </div>

        <p className={styles.footerText}>
          당신의 특별한 매력을 지금 바로 확인해보세요!
        </p>
      </main>
    </div>
  );
}