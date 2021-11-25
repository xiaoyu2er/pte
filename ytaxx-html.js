const { mkdirs, fileExists, getExt } = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

function handleAsq(needTrans) {
    var asq = require('./data/ytaxx/speaking/answerShortQuestion.json');
    var demo = {
        "id": 25071,
        "questionsTypeCode": "answerShortQuestion",
        "title": "Warehouse",
        "answer": "Warehouse",
        "question": "Where are goods stored before sale?",
        "audioPath": "https://res.ytaxx.com/pte/tts/20210830/b0540fff0dcf4972ae268231b972ad21.mp3",
        "status": 0,
        "maxRecordingTime": 10,
        "audioPlayAfter": 1,
        "orderId": 573,
        "preId": 25067,
        "nextId": 25081,
        "isReal": 1,
        "isCollection": 0,
        "isCollect": 0,
        "isRead": 1,
        "frequency": 0,
        "commentCount": 0,
        "postContentFiltered": "<p class=\"src grammarSection\" data-group=\"1-1\">销售前货物存放在哪里?<br />-仓库</p>",
        "slugName": "ASQ",
        "slugId": 22,
        "link": "https://www.ytaxx.com/info/40604.html",
        "createTime": 1630303221000,
        "hot": 1,
        "parentCode": "speaking",
        "postPassword": "",
        "wpId": 40604,
        "examCount": 0,
        "phonetic": "/ˈweəhaʊs/",
        "dictAudio": "http://res.iciba.com/resource/amp3/oxford/0/b5/e6/b5e6eae4900928997e520f5d3e4a6596.mp3"
    };

    var str = asq
        .filter(t => t.question && t.answer)
        .sort((a, b) => {
            return b.wpId - a.wpId
        })
        .map(t => {

            var obj = {
                id: t.wpId,
                q: t.question,
                a: t.answer,
                url: t.audioPath
            }

            obj.zh = t.postContentFiltered;

            return obj;
        })
        .map((t) => {
            var str = '<h2>' + t.id + '</h2>';
            str += `<p>${t.q}</p>`

            str += `<p>${t.a}</p>`;

            if (needTrans && t.zh) {


                str += `
<details>
<summary>翻译</summary>

${t.zh}

</details>
            `
            }
            // var name = getFileName(url);
            if (t.url) {
                var ext = getExt(t.url);

                str += `
    <audio
        controls
        src="../../../files/ytaxx/speaking/answerShortQuestion/${t.id}.${ext}">
        </audio>
            `
            }

            return str;
        })
        .join('\n');


    //  <link type="text/css" rel="stylesheet" href="http://necolas.github.io/normalize.css/8.0.1/normalize.css"> 
    return `

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        
        <style>
        body {
            max-width: 720px;
    padding: 20px 40px;
    margin: 0 auto;
        }
        .container {
            padding: 40px 60px 0;
    margin: 0 0 3em;
    background: #fff;
   
    box-shadow: 2px 4px 6px 1px rgb(50 50 50 / 14%);
        }
        </style>
    </head>
    <body>
        <div class="container">
        ${str}
        </div>
        
    </body>
    </html>    `
}



async function main() {
    await mkdirp('./html/ytaxx/speaking');


    var str = handleAsq(true);
    var path = './html/ytaxx/speaking/asq.html';
    if (fileExists(path)) {
        fs.unlinkSync(path)
    }
    fs.writeFileSync(path, str, { flag: 'wx' });


}


main();