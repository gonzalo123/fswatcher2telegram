var fs = require('fs'),
    TeleBot = require('telebot'),
    basePath = '/mnt/media/torrent/Descargas',
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
    console.log(`Watching ${path}...`);
    fs.watch(path, {encoding: 'string', recursive: false}, (eventType, filename) => {
        if (filename && eventType == 'rename') {
            fs.lstat(path, (err, stats) => {
                if (stats && (stats.isDirectory() || stats.isFile())) {
                    bot.sendMessage(configuration.telegramChatId, `New resource found at ${filename}`);
                }
            });
        }
    });
});
