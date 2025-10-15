import { Fragment } from "react";
import Header from "@/components/ui/Header";
import styles from "./page.module.css";
import draftDataImport from "@/data/drafts.json" assert { type: "json" };

interface DraftPick {
  pick: number;
  player: string;
  team: string;
}

interface DraftData {
  [year: string]: DraftPick[];
}

const draftData = draftDataImport as DraftData;

interface DraftsPageProps {
  params: Promise<{ year: string }>;
}

export default async function DraftsPage({ params }: DraftsPageProps) {
  const { year } = await params;

  const draftClass: DraftPick[] = draftData[year] || [];

  //picks are grouped by round
  const picksByRound = draftClass.reduce<Record<number, DraftPick[]>>(
    (acc, selection) => {
      const round = Math.max(1, Math.ceil(selection.pick / 30));
      if (!acc[round]) acc[round] = [];
      acc[round].push(selection);
      return acc;
    },
    {}
  );

  const rounds = Object.entries(picksByRound).sort(
    ([roundA], [roundB]) => Number(roundA) - Number(roundB)
  );

  return (
    <div className={styles.page}>
      <Header />
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
                    <span className={styles.playerName}>
                      {selection.player}
                    </span>
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
