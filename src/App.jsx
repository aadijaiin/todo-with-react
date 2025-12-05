import { useState, useEffect } from "react";
import "./App.css";
import { TextField, Button } from "@mui/material";
import "bootstrap-icons/font/bootstrap-icons.css";
import Paper from "@mui/material/Paper";
import CheckboxList from "./components/List";
import SingleLine from "./components/SingleLine";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  const url = import.meta.env.VITE_BACKEND_URL;

  const toggleTodoState = async (id, done) => {
    console.log(id, done);
    await fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        done: !done,
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
      return;
    }
    console.log(todo);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: todo.trim(),
        done: false,
        timestamp: new Date(),
      }),
    });
    setTodo("");
    await getTodos();
    return response;
  };
  return (
    <>
      <div className="container p-3 p-md-5 rounded-4 my-3 my-md-5">
        <SingleLine />
        <Paper elevation={2} className="border p-4 rounded-4">
          <form
            className="d-flex flex-column flex-md-row gap-3 gap-md-5 "
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
              className="fs-6 rounded px-4"
              onClick={(e) => addTodo(e)}
            >
              <p className="m-0 me-2">Add</p>
              <i className="bi bi-plus-lg fs-5"></i>
            </Button>
          </form>
        </Paper>
        <Paper elevation={3} className="rounded-4">
          <div className="mt-3 mt-md-5 p-3  pb-3 pb-md-5 px-md-5 h-100 overflow-auto pl">
            <CheckboxList
              todos={todos}
              deleteTodo={deleteTodo}
              toggleTodoState={toggleTodoState}
            />
          </div>
        </Paper>
      </div>
    </>
  );
}

export default App;
