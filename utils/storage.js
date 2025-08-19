const fs = require("fs");
const { TASKS_FILE } = require("../config");

function loadTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

module.exports = { loadTasks, saveTasks };
