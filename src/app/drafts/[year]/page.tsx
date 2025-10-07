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
    {}
  );

  const rounds = Object.entries(picksByRound).sort(
    ([roundA], [roundB]) => Number(roundA) - Number(roundB)
  );

  return (
    <div className="min-h-screen p-5">
      <Header session={session?.session ?? null} />
      <main className="bg-base-300 p-5 rounded-xl shadow-md max-w-4xl mx-auto">
        <h2 className={styles.title}>{year} NBA Draft</h2>
        <div className={styles["player-list"]}>
          {rounds.length === 0 ? (
            <p className="text-center text-base-content/70">
              Draft data for {year} is not yet available.
            </p>
          ) : (
            rounds.map(([round, picks]) => {
              const headingClassName =
                Number(round) > 1
                  ? "text-xl font-semibold mt-6"
                  : "text-xl font-semibold";

              return (
                <Fragment key={round}>
                  <h3 className={headingClassName}>Round {round}</h3>
                  {picks.map((selection) => (
                    <div key={selection.pick} className={styles["player-rows"]}>
                      <span className={styles["draft-pick"]}>
                        #{selection.pick}
                      </span>
                      <span className={styles["player-name"]}>
                        {selection.player}
                      </span>
                      <span className={styles["team-name"]}>
                        {selection.team}
                      </span>
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
