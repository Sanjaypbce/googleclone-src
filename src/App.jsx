import React, { useState, useEffect } from "react";
import { Input, Button, List, Typography } from "antd";
import axios from "axios";
const { TextArea } = Input;
import "./App.css";
const App = () => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const result = axios
      .get("http://localhost:5000/todos")
      .then((response) => {
        setTasks(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("There was an error!", error));
  }, []);

  const addTask = () => {
    if (task != "") {
      axios
        .post("http://localhost:5000/todos", {
          name: task,
          description: description,
          completed: false,
        })
        .then((response) => setTasks([...tasks, response.data]))
        .catch((error) => console.error("There was an error!", error));
      setTask("");
      setDescription("");
    }
  };

  const removeTask = (id) => {
    axios
      .delete(`http://localhost:5000/todos/${id}`)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error("There was an error!", error));
  };

  const completeTask = (id, completed) => {
    axios
      .put(`http://localhost:5000/todos/${id}`, { complete: !completed })
      .then((response) => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, complete: !completed } : task
          )
        );
      })
      .catch((error) => console.error("There was an error!", error));
  };

  return (
    <div className="mainContainer">
      <div style={{ height: "50px" }}></div>
      <div
        style={{
          maxWidth: "600px",
          margin: "0px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 2.20), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Typography.Title level={2}>To-Do List</Typography.Title>
        <Input
          placeholder="Add a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onPressEnter={addTask}
          style={{ marginBottom: "10px" }}
        />
        <TextArea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter the discription about the task"
        />
        <Button
          type="primary"
          onClick={addTask}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          Add Task
        </Button>
        <List
          bordered
          dataSource={tasks}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => completeTask(item.id, item.complete)}
                >
                  {item.complete ? "  Undo  " : "Complete"}
                </Button>,
                <Button danger onClick={() => removeTask(item.id)}>
                  Remove
                </Button>,
              ]}
              style={{
                textDecoration: item.complete ? "line-through" : "none",
              }}
            >
              {item.name}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default App;
