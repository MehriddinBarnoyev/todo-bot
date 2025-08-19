module.exports = (ctx, loadTasks, saveTasks) => {
  if (ctx.session.step !== "delete") return;

  const chatId = ctx.chat.id;
  const raw = (ctx.message.text || "").trim();

  const index = Number.parseInt(raw, 10) - 1;
  let tasks = loadTasks();

  if (!tasks[chatId] || !Array.isArray(tasks[chatId]) || tasks[chatId].length === 0) {
    ctx.session.step = null;
    return ctx.reply("Sizda o‘chirish uchun vazifa yo‘q.");
  }

  if (!Number.isInteger(index) || index < 0 || index >= tasks[chatId].length) {
    return ctx.reply("Noto‘g‘ri raqam! /tasks ni ko‘rib, to‘g‘ri raqam kiriting yoki /cancel qiling.");
  }

  const [removed] = tasks[chatId].splice(index, 1);
  saveTasks(tasks);

  ctx.session.step = null;
  return ctx.reply(`O‘chirildi: "${removed.name}"`);
};
