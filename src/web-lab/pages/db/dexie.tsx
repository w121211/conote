import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, resetDatabase, TodoItem, TodoList } from './dexie-db'

const TodoItemView = ({ item }: { item: TodoItem }) => {
  return (
    <div className={'row ' + (item.done ? 'done' : '')}>
      <div className="narrow">
        <input
          type="checkbox"
          checked={!!item.done}
          onChange={(ev) =>
            db.todoItems.update(item, {
              done: ev.target.checked,
            })
          }
        />
      </div>
      <div className="todo-item-text">{item.title}</div>
      <div className="todo-item-trash">
        <a
          onClick={() => db.todoItems.delete(item.id ?? -1)}
          title="Delete item"
        >
          icon
        </a>
      </div>
    </div>
  )
}

const TodoListView = ({ todoList }: { todoList: TodoList }) => {
  const items = useLiveQuery(
    () => db.todoItems.where({ todoListId: todoList.id }).toArray(),
    [todoList.id]
  )

  if (!items) return null

  return (
    <div className="box">
      <div className="grid-row">
        <h2>{todoList.title}</h2>
        <div className="todo-list-trash">
          <a
            onClick={() => db.deleteList(todoList.id ?? -1)}
            title="Delete list"
          ></a>
        </div>
      </div>
      <div>
        {items.map((item) => (
          <TodoItemView key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

const TodoLists = () => {
  const lists = useLiveQuery(() => db.todoLists.toArray())

  if (!lists) return null

  return (
    <div>
      {lists.map((list) => (
        <TodoListView key={list.id} todoList={list} />
      ))}
    </div>
  )
}

const Page = (): JSX.Element | null => {
  const lists = useLiveQuery(() => db.todoLists.toArray())
  return (
    <div>
      <button
        onClick={() => {
          resetDatabase()
        }}
      >
        Reset Database
      </button>
      <TodoLists />
    </div>
  )
}

// db.docs
//   .add({ name: 'Josephine', age: 21 })
//   .then(() => {
//     return db.friends.where('age').below(25).toArray()
//   })
//   .then((youngFriends) => {
//     alert('My young friends: ' + JSON.stringify(youngFriends))
//   })
//   .catch((e) => {
//     alert('error: ' + e.stack || e)
//   })

export default Page
