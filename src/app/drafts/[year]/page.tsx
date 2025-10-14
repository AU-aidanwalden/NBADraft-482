import { Fragment } from "react";
import { getServerSession } from "@/app/actions";
import Header from "@/components/ui/Header";
import styles from "./page.module.css";

interface DraftPick {
  pick: number;
  player: string;
  team: string;
}

interface DraftsPageProps {
  params: Promise<{ year: string }>;
}

export default async function DraftsPage({ params }: DraftsPageProps) {
  const { year } = await params;
  const session = await getServerSession();

  //csv is fetched
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/data/draft_${year}.csv`);
  const csvText = await res.text();

  //csv is parsed, each pick, player, and team is retrieved
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  const draftClass: DraftPick[] = lines.slice(1).map((line) => {
    const values = line.split(",");
    const entry: any = {};
    headers.forEach((h, i) => (entry[h.trim()] = values[i].trim()));
    entry.pick = Number(entry.pick);
    return entry as DraftPick;
  });

  //picks are grouped by round
  const picksByRound = draftClass.reduce<Record<number, DraftPick[]>>((acc, selection) => {
    const round = Math.max(1, Math.ceil(selection.pick / 30));
    if (!acc[round]) acc[round] = [];
    acc[round].push(selection);
    return acc;
  }, {});

  const rounds = Object.entries(picksByRound).sort(
    ([roundA], [roundB]) => Number(roundA) - Number(roundB)
  );

  return (
    <div className={styles.page}>
      <Header session={session?.session ?? null} />
      <main className={styles.card}>
        <h2 className={styles.title}>{year} NBA Draft</h2>
        <div className={styles.playerList}>
          {rounds.length === 0 ? (
            <p className={styles.emptyState}>
              Draft data for {year} is not yet available.
            </p>
          ) : (
            rounds.map(([round, picks]) => (
              <Fragment key={round}>
                <h3
                  className={
                    Number(round) > 1
                      ? `${styles.roundHeading} ${styles.roundHeadingSpacing}`
                      : styles.roundHeading
                  }
                >
                  Round {round}
                </h3>
                {picks.map((selection) => (
                  <div key={selection.pick} className={styles.playerRow}>
                    <span className={styles.draftPick}>#{selection.pick}</span>
                    <span className={styles.playerName}>{selection.player}</span>
                    <span className={styles.teamName}>{selection.team}</span>
                  </div>
                ))}
              </Fragment>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
