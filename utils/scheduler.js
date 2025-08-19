const schedule = require("node-schedule");
const { Bot } = require("grammy");

module.exports = function scheduleReminder(chatId, task, date) {
  schedule.scheduleJob(date, () => {
    const bot = new Bot(require("../config").BOT_TOKEN);
    bot.api.sendMessage(
      chatId,
      `Eslatma: "${task.name}" vazifasi vaqti keldi! (Daraja: ${task.priority})`
    );
  });
};
