import Dexie, { Table } from 'dexie'
import { populate } from './populate'
// import { TodoItem } from './TodoItem'
// import { TodoList } from './TodoList'

export interface TodoItem {
  id?: number
  todoListId: number
  title: string
  done?: boolean
}

export interface TodoList {
  id?: number
  title: string
}

export async function populate(): Promise<void> {
  const todoListId = await db.todoLists.add({
    title: 'To Do Today',
  })
  await db.todoItems.bulkAdd([
    {
      todoListId,
      title: 'Feed the birds',
    },
    {
      todoListId,
      title: 'Watch a movie',
    },
    {
      todoListId,
      title: 'Have some sleep',
    },
  ])
}

export class TodoDB extends Dexie {
  todoLists!: Table<TodoList, number>
  todoItems!: Table<TodoItem, number>
  constructor() {
    super('TodoDB')
    this.version(1).stores({
      todoLists: '++id',
      todoItems: '++id, todoListId',
    })
  }

  deleteList(todoListId: number) {
    return this.transaction('rw', this.todoItems, this.todoLists, () => {
      this.todoItems.where({ todoListId }).delete()
      this.todoLists.delete(todoListId)
    })
  }
}

export const db = new TodoDB()

db.on('populate', populate)

export function resetDatabase() {
  return db.transaction('rw', db.todoLists, db.todoItems, async () => {
    await Promise.all(db.tables.map((table) => table.clear()))
    await populate()
  })
}
