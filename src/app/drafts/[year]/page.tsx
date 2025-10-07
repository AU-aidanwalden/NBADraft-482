import { Fragment } from "react";
import { getServerSession } from "@/app/actions";
import Header from "@/components/ui/Header";
import { DRAFT_CLASSES } from "@/data/draft-classes";
import type { DraftPick } from "@/data/draft-classes";
import styles from "./page.module.css";

interface DraftsPageProps {
  params: Promise<{ year: string }>;
}

export default async function DraftsPage({ params }: DraftsPageProps) {
  const { year } = await params;
  const session = await getServerSession();
  const draftClass = DRAFT_CLASSES[year] ?? [];

  const picksByRound = draftClass.reduce<Record<number, DraftPick[]>>(
    (acc, selection) => {
      const round = Math.max(1, Math.ceil(selection.pick / 30));
      if (!acc[round]) {
        acc[round] = [];
      }
      acc[round].push(selection);
      return acc;
    },
    {},
  );

  const rounds = Object.entries(picksByRound).sort(
    ([roundA], [roundB]) => Number(roundA) - Number(roundB),
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
            rounds.map(([round, picks]) => {
              const headingClassName =
                Number(round) > 1
                  ? `${styles.roundHeading} ${styles.roundHeadingSpacing}`
                  : styles.roundHeading;

              return (
                <Fragment key={round}>
                  <h3 className={headingClassName}>Round {round}</h3>
                  {picks.map((selection) => (
                    <div
                      key={selection.pick}
                      className={styles.playerRow}
                    >
                      <span className={styles.draftPick}>#{selection.pick}</span>
                      <span className={styles.playerName}>
                        {selection.player}
                      </span>
                      <span className={styles.teamName}>{selection.team}</span>
                    </div>
                  ))}
                </Fragment>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
