import Head from 'next/head'
import { connectToDatabase } from "../util/mongodb";

export default function All({ bets }) {
  return (
    <div>
      <Head>
        <title>tidyhoops</title>
      </Head>

      <div>
        <h1>tidyhoops bet history</h1>
      </div>

      <main>
        {bets.map((bet) => (
          <div className={bet.result}>
            <h3>{bet.result}</h3>
            <p>{bet.gain}</p>
            <h2>{bet.title}</h2>
          </div>
        ))}
      </main>

      <style jsx>{`
        h1 {
          color: hsl(230deg, 100%, 67%);
          text-align: center;
          margin: 2em;
        }
        result {
          display: flex;
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
        .Lost:hover,
        .Lost:focus,
        .Lost:active {
          color: #0070f3;
          border-color: #0070f3;
        }
        .Won:hover,
        .Won:focus,
        .Won:active {
          color: #0070f3;
          border-color: #0070f3;
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

export async function getStaticProps() {
  const { db } = await connectToDatabase();

  const bets = await db
    .collection("bets")
    .find({})
    .sort({ date: -1 })
    .toArray();

  return {
    props: {
      bets: JSON.parse(JSON.stringify(bets)),
    },
  };
}