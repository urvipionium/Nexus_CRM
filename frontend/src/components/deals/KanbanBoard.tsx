import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DealCard from "./DealCard";

const stages = ["New", "Qualified", "Proposal", "Won"];

function KanbanBoard({ deals, setDeals, onSelect }: any) {
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updated = [...deals];
    const draggedItem = updated.find(
      (d) => d.id.toString() === result.draggableId
    );

    if (draggedItem) {
      draggedItem.stage = result.destination.droppableId;
      setDeals([...updated]);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {stages.map((stage) => (
          <Droppable droppableId={stage} key={stage}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-w-[300px] bg-gray-50 p-3 rounded-xl"
              >
                <h2 className="font-bold mb-3">{stage}</h2>

                {deals
                  .filter((d: any) => d.stage === stage)
                  .map((deal: any, index: number) => (
                    <Draggable
                      key={deal.id}
                      draggableId={deal.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DealCard deal={deal} onSelect={onSelect} />
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;