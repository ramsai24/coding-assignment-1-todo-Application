const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const format = require("date-fns/format");

const isValid = require("date-fns/isValid");

console.log(format(new Date(2023, 4, 1), "yyyy-M-d"));

let dateLen = "2023-04-01".length;
console.log(dateLen);

let day = new Date("2023-4-1");
console.log(day);

const a = format(new Date("2023-4-1"), "yyyy-M-d");
console.log(a.length);

const b = format(new Date("2023-4-1"), "yyyy-MM-dd");
console.log(a == b);

const path = require("path");

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running at http://localhost:3000/`);
    });
  } catch (e) {
    console.log(`DB error : '${e.message}'`);
  }
};

initializeDBAndServer();

//API 1

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q, category } = request.query;

  console.log(status, priority, search_q, category);

  //scenario 3
  if (priority !== undefined && status !== undefined) {
    if (priority === "HIGH" && status === "IN PROGRESS") {
      const priorityAndStatusQuery = `
      SELECT * FROM todo WHERE priority = "${priority}" AND status = "${status}";`;

      const priorityAndStatusList = await db.all(priorityAndStatusQuery);
      response.send(
        priorityAndStatusList.map((each) => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          };
        })
      );
    }
  }

  //scenario 5
  else if (category !== undefined && status !== undefined) {
    if (category === "WORK" && status === "DONE") {
      const categoryAndStatusQuery = `
      SELECT * FROM todo WHERE category LIKE "${category}" AND status LIKE "${status}";`;

      const categoryAndStatusList = await db.all(categoryAndStatusQuery);

      console.log(categoryAndStatusList);

      response.send(
        categoryAndStatusList.map((each) => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          };
        })
      );
    }
  }

  //scenario 7
  else if (category !== undefined && priority !== undefined) {
    if (category === "LEARNING" && priority === "HIGH") {
      const categoryAndpriorityQuery = `
      SELECT * FROM todo WHERE category LIKE "${category}" AND priority LIKE "${priority}";`;

      const categoryAndpriorityList = await db.all(categoryAndpriorityQuery);

      console.log(categoryAndpriorityList);

      response.send(
        categoryAndpriorityList.map((each) => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          };
        })
      );
    }
  }

  //scenario 1
  else if (status !== undefined) {
    if (status === "TO DO") {
      const statusQuery = `
      SELECT * FROM todo WHERE status = "${status}";`;

      const statusList = await db.all(statusQuery);
      response.send(
        statusList.map((each) => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          };
        })
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  }

  //scenario 2
  else if (priority !== undefined) {
    if (priority === "HIGH") {
      const priorityQuery = `
      SELECT * FROM todo WHERE priority = "${priority}";`;

      const priorityList = await db.all(priorityQuery);
      response.send(
        priorityList.map((each) => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          };
        })
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  }

  //scenario 4
  else if (search_q !== undefined) {
    const search_qQuery = `
      SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;

    const search_qList = await db.all(search_qQuery);
    console.log(search_qList);
    response.send(
      search_qList.map((each) => {
        return {
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each.due_date,
        };
      })
    );
  }
  //scenario 6
  else if (category !== undefined) {
    if (category === "HOME") {
      const categoryQuery = `
      SELECT * FROM todo WHERE category = "${category}";`;

      const categoryList = await db.all(categoryQuery);
      response.send(
        categoryList.map((each) => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          };
        })
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  }
});

//API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getTodoItemQuery = `
    SELECT * FROM todo WHERE id = ${todoId};`;

  const specificTodo = await db.get(getTodoItemQuery);

  response.send({
    id: specificTodo.id,
    todo: specificTodo.todo,
    priority: specificTodo.priority,
    status: specificTodo.status,
    category: specificTodo.category,
    dueDate: specificTodo.due_date,
  });
});

//API 3
app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  console.log(date);

  if (isValid(new Date(date))) {
    const getTodoItemQuery = `
    SELECT * FROM todo WHERE due_date LIKE '${format(
      new Date(date),
      "yyyy-MM-dd"
    )}';`;

    const specificAllTodo = await db.all(getTodoItemQuery);

    response.send(
      specificAllTodo.map((specificTodo) => {
        return {
          id: specificTodo.id,
          todo: specificTodo.todo,
          priority: specificTodo.priority,
          status: specificTodo.status,
          category: specificTodo.category,
          dueDate: specificTodo.due_date,
        };
      })
    );
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//API 4

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;

  console.log(id, todo, priority, status, category, dueDate);
  let statusItemsList = ["TO DO", "IN PROGRESS", "DONE"];
  let priorityList = ["HIGH", "MEDIUM", "LOW"];
  let categoryList = ["WORK", "HOME", "LEARNING"];

  if (
    (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") &&
    (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") &&
    (category === "WORK" || category === "HOME" || category === "LEARNING") &&
    isValid(new Date(dueDate))
  ) {
    const createTodoQuery = `
    INSERT INTO todo (id, todo, priority, status, category, due_date)
    VALUES (${id}, '${todo}', '${priority}', '${status}', '${category}', '${format(
      new Date(dueDate),
      "yyyy-MM-dd"
    )}');`;

    const updateTodoDB = await db.run(createTodoQuery);

    console.log(updateTodoDB.lastID);

    response.send("Todo Successfully Added");
  } else {
    if (!statusItemsList.includes(status)) {
      response.status(400);
      response.send("Invalid Todo Status");
    } else if (!priorityList.includes(priority)) {
      response.status(400);
      response.send("Invalid Todo Priority");
    } else if (!categoryList.includes(category)) {
      response.status(400);
      response.send("Invalid Todo Category");
    } else if (isValid(new Date(date)) === false) {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }
});

// //API 4

// app.post("/todos/", async (request, response) => {
//   const { todoId } = request.params;
//   const { id, todo, priority, status, category, dueDate } = request.body;

//   console.log(id, status, priority, todo, dueDate, category);

//   //scenario 1
//   if (status !== undefined) {
//     if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
//       const createTodoQuery = `
//     INSERT INTO todo (id, todo, priority, status, category, due_date)
//     VALUES (${id}, '${todo}', '${priority}', '${status}', '${category}', '${format(
//         new Date(dueDate),
//         "yyyy-MM-dd"
//       )}');`;

//       await db.run(createTodoQuery);
//       response.send("Status Updated");
//     } else {
//       response.status(400);
//       response.send("Invalid Todo Status");
//     }
//   }

//   //scenario 2
//   else if (priority !== undefined) {
//     if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
//       const createTodoQuery = `
//     INSERT INTO todo (id, todo, priority, status, category, due_date)
//     VALUES (${id}, '${todo}', '${priority}', '${status}', '${category}', '${format(
//         new Date(dueDate),
//         "yyyy-MM-dd"
//       )}');`;
//       await db.run(createTodoQuery);
//       response.send("Priority Updated");
//     } else {
//       response.status(400);
//       response.send("Invalid Todo Priority");
//     }
//   }

//   //scenario 3
//   else if (todo !== undefined) {
//     const createTodoQuery = `
//     INSERT INTO todo (id, todo, priority, status, category, due_date)
//     VALUES (${id}, '${todo}', '${priority}', '${status}', '${category}', '${format(
//       new Date(dueDate),
//       "yyyy-MM-dd"
//     )}');`;
//     await db.run(createTodoQuery);
//     response.send("Todo Updated");
//   }

//   //scenario 4
//   else if (category !== undefined) {
//     if (category === "WORK" || category === "HOME" || category === "LEARNING") {
//       const createTodoQuery = `
//     INSERT INTO todo (id, todo, priority, status, category, due_date)
//     VALUES (${id}, '${todo}', '${priority}', '${status}', '${category}', '${format(
//         new Date(dueDate),
//         "yyyy-MM-dd"
//       )}');`;
//       await db.run(createTodoQuery);
//       response.send("Category Updated");
//     } else {
//       response.status(400);
//       response.send("Invalid Todo Category");
//     }
//   }

//   //scenario 5
//   else if (dueDate !== undefined) {
//     console.log(isValid(new Date(dueDate)));
//     if (isValid(new Date(dueDate))) {
//       const createTodoQuery = `
//     INSERT INTO todo (id, todo, priority, status, category, due_date)
//     VALUES (${id}, '${todo}', '${priority}', '${status}', '${category}', '${format(
//         new Date(dueDate),
//         "yyyy-MM-dd"
//       )}');`;
//       await db.run(createTodoQuery);
//       response.send("Due Date Updated");
//     } else {
//       response.status(400);
//       response.send("Invalid Due Date");
//     }
//   }
// });

//API 5

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo, search_q, dueDate, category } = request.body;

  console.log(status, priority, todo, search_q, dueDate, category);

  //scenario 1
  if (status !== undefined) {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      const statusQuery = `
      UPDATE todo SET status = "${status}" WHERE id = ${todoId};`;

      await db.run(statusQuery);
      response.send("Status Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  }

  //scenario 2
  else if (priority !== undefined) {
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
      const priorityQuery = `
      UPDATE todo SET priority = "${priority}" WHERE id = ${todoId};`;

      await db.run(priorityQuery);
      response.send("Priority Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  }

  //scenario 3
  else if (todo !== undefined) {
    const todoQuery = `
      UPDATE todo SET todo = "${todo}" WHERE id = ${todoId};`;

    await db.run(todoQuery);
    response.send("Todo Updated");
  }

  //scenario 4
  else if (category !== undefined) {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      const categoryQuery = `
      UPDATE todo SET category = "${category}" WHERE id = ${todoId};`;

      await db.run(categoryQuery);
      response.send("Category Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  }

  //scenario 5
  else if (dueDate !== undefined) {
    console.log(isValid(new Date(dueDate)));
    if (isValid(new Date(dueDate))) {
      const dueDateQuery = `
      UPDATE todo SET due_date = "${format(
        new Date(dueDate),
        "yyyy-MM-dd"
      )}" WHERE id = ${todoId};`;

      await db.run(dueDateQuery);
      response.send("Due Date Updated");
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }
});

//API 6

app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;

  const delelteQuery = `
      DELETE FROM todo WHERE id = ${todoId};`;

  await db.run(delelteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
