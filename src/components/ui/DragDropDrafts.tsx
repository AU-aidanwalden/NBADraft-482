"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

//draft pick logic loads
interface DraftPick {
  pick: number | "-" | null;
  player: string | null;
  team: string | null;
  _originalId: string;
}

//redraft pick logic
interface RedraftPick extends DraftPick {
  _dragId: string;
}

//redraft interface logic
interface DragDropDraftsProps {
  year: string;
  draftClass: DraftPick[];
  loggedIn: boolean; //doesn't work yet
}


export default function DragDropDrafts({ year, draftClass, loggedIn }: DragDropDraftsProps) {
  const [redraft, setRedraft] = useState<RedraftPick[]>([]);

  //chatgpt effect, maps each pick asset to an ID so that it can be dragged and dropped 
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
    //log in check (doesn't work right yet)
    if (!loggedIn) return;
    const rows: string[][] = [["pick", "player", "team"]];
    redraft.forEach((pick, idx) => {
      const currentPick = (idx + 1).toString();
      rows.push([currentPick, pick.player ?? "", pick.team ?? ""]);
    });

    //cgpt csv creator
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
      {/* Left panel */}
      <div className="w-1/2 border p-4 rounded bg-gray-100 dark:bg-gray-800">
        <h3 className="text-xl font-semibold mb-4">Original Draft</h3>
        {draftClass.map(pick => (
          <div key={pick._originalId} className="flex justify-between 
                                                p-2 
                                                mb-1 border rounded 
                                                bg-white 
                                                    dark:bg-gray-700">
            <span className="font-bold">{pick.pick === null || pick.pick === "-" ? "—" : `#${pick.pick}`}</span>
            <span className="flex-1">{pick.player ?? "Pick Forfeited"}</span>
            <span className="w-24 text-right">{pick.team ?? "-"}</span>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="w-1/2 border 
                        p-4 rounded 
                        bg-gray-50 
                            dark:bg-gray-900">
        <h3 className="text-xl font-semibold mb-4">Your Redraft</h3>

        <button
          className={`mb-4 
            p-2 rounded 
            text-white 
            ${loggedIn ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`} //button greyed out if not logged in
          onClick={exportCSV}
          disabled={!loggedIn} //if someone isn't logged in button should be disabled
        >
          Export Redraft CSV
        </button>

        <div className="grid 
                        grid-cols-[60px_1fr_100px] 
                        gap-2 
                        font-semibold 
                        text-sm 
                        text-gray-600 
                        mb-2">
          <div>#</div>
          <div>Player (Original Team)</div>
          <div className="text-right">Redraft Team</div>
        </div>

        {/*hello-pangea drag drop logic*/}
        <DragDropContext onDragEnd={handleDragEnd}> 
          {/*new droppable object created*/}
          <Droppable droppableId="redraft">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}> {/*Each droppable object is mapped to a pick 
                as well as an index which contains their redraft*/}
                {redraft.map((pick, index) => {
                  const originalTeam = draftClass[index]?.team ?? "-";

                  {/*return done by ChatGPT, just handles how each object's index is updated based on where the player is dragged
                    and dropped*/}
                  return (
                    <div key={pick._dragId} className="grid 
                                                    grid-cols-[60px_1fr_100px] 
                                                    gap-2 
                                                    items-center 
                                                    mb-1">
                      <div className="text-center 
                                    font-bold">#{index + 1}</div>
                      <Draggable draggableId={pick._dragId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-2 border rounded 
                                    bg-white 
                                        dark:bg-gray-800
                                    flex justify-between"
                          >
                            <span>{pick.player ?? "Pick Forfeited"}</span>
                            <span className="text-gray-500 
                                            text-sm">({pick.team ?? "-"})</span>
                          </div>
                        )}
                      </Draggable>
                      <div className="text-right 
                                    font-medium 
                                    text-gray-800 
                                        dark:text-gray-200">{originalTeam}</div>
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
