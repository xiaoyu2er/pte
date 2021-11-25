const { mkdirs } = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

function handleAsq() {
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
        .sort((a, b) => {
            return b.wpId - a.wpId
        })
        .map(t => {

            var obj = {
                id: t.wpId,
                q: t.question,
                a: t.answer
            }

            obj.zh = t.postContentFiltered;

            return obj;
        })
        .map((t) => {
            var str = '## ' + t.id + '\n' + t.q + '\n\n';

            str += t.a + '\n\n';

            if (t.zh) {


                str += `
<details>
<summary>翻译</summary>

${t.zh}

</details>
            `
            }
            return str;
        })
        .join('\n\n');

    return str
}



async function main() {
    var str = handleAsq();
    await mkdirp('./text/ytaxx/speaking');
    fs.writeFileSync('./text/ytaxx/speaking/asq.md', str, { flag: 'wx' });
}


main();