import { connectToDatabase } from "../util/mongodb";

export default function All({ bets }) {
  return (
    <div>
      <h1>Bet History</h1>
      <p>
        <small>(since 2020)</small>
      </p>
      <ul>
        {bets.map((bet) => (
          <li>
            <h2>{bet.title}</h2>
            <h3>{bet.result}</h3>
            <p>{bet.gain}</p>
          </li>
        ))}
      </ul>
    </div>
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