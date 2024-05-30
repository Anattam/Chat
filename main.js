var fs= require("fs");

console.log("Going to get file info!");
fs.Stats('input.txt', function (err,stats) {
    if (err) {
        return console.error(err);
    }
    console.log(stats);
    console.log("Got the info!");

    console.log("isFile?"+ stats.isFile());
console.log("isDirectory?"+ stats.isDirectory() );
});

