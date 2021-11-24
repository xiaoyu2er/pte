
const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const mkdirp = require('mkdirp')

var pageSize = 40;
var cookie = "53gid2=10933155388001; 53gid1=10933155388001; 53revisit=1637668758142; 53kf_72321381_from_host=pteplus.com.cn; 53kf_72321381_land_page=https%253A%252F%252Fpteplus.com.cn%252F%253Fnl%253D1; kf_72321381_land_page_ok=1; Hm_lvt_a9f964aab8ddf42df2340b2b9969997a=1637668758; _ga=GA1.3.1943407983.1637668759; _gid=GA1.3.435714842.1637668759; 53uvid=1; onliner_zdfq72321381=0; visitor_type=old; MoodleSession=92af5020b554132253b9597b1101d3d0; 53kf_72321381_keyword=https%3A%2F%2Fpteplus.com.cn%2F%3Fnl%3D1; laravel_session=mrJ4u97aqTarV5ap28yAYS5Jdh3VfZPQLei2WHS0; 53gid0=10933155388001; XSRF-TOKEN=eyJpdiI6Ink0ZnR1dGRCK2xJaTI4UTFUaTZiNXc9PSIsInZhbHVlIjoiOHEwQ3FXTnZLc1lzOGJjZm5jY2pvTFFPNTBaKzgzWUp6UERiK3h2Z2ZDc2E1TUFHXC9KcGtDMHE4Ymg2YmRNNGQxQVNMMzV1VVpLNnlEQWhvdHdhb293PT0iLCJtYWMiOiI0NTVhYTZjOTAwZjc4ZTM0ZDU1NjQxZWMyZTFiYmQ0ZDk3NWZmZTg3YWRjYjY1YWQzOTM1OGI0NDQ0YjBmNjVkIn0%3D; Hm_lpvt_a9f964aab8ddf42df2340b2b9969997a=1637735460; _gat_gtag_UA_108428449_2=1";
// var cookie = "53gid2=10933155388001; 53gid1=10933155388001; 53revisit=1637668758142; 53kf_72321381_from_host=pteplus.com.cn; 53kf_72321381_land_page=https%253A%252F%252Fpteplus.com.cn%252F%253Fnl%253D1; kf_72321381_land_page_ok=1; Hm_lvt_a9f964aab8ddf42df2340b2b9969997a=1637668758; _ga=GA1.3.1943407983.1637668759; _gid=GA1.3.435714842.1637668759; 53uvid=1; onliner_zdfq72321381=0; visitor_type=old; MoodleSession=92af5020b554132253b9597b1101d3d0; 53kf_72321381_keyword=https%3A%2F%2Fpteplus.com.cn%2F%3Fnl%3D1; laravel_session=mrJ4u97aqTarV5ap28yAYS5Jdh3VfZPQLei2WHS0; 53gid0=10933155388001; XSRF-TOKEN=eyJpdiI6Ink0ZnR1dGRCK2xJaTI4UTFUaTZiNXc9PSIsInZhbHVlIjoiOHEwQ3FXTnZLc1lzOGJjZm5jY2pvTFFPNTBaKzgzWUp6UERiK3h2Z2ZDc2E1TUFHXC9KcGtDMHE4Ymg2YmRNNGQxQVNMMzV1VVpLNnlEQWhvdHdhb293PT0iLCJtYWMiOiI0NTVhYTZjOTAwZjc4ZTM0ZDU1NjQxZWMyZTFiYmQ0ZDk3NWZmZTg3YWRjYjY1YWQzOTM1OGI0NDQ0YjBmNjVkIn0%3D; Hm_lpvt_a9f964aab8ddf42df2340b2b9969997a=1637735460"
async function getList(type, offset, pageSize) {
    var data = await fetch(`https://pteplus.com.cn/api/v3/${type}/question_list?offset=${offset}&len=${pageSize}&all=1&search_text=`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,da;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5,de;q=0.4,fr;q=0.3,pt;q=0.2,zh-CN;q=0.1",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-xsrf-token": "eyJpdiI6Ink0ZnR1dGRCK2xJaTI4UTFUaTZiNXc9PSIsInZhbHVlIjoiOHEwQ3FXTnZLc1lzOGJjZm5jY2pvTFFPNTBaKzgzWUp6UERiK3h2Z2ZDc2E1TUFHXC9KcGtDMHE4Ymg2YmRNNGQxQVNMMzV1VVpLNnlEQWhvdHdhb293PT0iLCJtYWMiOiI0NTVhYTZjOTAwZjc4ZTM0ZDU1NjQxZWMyZTFiYmQ0ZDk3NWZmZTg3YWRjYjY1YWQzOTM1OGI0NDQ0YjBmNjVkIn0=",
            "cookie": cookie,
            "Referer": `https://pteplus.com.cn/feature/exercise/${type}`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "referrer": `https://pteplus.com.cn/feature/exercise/${type}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    var json = await data.json();

    // console.log(json);
    console.log('getList', type, offset, 'done');
    return json;
}

async function getAll(type) {

    var list = [];
    var total = 0;

    var offset = 0;


    while (true) {

        var json = await getList(type, offset, pageSize);
        if (json.code !== 200) {
            break;
        }
        if (!json.message.list.length) {
            break;
        }
        total = json.message.total;
        list.push(...json.message.list);
        offset += pageSize;

        // break;
        if (list.length >= total) {
            break;
        }

    }

    return list;
}

async function getDetail(type, id) {
    var data = await fetch(`https://pteplus.com.cn/api/v3/${type}/question_detail/${id}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,da;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5,de;q=0.4,fr;q=0.3,pt;q=0.2,zh-CN;q=0.1",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-xsrf-token": "eyJpdiI6Ink0ZnR1dGRCK2xJaTI4UTFUaTZiNXc9PSIsInZhbHVlIjoiOHEwQ3FXTnZLc1lzOGJjZm5jY2pvTFFPNTBaKzgzWUp6UERiK3h2Z2ZDc2E1TUFHXC9KcGtDMHE4Ymg2YmRNNGQxQVNMMzV1VVpLNnlEQWhvdHdhb293PT0iLCJtYWMiOiI0NTVhYTZjOTAwZjc4ZTM0ZDU1NjQxZWMyZTFiYmQ0ZDk3NWZmZTg3YWRjYjY1YWQzOTM1OGI0NDQ0YjBmNjVkIn0=",
            "cookie": cookie,
            "Referer": `https://pteplus.com.cn/feature/exercise/${type}`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    var json = await data.json();
    return json;
}

async function getAllDetails(type, json) {

    var filter_json = json
        .filter(t => !t.question_translate);
    // console.log('filter_json', filter_json);

    for (var t of filter_json) {
        var detail = await getDetail(type, t.question_id);
        console.log('detail', t.question_id, 'done');
        if (detail.code == 200) {
            Object.assign(t, detail.message);
        }
    }

    return json;
}

function download(url, dest, cb) {

    var file = fs.createWriteStream(dest, {
        flags: 'wx'
    });

    http.get(url, function (response) {
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

async function getData(type) {

    var list = await getAll(type);
    // console.log(list);
    console.log('== getAll done', list.length);
    var all = await getAllDetails(type, list);
    console.log('== getAllDetails done');

    var str = '[]'
    try {
        str = JSON.stringify(all, null, 2);
    } catch (e) {
        console.error(e);
        return;
    }

    await new Promise((r) => {
        fs.writeFile(path.resolve('./data/pteplus/', type + '.json'), str, {
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

    return all;
}

function getExt(url) {
    var res = /\w+$/.exec(url)
    if (res && res.length) {
        return res[0];
    }
    return 'm4a';
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

async function downloadFiles(type, json) {
    if (!json) {
        var name = `./data/pteplus/${type}.json`;
        var json = require(`./data/pteplus/${type}.json`);
    }
    console.log('download', json.length);
    // console.log(json);

    for (var t of json) {

        var keys = ['question_image', 'question_audio'];
        for (var k of keys) {
            if (k in t) {
                var url = t[k].filename;
                if (!url) {
                    continue;
                }
                var name = t.question_id + '.' + getExt(url);
                var dest = path.resolve('./files/pteplus/', type, name);

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

        }
    }


    console.log('-- done -- ');
}


var types = [
    // 'speaking/ra',
    // 'speaking/rl',
    // 'speaking/rs',
    // 'speaking/di',
    // 'speaking/asq',
    // 'listening/sst',
    // 'listening/wfd',
    // 'listening/fil_l',
    // 'listening/hiw'
    // 'writing/swt',
    // 'writing/essay',
]

async function main() {
    for (var type of types) {
        await mkdirs(type);
        var json = await getData(type);
        await downloadFiles(type);
        console.log('-- done -- ', type);
    }
}

main();


