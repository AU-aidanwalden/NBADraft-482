"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface DraftPick {
  pick: number | "-" | null;
  player: string | null;
  team: string | null;
  _originalId: string;
}

interface RedraftPick extends DraftPick {
  _dragId: string; // unique per redraft
}

interface DragDropDraftsProps {
  year: string;
  draftClass: DraftPick[];
}

export default function DragDropDrafts({ year, draftClass }: DragDropDraftsProps) {
  const [redraft, setRedraft] = useState<RedraftPick[]>([]);

  // On page load, create a fresh redraft list with unique IDs
  useEffect(() => {
    const newRedraft = draftClass.map((pick, idx) => ({
      ...pick,
      _dragId: `drag-${year}-${idx}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setRedraft(newRedraft);
  }, [draftClass, year]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(redraft);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setRedraft(items);
  };

  const exportCSV = () => {
    const rows: string[][] = [["pick", "player", "team"]];
    redraft.forEach((pick, idx) => {
      const currentPick = (idx + 1).toString();
      rows.push([currentPick, pick.player ?? "", pick.team ?? ""]);
    });

    const csvContent = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${year}-redraft.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-8">
      {/* Left panel: Original draft */}
      <div className="w-1/2 border p-4 rounded bg-gray-100 dark:bg-gray-800">
        <h3 className="text-xl font-semibold mb-4">Original Draft</h3>
        {draftClass.map((pick) => (
          <div key={pick._originalId} className="flex justify-between p-2 mb-1 border rounded bg-white dark:bg-gray-700">
            <span className="font-bold">
              {pick.pick === null || pick.pick === "-" ? "—" : `#${pick.pick}`}
            </span>
            <span className="flex-1">{pick.player ?? "Pick Forfeited"}</span>
            <span className="w-24 text-right">{pick.team ?? "-"}</span>
          </div>
        ))}
      </div>

      {/* Right panel: Redraft */}
      <div className="w-1/2 border p-4 rounded bg-gray-50 dark:bg-gray-900">
        <h3 className="text-xl font-semibold mb-4">Your Redraft</h3>

        <button
          className="mb-4 p-2 bg-green-500 text-white rounded"
          onClick={exportCSV}
        >
          Export Redraft CSV
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
          // Team that originally picked at this slot
          const originalTeam = draftClass[index]?.team ?? "-";

          return (
            <div
              key={pick._dragId}
              className="grid grid-cols-[60px_1fr_100px] gap-2 items-center mb-1"
            >
              {/* Static pick number */}
              <div className="text-center font-bold">#{index + 1}</div>

              {/* Draggable player (still moves) */}
              <Draggable draggableId={pick._dragId} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 border rounded bg-white dark:bg-gray-800 flex justify-between"
                  >
                    <span>{pick.player ?? "Pick Forfeited"}</span>
                    <span className="text-gray-500 text-sm">
                      ({pick.team ?? "-"})
                    </span>
                  </div>
                )}
              </Draggable>

              {/* Redraft team stays fixed based on original pick slot */}
              <div className="text-right font-medium text-gray-800 dark:text-gray-200">
                {originalTeam}
              </div>
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
