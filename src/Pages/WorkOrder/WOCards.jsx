import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
//import Card from "../../Components/Card";
import {
  CardMeta,
  CardHeader,
  CardGroup,
  CardDescription,
  CardContent,
  Card,
} from "semantic-ui-react";

import { useNavigate } from "react-router-dom";

const initialTasks = [
  {
    id: "1",
    title: "Task 1",
    priority: 1,
    completed: "20%",
    activity: "Do it",
  },
  {
    id: "5",
    title: "Task 1A",
    priority: 1,
    completed: "20%",
    activity: "Do it",
  },
  {
    id: "2",
    title: "Task 2",
    priority: 2,
    completed: "20%",
    activity: "Do it",
  },
  {
    id: "3",
    title: "Task 3",
    priority: 2,
    completed: "20%",
    activity: "Do it",
  },
  {
    id: "4",
    title: "Task 4",
    priority: 3,
    completed: "20%",
    activity: "Do it",
  },
];

// const intialTasks=[
//     {id,name,description,time,cost}
// ];

const SortableItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <CardContent>
          <CardHeader content={task.title} />
          <CardMeta content={task.completed} />
          <CardDescription
            content={`this task is priority ${task.priority},${task.activity}`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const WorkflowBoard = () => {
    const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);

  //   const onDragEnd = (event) => {
  //     const { active, over } = event;
  //     if (active.id !== over.id) {
  //       const oldIndex = tasks.findIndex((task) => task.id === active.id);
  //       const newIndex = tasks.findIndex((task) => task.id === over.id);
  //       setTasks(arrayMove(tasks, oldIndex, newIndex));
  //     }
  //   };
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);

    if (!activeTask || !overTask) return;

    // If task is dropped in a different priority group
    if (activeTask.priority !== overTask.priority) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTask.id
            ? { ...task, priority: overTask.priority }
            : task
        )
      );
    } else {
      // Reorder within the same priority group
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    acc[task.priority] = acc[task.priority] || [];
    acc[task.priority].push(task);
    return acc;
  }, {});

  return (
    <div>
      <div>
        <button
          onClick={() => navigate("createWorkOrder")}
          className="px-6 py-2 mb-5 bg-[#310b6b] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Create WorkOrder
        </button>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="flex flex-col gap-4">
          {Object.keys(groupedTasks)
            .sort()
            .map((priority) => (
              <SortableContext
                key={priority}
                items={groupedTasks[priority]}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex gap-2">
                  {groupedTasks[priority].map((task) => (
                    <SortableItem key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            ))}
        </div>
      </DndContext>
    </div>
  );
};

export default WorkflowBoard;
