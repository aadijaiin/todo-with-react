import { useState, useEffect } from "react";
import "./App.css";
import { TextField, Button } from "@mui/material";
import "bootstrap-icons/font/bootstrap-icons.css";
import Paper from "@mui/material/Paper";
import CheckboxList from "./components/List";
import SingleLine from "./components/SingleLine";

function App() {
  const [todos, setTodos] = useState([]);
  const [todosLeft, setTodosLeft] = useState(0);
  const [todo, setTodo] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  const url = import.meta.env.VITE_BACKEND_URL;

  const toggleTodoState = async (id, done) => {
    console.log(id, done);
    await fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_completed: !done,
      }),
    }).then((res) => {
      console.log(res);
      getTodos();
    });
  };

  const deleteTodo = async (id) => {
    await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        getTodos();
      })
      .catch((e) => console.log(e));
  };

  const getTodos = async () => {
    console.log("getting todos...");
    const res = await fetch(`${url}?_sort=-timestamp`);

    const todos = await res.json();
    let count = 0;
    for (let todo of todos) {
      if (!todo.is_completed) count++;
    }
    setTodosLeft(count);
    console.log("todos : ", todos);
    setTodos(todos);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    if (!todo || todo.trim().length <= 1) {
      console.log("invalid todo...");
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
      }, 3000);
      return;
    }
    console.log(todo);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: todo.trim(),
        is_completed: false,
        timestamp: new Date(),
      }),
    });
    setTodo("");
    await getTodos();
    return response;
  };
  return (
    <>
      <div className="container mx-auto my-auto p-3 rounded-2xl md:p-5 md:my-5">
        <SingleLine />
        <Paper elevation={2} className="p-4 rounded-2xl">
          <form
            className="flex flex-col md:flex-row gap-3 md:gap-5 "
            onSubmit={(event) => addTodo(event)}
          >
            <TextField
              onChange={(e) => {
                setTodo(e.target.value);
              }}
              value={todo}
              fullWidth
              label="Todo"
            />
            <Button
              variant="contained"
              className="rounded-2xl px-4"
              onClick={(e) => addTodo(e)}
            >
              <p className="m-0 me-2">Add</p>
              <i className="bi bi-plus-lg fs-5"></i>
            </Button>
          </form>
          {/* Element() */}
          {showMsg && (
            <p className="text-red-600 font-bold text-center mb-0 mt-2">
              Please enter a valid todo!
            </p>
          )}
        </Paper>

        {todos.length == 0 && (
          <p className="text-center mt-4 text-xl text-muted">
            You have no todos, Add some now!
          </p>
        )}

        {todos.length > 0 && (
          <p className="text-center mt-4 font-medium text-xl">
            You have {todosLeft} todos left.
          </p>
        )}
        {todos.length > 0 && (
          <Paper elevation={3} className="rounded-4">
            <div className="mt-3 md:mt-5 p-3 pb-3 md:pb-5 md:px-5 overflow-auto">
              <CheckboxList
                todos={todos}
                deleteTodo={deleteTodo}
                toggleTodoState={toggleTodoState}
              />
            </div>
          </Paper>
        )}
      </div>
    </>
  );
}

export default App;
