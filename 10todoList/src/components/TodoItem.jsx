import { useState } from "react"
import { useTodo } from "../contexts/TodoContext"

function TodoItem({ todo }) {
    const [isTodoEditable, setIsTodoEditable] = useState(false)
    const [todoMsg, setTodoMsg] = useState(todo.todo)
    const { updateTodo, deleteTodo, toggleComplete } = useTodo()

    const editTodo = () => {
        updateTodo(todo.id, { ...todo, todo: todoMsg })
        setIsTodoEditable(false)
    }

    const toggleCompleted = () => {
        toggleComplete(todo.id)
    }

    return (
        <div>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={toggleCompleted}
            />
            <input
                type="text"
                value={todoMsg}
                readOnly={!isTodoEditable}
                onChange={(e) => setTodoMsg(e.target.value)}
            />
            <button onClick={() => {
                if (isTodoEditable) {
                    editTodo()
                } else {
                    setIsTodoEditable(true)
                }
            }}>
                {isTodoEditable ? "Save" : "Edit"}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>
                Delete
            </button>
        </div>
    )
}

export default TodoItem