# Drag-and-Drop Kanban Board

This is a simple drag-and-drop Kanban board, built with React and TypeScript.

## Features

This project features the ability to create new columns, drag and reorder columns, edit column titles, and delete columns.

You can also create new tasks inside of the columns, edit the tasks, and drag-and-drop to reorder the tasks within the column, or to move the task to another column.

The project also stored the columns and tasks in localStorage, so that they persist when the user navigates back to the project URL.

### Technologies used:

- Vite (React)
- TypeScript
- Tailwind CSS
- [@dnd-kit](https://www.npmjs.com/package/@dnd-kit/core) - a lightweight React library for building performant and accessible drag and drop experiences.
- [@dnd-kit/sortable](https://www.npmjs.com/package/@dnd-kit/sortable)
- React Context and useReducer
- Custom hooks

### License
This repo is under an MIT license.