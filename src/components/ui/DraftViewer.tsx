"use client";

import { DraftData, DraftPick } from "@/app/drafts/[year]/page";
import styles from "@/app/drafts/[year]/page.module.css";
import { Fragment, useState } from "react";

interface DraftViewerProps {
  draftData: DraftData;
  year: string;
  loggedIn: boolean;
}

export default function DraftViewer({
  draftData,
  year,
  loggedIn,
}: DraftViewerProps) {
  const draftClass: DraftPick[] = draftData[year] || [];

  const picksPerRoundMap: Record<number, number> = {
    1976: 18,
    1977: 22,
    1978: 22,
    1979: 22,
    1980: 23,
    1981: 23,
    1982: 23,
    1983: 24,
    1984: 24,
    1985: 24,
    1986: 24,
    1987: 23,
    1988: 25,
    1989: 27,
    1990: 24,
    1991: 27,
    1992: 27,
    1993: 27,
    1994: 27,
  };

  for (let y = 1995; y <= 2003; y++) {
    picksPerRoundMap[y] = 28; // standardized 2-round draft
  }

  for (let y = 2004; y <= 2025; y++) {
    picksPerRoundMap[y] = 30; // standardized 2-round draft
  }

  const picksByRound = draftClass.reduce<Record<number, DraftPick[]>>(
    (acc, selection) => {
      const picksPerRound = picksPerRoundMap[Number(year)] || 30;

      // Treat null or "-" as forfeited
      const isForfeited = selection.pick === "-" || selection.pick === null;

      if (!isForfeited) {
        // Convert pick to number safely
        const numericPick = selection.pick as number;
        const round = Math.ceil(numericPick / picksPerRound);
        if (!acc[round]) acc[round] = [];
        acc[round].push(selection);
      } else {
        // put forfeits at the end of the last round
        const lastRound = Math.max(...Object.keys(acc).map(Number), 1);
        if (!acc[lastRound]) acc[lastRound] = [];
        acc[lastRound].push(selection);
      }

      return acc;
    },
    {},
  );

  const rounds = Object.entries(picksByRound).sort(
    ([roundA], [roundB]) => Number(roundA) - Number(roundB),
  );

  const [redrafting, setRedrafting] = useState(false);
  const [redraftedDraft, setRedraftedDraft] = useState<DraftPick[]>([]);

  const handleRedraft = () => {
    setRedrafting(true);
  };

  return (
    <main className={styles.card}>
      <div className="flex justify-between">
        <h2 className={styles.title}>{year} NBA Draft</h2>
        {loggedIn && (
          <button className="btn btn-secondary" disabled={redrafting}>
            Create Re-draft
          </button>
        )}
      </div>
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
              {picks.map((selection, index) => {
                const isForfeited =
                  selection.pick === null ||
                  (typeof selection.pick === "number" &&
                    selection.pick % 1 !== 0);

                return (
                  <div
                    key={selection.pick ?? `forfeit-${index}`}
                    className={styles.playerRow}
                  >
                    <span className={styles.draftPick}>
                      {isForfeited
                        ? "—"
                        : `#${Math.floor(selection.pick as number)}`}
                    </span>
                    <span className={styles.playerName}>
                      {selection.player || "Pick Forfeited"}
                    </span>
                    <span className={styles.teamName}>{selection.team}</span>
                  </div>
                );
              })}
            </Fragment>
          ))
        )}
      </div>
      {redrafting && (
        <div>
          <h3>Redraft</h3>
        </div>
      )}
    </main>
  );
}
