import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(title, description, dueDate) {
    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate,
      isComplete: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTitle("");
    setDescription("");
    setDueDate("");
  }

  function deleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  function toggleCompleted(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleDueDateChange(e) {
    setDueDate(e.target.value);
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  }

  function applyFilter(task) {
    switch (filter) {
      case "active":
        return !task.isComplete;
      case "completed":
        return task.isComplete;
      default:
        return true;
    }
  }

  function handleTaskEdit(task) {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedDueDate(task.dueDate || "");
  }

  function saveEditedTask(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: editedTitle,
              description: editedDescription,
              dueDate: editedDueDate,
            }
          : task
      )
    );
    setEditingTaskId(null);
  }

  return (
    <div className="container mx-auto mt-10 p-5 bg-gray-200 rounded-md">
      <h1 className="text-2xl font-bold mb-5 text-black">Todo List</h1>
      <div className="space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask(title, description, dueDate);
          }}
          className="flex flex-col space-y-2"
        >
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter task title "
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter task description"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={dueDate}
            onChange={handleDueDateChange}
            placeholder="Due Date"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add
          </button>
        </form>
        <div>
          <label htmlFor="filter" className="text-black">
            Filter:
          </label>
          <select
            id="filter"
            name="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="mt-5">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.filter(applyFilter).map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between bg-white rounded-md px-3 py-2 mb-2"
                      >
                        <div>
                          {editingTaskId === task.id ? (
                            <>
                              <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                              />
                              <input
                                type="text"
                                value={editedDescription}
                                onChange={(e) =>
                                  setEditedDescription(e.target.value)
                                }
                              />
                              <input
                                type="date"
                                value={editedDueDate}
                                onChange={(e) =>
                                  setEditedDueDate(e.target.value)
                                }
                              />
                            </>
                          ) : (
                            <>
                              <input
                                type="checkbox"
                                checked={task.isComplete}
                                onChange={() => toggleCompleted(task.id)}
                                className="mr-3"
                              />
                              <span
                                className={
                                  task.isComplete
                                    ? "line-through text-black"
                                    : "text-black"
                                }
                              >
                                {task.title} - {task.description} - Due:{" "}
                                {task.dueDate
                                  ? format(
                                      new Date(task.dueDate),
                                      "MMMM dd, yyyy"
                                    )
                                  : "Not set"}
                              </span>
                            </>
                          )}
                        </div>
                        <div>
                          {editingTaskId === task.id ? (
                            <FaSave
                              onClick={() => saveEditedTask(task.id)}
                              className="cursor-pointer text-green-500 hover:text-green-600 mr-2"
                            />
                          ) : (
                            <FaEdit
                              onClick={() => handleTaskEdit(task)}
                              className="cursor-pointer text-blue-500 hover:text-blue-600 mr-2"
                            />
                          )}
                          <FaTrash
                            onClick={() => deleteTask(task.id)}
                            className="cursor-pointer text-red-500 hover:text-red-600"
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TodoList;
