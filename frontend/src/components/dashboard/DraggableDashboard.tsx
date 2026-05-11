import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

import DashboardWidget from "./DashboardWidget";

type Props = {
  widgets: string[];
  setWidgets: any;
};

export default function DraggableDashboard({
  widgets,
  setWidgets
}: Props) {

  const handleDragEnd = (result: any) => {

    if (!result.destination) return;

    const items = Array.from(widgets);

    const [reordered] = items.splice(
      result.source.index,
      1
    );

    items.splice(
      result.destination.index,
      0,
      reordered
    );

    setWidgets(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>

      <Droppable droppableId="dashboard">

        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-2 gap-4"
          >

            {widgets.map((widget, index) => (

              <Draggable
                key={index}
                draggableId={`${widget}-${index}`}
                index={index}
              >

                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="cursor-grab active:cursor-grabbing"
                  >

                    <DashboardWidget type={widget} />

                  </div>
                )}

              </Draggable>

            ))}

            {provided.placeholder}

          </div>
        )}

      </Droppable>

    </DragDropContext>
  );
}