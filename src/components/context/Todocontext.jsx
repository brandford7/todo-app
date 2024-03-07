import  { createContext, useContext, useState } from 'react';

const TodoContext = createContext();

 const useTodoContext = () => useContext(TodoContext);


export const TodoProvider = ({children}) => {
  const [todos, setTodos] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
 
  const addTodo = (title) => {
    const newTodo = {
      id: Math.random(),
      title,
      completed: false,
    };
    setTodos([...todos, newTodo]);
     
    const editTodo = (id, newTitle) => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, title: newTitle } : todo
        )
      );
    };
    
    const deleteTodo = (id) => {
      setTodos(todos.filter((todo) => todo.id !== id));
    };

    // Set the active filter for displaying todos
    const setFilter = (filter) => {
      setActiveFilter(filter);
    };

    // Apply filter to todos
    const filteredTodos =
      activeFilter === "all"
        ? todos
        : activeFilter === "active"
          ? todos.filter((todo) => !todo.completed)
          : todos.filter((todo) => todo.completed);

    // Create context value object
    const value = {
      todos: filteredTodos,
      activeFilter,
      addTodo,
      editTodo,
      //toggleComplete,
      deleteTodo,
      setFilter,
    };

    // Provide the context value to all children components
    return (
      <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
    );


  }
}
