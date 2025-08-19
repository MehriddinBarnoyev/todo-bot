module.exports = async (ctx) => {
  const chatId = ctx.chat.id;

  if (!ctx.session.step) {
    ctx.session.step = "name";
    ctx.reply("Vazifa nomini kiriting:");
    return;
  }

  if (ctx.session.step === "name") {
    ctx.session.tempTask = { name: ctx.message.text };
    ctx.session.step = "time";
    ctx.reply("Vazifa vaqtini kiriting (kk.oo.yy ss:dd):");
    return;
  }

  if (ctx.session.step === "time") {
    const regex = /^(\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/;
    const time = ctx.message.text;

    if (!regex.test(time)) {
      ctx.reply("Format noto‘g‘ri! Masalan: 21.07.25 14:30");
      return;
    }

    const [_, day, month, year, hour, minute] = time.match(regex);
    const date = new Date(`20${year}-${month}-${day} ${hour}:${minute}:00`);

    if (isNaN(date.getTime())) {
      ctx.reply("Sana noto‘g‘ri!");
      return;
    }

    ctx.session.tempTask.time = date.toISOString();
    ctx.session.step = "priority";
    ctx.reply("Darajani kiriting (low, medium, high):");
    return;
  }

  if (ctx.session.step === "priority") {
    const priority = ctx.message.text.toLowerCase();
    if (!["low", "medium", "high"].includes(priority)) {
      ctx.reply("Faqat low, medium yoki high bo‘lishi mumkin!");
      return;
    }

    const { loadTasks, saveTasks } = require("../utils/storage");
    const scheduleReminder = require("../utils/scheduler");

    let tasks = loadTasks();
    if (!tasks[chatId]) tasks[chatId] = [];

    const task = {
      id: Date.now(),
      name: ctx.session.tempTask.name,
      time: ctx.session.tempTask.time,
      priority,
      status: "active",
    };

    tasks[chatId].push(task);
    saveTasks(tasks);

    scheduleReminder(chatId, task, new Date(task.time));

    ctx.reply("Vazifa qo‘shildi!");
    ctx.session.step = null;
    ctx.session.tempTask = {};
  }
};
