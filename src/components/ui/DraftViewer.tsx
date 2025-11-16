"use client";

import { Fragment, useState } from "react";
import styles from "@/app/drafts/[year]/page.module.css";
import { DraftData, DraftPick } from "@/app/drafts/[year]/page";

export interface DraftViewerProps {
  year: string;
  loggedIn: boolean;
  draftData: DraftData;
}

export default function DraftViewer({
  draftData,
  year,
  loggedIn,
}: DraftViewerProps) {
  // Grab the picks for this year from the draftData prop
  const draftClass: DraftPick[] = draftData[year] || [];

  // Add derived isForfeited flag for convenience
  const draftWithForfeits = draftClass.map(p => ({
    ...p,
    isForfeited: p.pick === null || p.pick === "-" 
  }));

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

  for (let y = 1995; y <= 2003; y++) picksPerRoundMap[y] = 28;
  for (let y = 2004; y <= 2025; y++) picksPerRoundMap[y] = 30;

  const picksByRound = draftWithForfeits.reduce<Record<number, typeof draftWithForfeits[0][]>>(
    (acc, selection) => {
      const picksPerRound = picksPerRoundMap[Number(year)] || 30;

      const round = selection.isForfeited
        ? Math.max(...Object.keys(acc).map(Number), 1) // last round for forfeits
        : Math.ceil((selection.pick as number) / picksPerRound);

      if (!acc[round]) acc[round] = [];
      acc[round].push(selection);

      return acc;
    },
    {}
  );

  const rounds = Object.entries(picksByRound).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  const [redrafting, setRedrafting] = useState(false);

  return (
    <main className={styles.card}>
      <div className="flex justify-between">
        <h2 className={styles.title}>{year} NBA Draft</h2>
        {loggedIn && (
          <button
            className="btn btn-secondary"
            disabled={redrafting}
            onClick={() => setRedrafting(true)}
          >
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
              {picks.map((selection, index) => (
                <div
                  key={selection._originalId ?? `forfeit-${index}`}
                  className={styles.playerRow}
                >
                  <span className={styles.draftPick}>
                    {selection.isForfeited ? "—" : `#${selection.pick}`}
                  </span>
                  <span className={styles.playerName}>
                    {selection.player ?? "Pick Forfeited"}
                  </span>
                  <span className={styles.teamName}>{selection.team ?? "-"}</span>
                </div>
              ))}
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
