import Head from 'next/head';
import Image from "next/image";
import { connectToDatabase } from "../util/mongodb";

export default function Home({ bets, record }) {
  return (
    <div>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Modak&family=Yusei+Magic&display=swap" rel='stylesheet' />
        <title>tidyhoops</title>
      </Head>

      <nav>
        <p>tidyhoops</p>
      </nav>

      <div>
        <h1>Bet History</h1>
        <p className='record'>Record: {record.wins} - {record.losses}</p>
      </div>

      <main>
        {bets.map((bet) => (
          <div className={bet.result} key={bet.id}>
            <div className='player-image'>
              <Image
                src={bet.playerHeadshot === null ? '/public/basketball.jpg' : bet.playerHeadshot}
                width={200}
                height={150}
              />
            </div>
            <p>{bet.result}</p>
            <h2>{bet.title}</h2>
          </div>
        ))}
      </main>

      <style jsx>{`
        nav {
          font-family: 'Modak', sans-serif;
          margin: 1em;
          display: flex;
          color: hsl(30deg, 100%, 50%);
        }
        nav > p {
          font-size: 40px;
          margin: 0;
        }
        .record {
          color: hsl(210deg, 25%, 88%);
          margin: 0 0 20px 0;
          text-align: center;
        }
        .player-image {
          display: flex;
          justify-content: center;
        }
        h1 {
          color: hsl(210deg, 25%, 88%);
          text-align: center;
          text-decoration: hsl(30deg, 100%, 50%) underline wavy;
          text-decoration-thickness: 4.2px;
          text-underline-position: under;
          margin: 1em;
          font-size: 40px;
          letter-spacing: 2.09px;
        }
        h2 {
          font-size: 16px;
        }
        .Lost, .Pending {
          background: hsl(210deg, 38%, 15%);
          margin: 1em;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          border: 1px solid hsl(340deg, 95%, 60%);;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          height: 20em;
          width: 18em;
          overflow: auto;
        }
        .Lost > p {
          color: hsl(340deg, 95%, 60%);
        }
        .Won {
          background: hsl(210deg, 38%, 15%);
          margin: 1em;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          border: 1px solid hsl(160deg, 100%, 40%);;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          height: 20em;
          width: 18em;
          overflow: auto;
        }
        .Won > p {
          color: hsl(160deg, 100%, 40%);en;
        }
        main {
          color: hsl(210deg, 8%, 50%);
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
        }
      `}</style>

      <style jsx global>{`
        body {
          background: hsl(210deg, 30%, 8%);
          font-family: 'Yusei Magic', sans-serif;
        }
      `}</style>

    </div >
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const bets = await db
    .collection('bets')
    .find({})
    .sort({ date: -1 })
    .toArray();

  const wins = await db
    .collection('bets')
    .find({ result: 'Won' })
    .count();

  const losses = await db
    .collection('bets')
    .find({ result: 'Lost' })
    .count();

  const record = { wins, losses }

  return {
    props: {
      bets: JSON.parse(JSON.stringify(bets)),
      record: record,
    },
  };
}