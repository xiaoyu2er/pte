const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const prefix = 'ytaxx';
const { mkdirs, getFileName, fileExists, $download, getExt, writeDataFile, downloadFileByUrl } = require('./utils');
const { rename } = require('fs/promises');

var pageSize = 30;

// 不需要登录信息……

async function getList(type, categories, page, pageSize) {
    var url = `https://www.ytaxx.com/api/postsV2/list?isFull=0&type=1&color=0&epodes=0&page=${page}&perPage=${pageSize}&isReal=0&categories=${categories}`;
    // console.log(url);
    var data = await fetch(url, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9,da;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5,de;q=0.4,fr;q=0.3,pt;q=0.2,zh-CN;q=0.1",
            "clienttype": "pcweb",
            "content-type": "application/json;charset=utf-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "serviceversion": "20",
            "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvTWhqRTFTMG9QWGlkZFFiaVp2UDJYRW9LNXRjIiwiYXVkIjoid2ViIiwiZXhwIjoxNjQwMjY2MDQyLCJpYXQiOjE2Mzc2NzQwNDJ9.mAAgALLsSdeg2-cqzw2GhjnrHuf4yZaf_We0ifqSphD2iO35psKt7O5qHJqa6b3l0o_94ox9pTWRrb3yOCAX9A",
            "uuid": "a50737a1287d82fdce5882c2845a70c5",
            "Referer": "https://ytaxx.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    var json = await data.json();

    // console.log(json);
    console.log('getList', type, page, 'done');
    return json;
}

async function getAll(type, categories) {

    var list = [];
    var total = 0;
    var page = 1;

    while (true) {
        var json = await getList(type, categories, page, pageSize);
        if (json.code !== 0) {
            break;
        }
        if (!json.data.posts.length) {
            break;
        }
        total = json.data.total;
        list.push(...json.data.posts);
        page += 1;

        // break;
        if (list.length >= total) {
            break;
        }

    }

    return list;
}

async function getDetail(type, wpId = '', questionsId = '') {
    var url = `https://www.ytaxx.com/api/postsV2/${type}?wpId=${wpId}`;
    if (questionsId) {
        url += `&questionsId=${questionsId}`
    }

    // console.log(url);

    var data = await fetch(url, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9,da;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5,de;q=0.4,fr;q=0.3,pt;q=0.2,zh-CN;q=0.1",
            "clienttype": "pcweb",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "serviceversion": "20",
            "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvTWhqRTFTMG9QWGlkZFFiaVp2UDJYRW9LNXRjIiwiYXVkIjoid2ViIiwiZXhwIjoxNjQwMjY2MDQyLCJpYXQiOjE2Mzc2NzQwNDJ9.mAAgALLsSdeg2-cqzw2GhjnrHuf4yZaf_We0ifqSphD2iO35psKt7O5qHJqa6b3l0o_94ox9pTWRrb3yOCAX9A",
            "uuid": "a50737a1287d82fdce5882c2845a70c5",
            "Referer": "https://ytaxx.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });;

    var json = await data.json();
    return json;
}

async function getAllDetails(type, json) {

    var filter_json = json;
    var arr = [];
    var ids = [];
    // .filter(t => !t.question_translate);
    // console.log('filter_json', filter_json);

    for (var t of filter_json) {
        var detail = await getDetail(type, t.id, t.questionsId,);
        console.log('detail', t.id, 'done');
        if (detail.code == 0) {
            if (detail.data && detail.data.datas && detail.data.datas[0]) {
                var data = detail.data.datas[0];
                var wpId = data.wpId;
                if (ids.indexOf(wpId) == -1) {
                    arr.push(data);
                    ids.push(wpId);
                } else {
                    console.log('--- detail', wpId, 'is exits');
                    return arr;
                }
            }
        }
    }
    return arr;
}



async function getData(type, categories) {

    var list = await getAll(type, categories);

    var str = list.map(t => {
        return `wpId ${t.id} qId ${t.questionsId}`
    })
        .join('\n');

    console.log(str);

    // console.log(list);
    console.log('== getAll done', list.length);

    var all = await getAllDetails(type, list);
    // console.log('== getAllDetails done', all.length);

    await writeDataFile(prefix, type, all);

    return all;
}


async function downloadFiles(type, json) {
    if (!json) {
        var json = require(`./data/${prefix}/${type}.json`);
    }
    console.log('download', json.length);


    for (var t of json) {
        var keys = ['imagePath', 'audioPath'];
        for (var k of keys) {
            if (k in t) {
                var url = t[k];
                if (!url) {
                    continue;
                }
                var name = t.wpId;
                await downloadFileByUrl(url, prefix + '/' + type, name)
            }
        }
    }

    console.log('downloadFiles done');
}

var categories = {
    'speaking/retellLecture': 25,
    'speaking/repeatSentence': 26,
    'speaking/answerShortQuestion': 22,
    'listening/summarizeSpokenText': 33,
    'listening/writeFromDictation': 34,
    'listening/lFillInTheBlanks': 27,
    'writing/summarizeWrittenText': 20,
    'writing/summarizeWrittenText': 21
}

var types = [
    // 'speaking/retellLecture',
    // 'speaking/repeatSentence',
    // 'speaking/answerShortQuestion',
    // 'listening/summarizeSpokenText',
    // 'listening/writeFromDictation',
    'listening/lFillInTheBlanks',
    // 'writing/summarizeWrittenText',
    // 'writing/writeEssay'
]

async function renames(type, json) {
    if (!json) {
        var json = require(`./data/${prefix}/${type}.json`);
    }

    for (var t of json) {
        var keys = ['imagePath', 'audioPath'];
        for (var k of keys) {
            if (k in t) {
                var url = t[k];
                if (!url) {
                    continue;
                }
                var id = t.wpId;
                var suffix = getFileName(url);
                var ext = getExt(url);
                var newName = path.resolve(`./files/${prefix}`, type, id + '.' + ext);
                var oldName = path.resolve(`./files/${prefix}`, type, suffix);
                // await downloadFileByUrl(url, prefix + '/' + type, old)
                await rename(oldName, newName);
            }
        }
    }

}

async function main() {
    for (var type of types) {
        await mkdirs(prefix, type);
        var json = await getData(type, categories[type]);
        await downloadFiles(type);
        // await renames(type);
        console.log('-- all done -- ', type);
    }
}

main();


