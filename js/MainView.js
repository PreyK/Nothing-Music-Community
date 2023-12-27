
var Permissions = require("PermissionManager");
var Observable = require("FuseJS/Observable");
Permissions.RequestPermissions();
var FileSystem = require('FuseJS/FileSystem');
var musicPath = Observable("/storage/emulated/0/Music");
var files = Observable();
var player = require("js/MusicPlayer");
var query = require("MetadataQueryModule");

function pathToName(str) {
    if (str === "/")
        return str;
    var lastSep = str.lastIndexOf("/");
    if (lastSep === null)
        return str;
    return str.substring(lastSep + 1);
}
Permissions.on("onPermissionRecieved", function (message) {
    CollectDirectories(musicPath.value);
    directories.forEach(function (dir) {
        var localFiles = FileSystem.listFilesSync(dir);
        localFiles.forEach(file => {
            var ext = file.split('.').pop();
            if (isAudio(ext.toUpperCase())) {
                files.add({
                    name: pathToName(file),
                    path: file,
                    length: 0,
                    trackName: query.QueryTrackName(file)?query.QueryTrackName(file).toUpperCase():pathToName(file),
                    trackArtist: query.QueryTrackArtist(file)?query.QueryTrackArtist(file).toUpperCase():"UNKNOWN ARTIST",
                    directory: dir,
                    artwork: GetAlbumCover(dir)
                });
            }
        });
    });
});
//https://developer.android.com/guide/topics/media/platform/supported-formats
var audioFiles = ["3GP", "MP4", "M4A", "AAC", "AMR", "FLAC", "MP3", "MKV", "OGG", "VAW"];
var imageFiles = ["JPG", "JPEG", "PNG"];
function GetAlbumCover(dir) {
    var localFiles = FileSystem.listFilesSync(dir);
    for (var i = 0; i < localFiles.length; i++) {
        var n = localFiles[i];
        var ext = n.split('.').pop();
        if (imageFiles.includes(ext.toUpperCase()))
            return n;
    }
    return "mockup/default.jpg";
}

function isAudio(ext) {
    return audioFiles.includes(ext);
}

var directories = Observable();
var files = Observable();
function CollectDirectories(path) {
    var dir = FileSystem.listDirectoriesSync(path);
    directories.add(path);
    dir.forEach(subdir => {
        CollectDirectories(subdir);
    });
}

function clicked(item) {
    player.play({
        "id": 1,
        "name": item["data"]["trackName"],
        "artist": item["data"]["trackArtist"],
        "url": item["data"]["path"],
        "artworkUrl": item["data"]["artwork"],
        "duration": 139
    });
    player.CreateBars();

    router.push("subPage", { title: "title" })
}

module.exports = {
    files: files,
    clicked: clicked,
    player: player
};