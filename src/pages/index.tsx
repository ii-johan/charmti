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
         <span className={styles.highlight}>✿CharmTi✿</span> 
        </h1>
        <p className={styles.description}>
          ❤️🧡💛💚🩵💙💜

        </p>
        

        <div className={styles.buttonContainer}>
          <button
            className={styles.startButton}
            onClick={() => handleStartTest(60)}
          >
            간편테스트🍀60문항
          </button>
          <button
            className={styles.startButton}
            onClick={() => handleStartTest(120)}
          >
            상세테스트🍀120문항
          </button>
        </div>
        <p className={styles.description}>
          Here are my Mbti+Charm Cents.   새로운 테스트로 알아보는 성격과 매력지수.
        </p>
        
      </main>
    </div>
  );
}