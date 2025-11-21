"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { DraftPick } from "@/types/draft"; // use shared type

//redraft pick logic
interface RedraftPick extends DraftPick {
  _dragId: string;
  isForfeited: boolean;
}

//redraft interface logic
interface DragDropDraftsProps {
  year: string;
  draftClass: DraftPick[];
  loggedIn: boolean;
}

export default function DragDropDrafts({ year, draftClass, loggedIn }: DragDropDraftsProps) {
  const [redraft, setRedraft] = useState<RedraftPick[]>([]);

  // initialize redraft state with drag IDs and isForfeited flag
  useEffect(() => {
    const newRedraft = draftClass.map((pick, idx) => ({
      ...pick,
      _dragId: `drag-${year}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
      isForfeited: pick.pick === null || pick.pick === "-",
    }));
    setRedraft(newRedraft);
  }, [draftClass, year]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // prevent moving forfeited picks
    const movedPick = redraft[result.source.index];
    if (movedPick.isForfeited) return;

    const items = Array.from(redraft);
    items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedPick);
    setRedraft(items);
  };

  const submitRedraft = async () => {
  // Build payload with static teams from original draftClass
  const picks = redraft.map((pick, idx) => ({
    playerID: pick.player_id,           // player in the redraft slot
    teamID: draftClass[idx].team_id,    // always use original draft team
    round: pick.round ?? 1,
    roundIndex: idx,
    pickNumber: idx + 1,
  }));

  const payload = {
    year: Number(year),
    picks,
  };

  try {
    const res = await fetch("/api/redrafts/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Error: " + data.error);
      return;
    }

    alert("Redraft submitted!");
  } catch {
    alert("Error submitting redraft");
  }
};



  return (
    <div className="flex gap-8">
      {/* Left panel */}
      <div className="w-1/2 border p-4 rounded bg-gray-100 dark:bg-gray-800">
        <h3 className="text-xl font-semibold mb-4">Original Draft</h3>
        {draftClass.map(pick => (
          <div key={pick._originalId} className="flex justify-between p-2 mb-1 border rounded bg-white dark:bg-gray-700">
            <span className="font-bold">{pick.pick === null || pick.pick === "-" ? "—" : `#${pick.pick}`}</span>
            <span className="flex-1">{pick.player ?? "Pick Forfeited"}</span>
            <span className="w-24 text-right">{pick.team ?? "-"}</span>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="w-1/2 border p-4 rounded bg-gray-50 dark:bg-gray-900">
        <h3 className="text-xl font-semibold mb-4">Your Redraft</h3>

        <button
          className={`mb-4 p-2 rounded text-white ${
            loggedIn ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={submitRedraft}
          disabled={!loggedIn}
        >
          Submit Redraft
        </button>

        <div className="grid grid-cols-[60px_1fr_100px] gap-2 font-semibold text-sm text-gray-600 mb-2">
          <div>#</div>
          <div>Player (Original Team)</div>
          <div className="text-right">Redraft Team</div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="redraft">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {redraft.map((pick, index) => {
                  const originalTeam = draftClass[index]?.team ?? "-";

                  return (
                    <div key={pick._dragId} className="grid grid-cols-[60px_1fr_100px] gap-2 items-center mb-1">
                      <div className="text-center font-bold">#{index + 1}</div>

                      {pick.isForfeited ? (
                        <div className="p-2 border rounded bg-gray-200 dark:bg-gray-700 flex justify-between cursor-not-allowed">
                          <span>{pick.player ?? "Pick Forfeited"}</span>
                          <span className="text-gray-500 text-sm">({pick.team ?? "-"})</span>
                        </div>
                      ) : (
                        <Draggable draggableId={pick._dragId} index={index}>
  {(provided) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="p-2 border rounded bg-white dark:bg-gray-800 flex justify-between"
    >
      <span>{pick.player ?? "Pick Forfeited"}</span>
      <span className="text-gray-500 text-sm">({draftClass[index]?.team ?? "-"})</span>

    </div>
  )}
</Draggable>

                      )}

                      <div className="text-right font-medium text-gray-800 dark:text-gray-200">{originalTeam}</div>
                    </div>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
