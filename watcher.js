var fs = require('fs'),
    TeleBot = require('telebot'),
    configuration,
    bot;

try {
    configuration = JSON.parse(
        fs.readFileSync(process.argv[2])
    );
} catch (e) {
    console.log("configuration file not valid", e);
    process.exit(-1);
}

bot = new TeleBot(configuration.telegramBotAPIKey);

configuration.pathsToWatch.map(function(path) {
    console.log(`Watching ${path} ...`);
    fs.watch(path, {encoding: 'string', recursive: false}, (eventType, filename) => {
        if (filename) {
            fs.lstat(`${path}/${filename}`, (err, stats) => {
                if (stats) {
                    if ((eventType == 'change' && stats.isFile()) || (eventType == 'rename' && stats.isDirectory())) {
                        bot.sendMessage(configuration.telegramChatId, `fsWatcher. New resource found: ${filename}`);
                    }
                }
            });
        }
    });
});
