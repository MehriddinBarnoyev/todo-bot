const { Bot, GrammyError, HttpError, session } = require("grammy");
const { loadTasks, saveTasks } = require("./utils/storage");
const createScheduler = require("./utils/scheduler");

// commands
const startCommand = require("./commands/start");
const addFlow = require("./commands/add");
const tasksCommand = require("./commands/tasks");
const completeFlow = require("./commands/complete");
const deleteFlow = require("./commands/delete");

const bot = new Bot(require("./config").BOT_TOKEN);
const scheduleReminder = createScheduler(bot); // BONUS: bitta bot instance’dan foyd.

bot.use(session({
  initial: () => ({ step: null, tempTask: {} }),
}));

// Commands
bot.command("start", startCommand);

bot.command("add", (ctx) => {
  ctx.session.step = "name";
  return ctx.reply("Vazifa nomini kiriting:");
});

bot.command("tasks", (ctx) => tasksCommand(ctx, loadTasks));

bot.command("complete", (ctx) => {
  ctx.session.step = "complete";
  return ctx.reply("Bajarilgan vazifa raqamini kiriting:");
});

bot.command("delete", (ctx) => {
  ctx.session.step = "delete";
  return ctx.reply("O‘chiriladigan vazifa raqamini kiriting:");
});

bot.command("cancel", (ctx) => {
  ctx.session.step = null;
  ctx.session.tempTask = {};
  return ctx.reply("Bekor qilindi. Yangi buyruq kiriting.");
});

// Faqat step bo‘lganda ishlaydigan umumiy handler
bot.on("message:text", (ctx) => {
  const text = ctx.message.text || "";

  // 1) Buyruqlarni ("/...") step-flow’dan chetga suramiz:
  if (text.startsWith("/")) return;

  // 2) Step bo‘yicha dispatch
  if (ctx.session.step === "name" || ctx.session.step === "time" || ctx.session.step === "priority") {
    return addFlow(ctx, loadTasks, saveTasks, scheduleReminder);
  }
  if (ctx.session.step === "complete") {
    return completeFlow(ctx, loadTasks, saveTasks);
  }
  if (ctx.session.step === "delete") {
    return deleteFlow(ctx, loadTasks, saveTasks);
  }
  // Step yo‘q — hech narsa qilmaymiz
});

// Error handling
bot.catch((err) => {
  const ctx = err.ctx;
  console.error("Xato:", err.error);
  if (err.error instanceof GrammyError) ctx.reply("Botda xato yuz berdi.");
  else if (err.error instanceof HttpError) ctx.reply("Telegram API bilan muammo.");
  else ctx.reply("Noma’lum xato.");
});

bot.start({ drop_pending_updates: true });
console.log("Bot ishga tushdi...");
