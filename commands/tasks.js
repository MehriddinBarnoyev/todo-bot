module.exports = (ctx, loadTasks) => {
  const chatId = ctx.chat.id;
  const tasks = loadTasks()[chatId] || [];

  if (tasks.length === 0) {
    ctx.reply("Sizda vazifalar yo‘q.");
    return;
  }

  let response = "📋 Vazifalar:\n\n";
  tasks.forEach((task, i) => {
    response += `${i + 1}. ${task.name}\n` +
                `Vaqti: ${new Date(task.time).toLocaleString("uz-UZ")}\n` +
                `Daraja: ${task.priority}\n` +
                `Holati: ${task.status}\n\n`;
  });

  ctx.reply(response);
};
