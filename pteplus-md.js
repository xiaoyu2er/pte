const { mkdirs, fileExists } = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');


// weekly_repeat 超高频
// keyking 机经
// new_question 新题
// frequency 高频

var weights = {
    weekly_repeat: 3,
    frequency: 2,
    new_question: 1,
    keyking: 1,
}

function getWeight(t) {
    var count = parseInt(t.meeted_count || '0');
    var tags = t.tags;
    var w = count;
    if (tags.indexOf('keyking') > -1) {
        w += 1;
    }

    if (tags.indexOf('weekly_repeat') > -1) {
        w += 300;

    }
    if (tags.indexOf('frequency') > -1) {
        w += 200;
    }

    if (tags.indexOf('new_question') > -1) {
        w += 100;
    }

    return w;


}

function getPrefix(tags) {
    var w = [];

    if (tags.indexOf('weekly_repeat') > -1) {
        w.push('本周高频')
    }
    if (tags.indexOf('frequency') > -1) {
        w.push('高频');
    }
    if (tags.indexOf('new_question') > -1) {
        w.push('新题')
    }
    if (tags.indexOf('keyking') > -1) {
        w.push('机经');

    }

    return '[' + w.join(' ') + ']';


}


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

function sortWfd() {
    var asq = require('./data/pteplus/listening/wfd.json');
    var demo = {
        "question_id": 14946,
        "timecreated": 1635404510,
        "timemodified": 1635404510,
        "sub_type": "Long",
        "type_id": 100008,
        "question_title": "",
        "question_text": "",
        "question_answer": "Laundry facilities are available in each school unit for free of charge. ",
        "question_content": "",
        "question_explain": "",
        "highfreq": 202110,
        "highfreq_order": 0,
        "weekly_repeat": 0,
        "course_type_id": 0,
        "question_type": "wfd",
        "course_type_name_en": null,
        "course_type_name_zh": null,
        "course_type_name_th": null,
        "video_id": null,
        "question_audio": {
            "filename": "https://pteplus.com.cn/api/v3/moodle_file/20368f9ae33250fa0f9477fb0895d4506fe773ab.mp3",
            "mimetype": "audio/mp3"
        },
        "question_image": {},
        "section": "listening",
        "tags": [
            "frequency",
            "keyking",
            "new_question"
        ],
        "highfreq_month": "10",
        "il_count": 0,
        "practised_count": 0,
        "is_like": 0,
        "writing_time": 600,
        "is_keyking": 1,
        "read_only": 0,
        "is_autoplay": false,
        "waiting_time": 7,
        "question_translate": {
            "text_translate": null,
            "content_translate": null,
            "answer_translate": "[{\"src\":\"Laundry facilities are available in each school unit for free of charge.\",\"dst\":\"每个学校单元都免费提供洗衣设施。\"}]"
        },
        "meeted_status": 0,
        "meeted_count": "59",
        "timeuploaded": 0,
        "grade_remain": -1,
        "max_grade": 30,
        "today_practice_count": 0
    }

    return asq
        .map(t => {
            var w = getWeight(t);
            var obj = {
                id: t.question_id,
                a: t.question_answer,
                tags: t.tags,
                w,
            }


            var trans = t.question_translate;
            if (typeof trans.answer_translate == 'string' && trans.answer_translate.length) {
                trans = JSON.parse(trans.answer_translate)[0];
                obj.zh = trans.dst;
            }
            return obj;
        })
        .sort((a, b) => {
            var ta = a.w;
            var tb = b.w;

            if (ta == tb) {
                return b.id - a.id
            } else {
                return tb - ta;
            }
        })
}
function sortRs() {
    var asq = require('./data/pteplus/speaking/rs.json');
    var demo = {
        "question_id": 14994,
        "timecreated": 1635404812,
        "timemodified": 1635404812,
        "sub_type": "Medium",
        "type_id": 200002,
        "question_title": "",
        "question_text": "He reads magazines / but he doesn't like to read books.",
        "question_answer": "",
        "question_content": "He reads magazines but he doesn't like to read books.",
        "question_explain": "",
        "highfreq": "202111",
        "highfreq_order": 2111083,
        "weekly_repeat": 0,
        "course_type_id": 0,
        "question_type": "rs",
        "course_type_name_en": null,
        "course_type_name_zh": null,
        "course_type_name_th": null,
        "video_id": null,
        "question_audio": {
            "filename": "https://pteplus.com.cn/api/v3/moodle_file/df6991fca79d9156472397a8cffdfaabd505c137.m4a",
            "mimetype": "audio/mp4"
        },
        "question_image": {},
        "section": "speaking",
        "tags": [
            "frequency",
            "keyking",
            "new_question"
        ],
        "highfreq_month": "11",
        "il_count": 0,
        "practised_count": 0,
        "is_like": 0,
        "waiting_time": 3,
        "record_time": 15,
        "is_keyking": 1,
        "read_only": 0,
        "is_autoplay": false,
        "question_translate": {
            "text_translate": null,
            "content_translate": "[{\"src\":\"He reads magazines but he doesn't like to read books.\",\"dst\":\"他看杂志，但不喜欢看书。\"}]",
            "answer_translate": null
        },
        "meeted_status": 0,
        "meeted_count": "7",
        "timeuploaded": 0,
        "grade_remain": -1,
        "max_grade": 30,
        "today_practice_count": 0
    };
    return asq
        .map(t => {
            var w = getWeight(t);
            var obj = {
                id: t.question_id,
                q: t.question_text,
                tags: t.tags,
                w,
            }

            var trans = t.question_translate;
            if (typeof trans.content_translate == 'string' && trans.content_translate.length) {
                trans = JSON.parse(trans.content_translate)[0];
                obj.zh = trans.dst;
            }
            return obj;
        })
        .sort((a, b) => {
            var ta = a.w;
            var tb = b.w;

            if (ta == tb) {
                return b.id - a.id
            } else {
                return tb - ta;
            }
        })
}


function handleWfd_md() {


    var str = sortWfd()

        .map((t) => {
            var str = '## ' + t.id + '\n' + t.a + '\n\n';
            if (t.zh) {
                str += t.zh + '\n\n';
            }
            return str;
        })
        .join('\n');

    return str
}

function handleWfd_txt() {

    var str = sortWfd()
        .map((t) => {

            return getPrefix(t.tags) + '-' + t.w + '-' + t.id + ' - ' + t.a.trim();
        })
        .join('\n');

    return str
}


function handleRs_md() {


    var str = sortRs()

        .map((t) => {
            var str = '## ' + t.id + '\n' + t.q + '\n\n';
            if (t.zh) {
                str += t.zh + '\n\n';
            }
            return str;
        })
        .join('\n');

    return str
}

function handleRs_txt() {

    var str = sortRs()
        .map((t) => {

            return getPrefix(t.tags) + '-' + t.w + '-' + t.id + ' - ' + t.q.trim();
        })
        .join('\n');

    return str
}


async function main_asq() {
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

async function main_wfd_md() {
    await mkdirp('./text/pteplus/listening');

    var str = handleWfd_md();
    var path = './text/pteplus/listening/wfd.md';
    if (fileExists(path)) {
        fs.unlinkSync(path)
    }

    fs.writeFileSync(path, str, { flag: 'wx' });
}

async function main_wfd_txt() {
    await mkdirp('./text/pteplus/listening');

    var str = handleWfd_txt();
    var path = './text/pteplus/listening/wfd.txt';
    if (fileExists(path)) {
        fs.unlinkSync(path)
    }

    fs.writeFileSync(path, str, { flag: 'wx' });
}


async function main_rs_md() {
    await mkdirp('./text/pteplus/speaking');

    var str = handleRs_md();
    var path = './text/pteplus/speaking/rs.md';
    if (fileExists(path)) {
        fs.unlinkSync(path)
    }

    fs.writeFileSync(path, str, { flag: 'wx' });
}

async function main_rs_txt() {
    await mkdirp('./text/pteplus/speaking');

    var str = handleRs_txt();
    var path = './text/pteplus/speaking/rs.txt';
    if (fileExists(path)) {
        fs.unlinkSync(path)
    }

    fs.writeFileSync(path, str, { flag: 'wx' });
}


// main_asq();
// main_wfd_md();
// main_wfd_txt();

main_rs_md()
main_rs_txt()