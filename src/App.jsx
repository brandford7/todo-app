
//import './App.css'

import TodoList from "./components/TodoList";

function App() {
 

  return (
    <div className="flex flex-col items-center justify-center space-y-3 w-full ">
      <section className="my-20">
        <h1 className="text-black">Todo Guru</h1>
      </section>
      <section >
        <TodoList />
      </section>
    </div>
  );
}

export default App;
