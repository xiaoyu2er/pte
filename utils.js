

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const mkdirp = require('mkdirp')

async function mkdirs(prefix, type) {
    await mkdirp(`./data/${prefix}/` + type.split('/')[0]);
    await mkdirp(`./files/${prefix}/${type}`);
    console.log('mkdirs', prefix, type, 'done');
}

function download(url, dest, cb) {

    var file = fs.createWriteStream(dest, {
        flags: 'wx'
    });

    var fn = http;
    if (/^https/.test(url)) {
        fn = https;
    } else {
        // console.log('-- http -- ');
    }

    fn.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            console.log('download', dest, 'done');
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        console.error('err', url, dest, err)
        fs.unlink(dest, (err) => {
            if (err) console.error(err);

            else {
                console.log('delete', dest);
            }
        }); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};

function $download(url, dest) {
    return new Promise((resolve, reject) => {
        download(url, dest, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

function getFileName(url) {
    var res = /[%\d\w_-]+\.\w+$/.exec(url)
    if (res && res.length) {
        return res[0];
    }
    return '';
}

function getExt(url) {
    var res = /\w+$/.exec(url)
    if (res && res.length) {
        return res[0];
    }
    return '';
}

function fileExists(path) {
    try {
        if (fs.existsSync(path)) {
            return true;
        }
    } catch (err) {
        console.error(err)

    }
    return false;
}

function writeDataFile(prefix, type, all) {
    var str = '[]'
    try {
        str = JSON.stringify(all, null, 2);
    } catch (e) {
        console.error(e);
        return;
    }

    return new Promise((r) => {
        fs.writeFile(path.resolve('./data/', prefix, type + '.json'), str, {
            flags: 'wx'
        }, (err) => {
            r();
            if (err) {
                console.error(err);
            } else {
                console.log('done')
            }
        })
    })
}

async function downloadFileByUrl(url, prefix, name) {
    // var name = getFileName(url);
    var ext = getExt(url);
    var dest = path.resolve(`./files/${prefix}`, name + '.' + ext);

    if (fileExists(dest)) {
        console.log(name, ' exists');
    } else {
        try {
            await $download(url, dest);
            // console.log(k, name, 'done!');
        } catch (e) {
            console.error(e);
        }
    }
}

function rename(from, to) {
    return new Promise((r, j) => {
        fs.rename(from, to, function (err) {
            if (err) {
                j(err)
            } else {
                r();
            }
        });
    })

}

module.exports = {
    mkdirs,
    $download,
    getExt,
    fileExists,
    writeDataFile,
    getFileName,
    downloadFileByUrl,
    rename,
}