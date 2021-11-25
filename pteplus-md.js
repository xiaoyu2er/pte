const { mkdirs, fileExists } = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

function handleAsq(needTrans) {
    var asq = require('./data/pteplus/speaking/asq.json');
    var demo = {
        "question_id": 14978,
        "timecreated": 1635404781,
        "timemodified": 1635404781,
        "sub_type": "No Subtype",
        "type_id": 200005,
        "question_title": "",
        "question_text": "What do we call a device that cuts grass?",
        "question_answer": "Mower",
        "question_content": "",
        "question_explain": "",
        "highfreq": 0,
        "highfreq_order": 0,
        "weekly_repeat": 0,
        "course_type_id": 0,
        "question_type": "asq",
        "course_type_name_en": null,
        "course_type_name_zh": null,
        "course_type_name_th": null,
        "video_id": null,
        "question_audio": {
            "filename": "https://pteplus.com.cn/api/v3/moodle_file/96474ff98acb817ece457db7165d0fcd35726e61.mp3",
            "mimetype": "audio/mp3"
        },
        "question_image": {},
        "section": "speaking",
        "tags": [
            "keyking",
            "new_question"
        ],
        "highfreq_month": "",
        "il_count": 0,
        "practised_count": 0,
        "is_like": 0,
        "waiting_time": 3,
        "record_time": 10,
        "is_keyking": 1,
        "read_only": 0,
        "is_autoplay": false,
        "question_translate": {
            "text_translate": "[{\"src\":\"What do we call a device that cuts grass?\",\"dst\":\"割草的装置叫什么？\"}]",
            "content_translate": null,
            "answer_translate": null
        },
        "meeted_status": 0,
        "meeted_count": "10",
        "timeuploaded": 0,
        "grade_remain": -1,
        "max_grade": 30,
        "today_practice_count": 0
    };

    var str = asq
        .sort((a, b) => {
            return b.timemodified - a.timemodified
        })
        .map(t => {

            var obj = {
                id: t.question_id,
                q: t.question_text,
                a: t.question_answer
            }

            var trans = t.question_translate;
            if (typeof trans.text_translate == 'string' && trans.text_translate.length) {
                trans = JSON.parse(trans.text_translate)[0];
                obj.zh = trans.dst;
            }
            return obj;
        })
        .map((t) => {
            var str = '## ' + t.id + '\n' + t.q + '\n\n';

            str += t.a + '\n\n';

            if (needTrans && t.zh) {


                str += `
<details>
<summary>翻译</summary>

${t.zh}

</details>
            `
            }
            return str;
        })
        .join('\n');

    return str
}



async function main() {
    await mkdirp('./text/pteplus/speaking');

    var str = handleAsq(false);
    var path = './text/pteplus/speaking/asq.md';
    if (fileExists(path)) {
        fs.unlinkSync(path)
    }

    fs.writeFileSync(path, str, { flag: 'wx' });

    var str = handleAsq(true);

    var path = './text/pteplus/speaking/asq_zh.md';
    if (fileExists(path)) {
        fs.unlinkSync(path)
    }
    fs.writeFileSync(path, str, { flag: 'wx' });
}


main();