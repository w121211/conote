"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEditor = exports.WEBPAGE_BODY_FORMATTER = exports.TICKER_FORMATTER = exports.WEBPAGE_HEAD_FORMATTER = exports.MARKER_FORMAT = void 0;
/**
 * 原則：直接儲存text（含stamp）+linemetas
 * 概念：
 * 1. note的核心為text（純文字），編輯是純文字編輯
 * 2. text中分為marker-line, plain-text
 *    - marker-line會紀錄marker, value及其他meta（例如編輯者、來源等），並會建立對應的`anchor`
 * 3. 在儲存時，
 *    - 對沒有stamp的marker-line產生stamp -> server端會依照stamp取得line-meta，建立anchor
 *    - 對已經有stamp的marker-line不額外處理
 *
 * 步驟：
 * 1. 輸入text(string)
 * 2. 轉成section: 對texttokenize -> secteions，section可分為root, ticker, topic, plain-string
 * 3. 轉成markers: 對每個section tokenize -> markers
 * 4. 在編輯過程中不管stamp，user若將stamp刪除則會變成orphan-stamp
 * 5. 儲存時，依序 1. 對新的marker-line建立anchor 2. 存root-card 3. 插入marker-line至對應的nested-card
 *
 * Get: stamp-text + linemetas
 * Show: tokenized sections -> for each section for each token, render token (其中value-token的顯示需要搭配stamp)
 * Edit: tokenized sections -> for each section, for each token, render token (實時)
 * Upsert: tokenized sections -> update stamp & linemetas -> (server)依linemetas建立stamps & 更新linemetas -> (server)儲存text
 *
 * Nested-card: (server) for each linemetas, if linemeta has nested card, 同步於nested card更新text (through marker), linemetas
 *
 * 需要考慮但目前暫時忽略的問題
 * - 當stamp損壞、遺失時，沒有補救機制（例如惡意把stamp消掉，程式會視為新的marker而建立一個新stamp）
 *
 * Stamp:
 * [+]
 * something %sajs
 * another %swjd
 * [poll] [X]Buy []Sell %qwi2
 *
 *
// (Server) 更新 webpage-card -> 同步更新ocard, cocard
// for (const e of linemetas.filter(e => e.new)) {
//     const stamp = insertAnchor()
//     e.userId = userId
//     e.stampId = stamp.id
// }
// const savedText = JSON.stringify(linemetas) + '\n' + text
// const lines = cocard.text.split('\n')
// lines.insert(lastMarkerIdx, )
// (Server) 更新 my-card
 */
const lodash_1 = require("lodash");
const chance_1 = require("chance");
const helper_1 = require("./helper");
const parser_1 = require("./parser");
// TODO: 測試時需要給seed，應該用mock取代
const chance = new chance_1.Chance(123456);
// const chance = new Chance()
exports.MARKER_FORMAT = {
    // srcId: { mark: '[_srcId]', inline: true, meta: true, freeze: true, },
    // srcType: { mark: '[_srcType]', inline: true, meta: true, freeze: true, },
    // '_oauthor': {},
    // '_url': {},
    srcTitle: { mark: '[_srcTitle]', meta: true, inline: true, freeze: true },
    srcPublishDate: { mark: '[_srcPublishDate]', meta: true, inline: true, freeze: true },
    link: { mark: '[_link]', meta: true, multiline: true },
    keyword: { mark: '[_keyword]', meta: true, inline: true, list: true },
    plus: { mark: '[+]', multiline: true },
    minus: { mark: '[-]', multiline: true },
    note: { mark: '[note]', multiline: true },
    // ticker: { mark: '[car]', nested: true },
    // card: { mark: '[card]', nested: true },
    price: {
        mark: '[price]',
        inline: true,
        poll: true,
        pollVotes: [],
        validater: a => !isNaN(parseFloat(a)),
    },
    act: { mark: '[act]', inline: true, poll: true, pollVotes: ['Buy', 'Sell'] },
};
exports.WEBPAGE_HEAD_FORMATTER = [
    exports.MARKER_FORMAT.srcTitle,
    exports.MARKER_FORMAT.srcPublishDate,
    exports.MARKER_FORMAT.keyword,
    exports.MARKER_FORMAT.link,
];
exports.TICKER_FORMATTER = [exports.MARKER_FORMAT.plus, exports.MARKER_FORMAT.minus, exports.MARKER_FORMAT.price];
exports.WEBPAGE_BODY_FORMATTER = [exports.MARKER_FORMAT.note];
function insertMarkerlinesToBody(cur, body, insert) {
    /** 將markerline插入至body-text中，插入的line會同時加入stamp 注意：插入後line-number會變動，這裡不更新line-number */
    // 將body分成一行一行，每行搭配對應的marker-line
    const lns = body.split('\n').map((e, i) => {
        const found = cur.find(e => e.linenumber === i);
        return [e, found];
    });
    function _insert(item) {
        const a = {
            // line-number不重要
            linenumber: -1,
            str: item.str,
            marker: item.marker,
            new: true,
            src: item.src,
            srcStamp: item.stampId,
            oauthor: item.oauthor,
            stampId: `%${chance.string({
                length: 3,
                pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            })}`,
        };
        if (a.marker) {
            const idx = lodash_1.findLastIndex(lns, e => { var _a, _b, _c; return ((_b = (_a = e[1]) === null || _a === void 0 ? void 0 : _a.marker) === null || _b === void 0 ? void 0 : _b.mark) === ((_c = item.marker) === null || _c === void 0 ? void 0 : _c.mark); });
            const str = `${helper_1.markerToStr(a.marker, false)} ${a.stampId}`;
            if (idx >= 0) {
                // 若有，插入至下一行 TODO: 應考慮inline
                lns.splice(idx + 1, 0, [str, a]);
            }
            else {
                // 若沒有，建立一個新marker
                lns.push([a.marker.mark, undefined]);
                lns.push([str, a]);
            }
        }
    }
    for (const e of insert) {
        if (e.poll) {
            throw new Error('尚未實現');
        }
        if (e.marker && e.marker.mark && e.marker.value) {
            _insert(e);
        }
    }
    // 將分行的body重新組合起來
    let joinedBody = '';
    const markerlines = [];
    for (const [str, mkln] of lns) {
        joinedBody += `${str}\n`;
        if (mkln)
            markerlines.push(mkln);
    }
    return [joinedBody, markerlines];
}
function updateMarkerlines(cur, sects, src, oauthor) {
    var _a, _b, _c;
    /** 和初始比較，1. 基於stamp更新markerline的line-number、value等等、2. 對新的line增加markerline，返回更新後的markerLines，這裡面不會動到body-text */
    // 建立stamp-dict
    const dict = {};
    for (const e of cur) {
        dict[e.stampId] = e;
    }
    // 建立、更新markerLines，同步檢查、建立stamp
    const lns = [];
    for (const sect of sects) {
        // 1. 針對mark，不需要stamp，只需紀錄mark的linenumber（方便未來插入新行）
        for (const markToken of helper_1.filterTokens((_a = sect.stream) !== null && _a !== void 0 ? _a : [], e => e.type === 'line-mark' || e.type === 'inline-mark')) {
            lns.push({
                linenumber: markToken.linenumber,
                str: helper_1.streamToStr(markToken),
                marker: markToken.marker,
                nestedCard: sect.nestedCard,
            });
        }
        // 2. 針對inline-value, line-value
        for (const lineToken of helper_1.filterTokens((_b = sect.stream) !== null && _b !== void 0 ? _b : [], e => e.type === 'inline-value' || e.type === 'line-value')) {
            if (lineToken.marker === undefined) {
                throw new Error('value-token一定要有marker & linenumber');
            }
            const _updated = {
                linenumber: lineToken.linenumber,
                str: helper_1.streamToStr(lineToken),
                marker: lineToken.marker,
                nestedCard: sect.nestedCard,
            };
            const stampTokens = helper_1.filterTokens((_c = lineToken.content) !== null && _c !== void 0 ? _c : [], e => e.type === 'stamp');
            if (stampTokens.length === 0) {
                // 沒有stamp
                // TODO: 要確保stampId不重複
                lns.push(Object.assign(Object.assign({}, _updated), { new: true, noStamp: true, src,
                    oauthor, stampId: `%${chance.string({
                        length: 3,
                        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                    })}` }));
                continue;
            }
            else {
                // 有stamp
                // 註：Prism-Parser程式上不會在同一行內找到2個stamp-token
                const _stamp = stampTokens[0].content.trim();
                if (_stamp in dict) {
                    // TODO: 和原始markerLine比較是否有更動
                    lns.push(Object.assign(Object.assign({}, dict[_stamp]), _updated));
                }
                else {
                    // 有anchor但broken
                    lns.push(Object.assign(Object.assign({}, _updated), { stampId: _stamp, broken: true }));
                }
            }
        }
    }
    // 依linenumber排序markerlines（不能忽略，因為有些function會需要找最後一行）
    lns.sort((a, b) => a.linenumber - b.linenumber);
    return lns;
}
class TextEditor {
    constructor(fromText, src, oauthor) {
        this._markerlines = [];
        // 預定要插入至bod的markerlines，在flush()時插入並清空（用在nested-card）
        this._markerlinesToInsert = [];
        if (fromText === undefined) {
            fromText = TextEditor._toStoredText('', []);
        }
        const [markerLines, body] = TextEditor._splitStoredText(fromText);
        const sects = parser_1.tokenizeSection(body);
        this._storedText = fromText;
        this._markerlines = markerLines;
        this._body = body;
        this._sects = sects;
        this._src = src;
        this._oauthor = oauthor;
    }
    static _toStoredText(body, markerLines) {
        return [JSON.stringify(markerLines), body].join('\n');
    }
    static _splitStoredText(storedText) {
        const lns = storedText.split('\n');
        const markerLines = JSON.parse(lns[0]);
        const body = lns.splice(1).join('\n');
        return [markerLines, body];
    }
    getSections() {
        // for (const sect of this._sects) {
        //   for (const e of filterTokens(sect.stream ?? [], f => f.type === 'stamp' || f.type === 'line-value')) {
        //     // e.markerline = dict[(e.content as string).trim()]
        //     console.log(e)
        //   }
        // }
        return this._sects;
    }
    getBody() {
        return this._body;
    }
    setBody(body) {
        this._body = body;
    }
    getMarkerLines() {
        return this._markerlines;
    }
    getNestedMarkerLines() {
        const nested = [];
        for (const e of this._markerlines) {
            if (e.nestedCard && e.nestedCard.symbol) {
                const res = nested.find(f => { var _a; return f[0].symbol === ((_a = e.nestedCard) === null || _a === void 0 ? void 0 : _a.symbol); });
                if (res === undefined) {
                    nested.push([e.nestedCard, [e]]);
                }
                else {
                    res[1].push(e);
                }
            }
        }
        return nested;
    }
    setMarkerlinesToInsert(items) {
        this._markerlinesToInsert = lodash_1.cloneDeep(items);
    }
    toStoredText() {
        return TextEditor._toStoredText(this._body, this._markerlines);
    }
    flush(opt = { embedMarkerlinesToTokens: false }) {
        var _a;
        /** 跑tokenizer、更新markerlines, stamp，因為expensive，所以將此步驟獨立出來 */
        if (this._markerlinesToInsert.length > 0) {
            const [body, markerlines] = insertMarkerlinesToBody(this._markerlines, this._body, this._markerlinesToInsert);
            this._body = body;
            this._markerlines = markerlines;
            this._markerlinesToInsert = [];
        }
        this._sects = parser_1.tokenizeSection(this._body);
        this._markerlines = updateMarkerlines(this._markerlines, this._sects, this._src, this._oauthor);
        // 依照line-number對還沒有stamp的line插入stamp
        const lns = this._body.split('\n');
        for (const e of this._markerlines) {
            if (e.new && e.noStamp) {
                lns[e.linenumber] = `${lns[e.linenumber]} ${e.stampId}`;
                delete e.noStamp;
            }
        }
        this._body = lns.join('\n');
        if (opt.embedMarkerlinesToTokens) {
            // embed marklines with tokens
            const dict = {};
            for (const e of this._markerlines) {
                dict[e.linenumber] = e;
            }
            for (const sect of this._sects) {
                for (const e of helper_1.filterTokens((_a = sect.stream) !== null && _a !== void 0 ? _a : [], f => ['stamp', 'line-value', 'inline-value'].includes(f.type))) {
                    e.markerline = dict[e.linenumber];
                }
            }
        }
    }
    addAnchors(anchors) {
        const dict = {};
        for (const e of this._markerlines) {
            dict[e.stampId] = e;
        }
        for (const anchor of anchors) {
            if (anchor.stamp === null)
                throw new Error();
            const markerline = dict[anchor.stamp];
            markerline.anchorId = anchor.id;
            markerline.userId = anchor.userId;
            delete markerline.new;
        }
    }
    addConnectedContents(record) {
        /** 將connected-contents併入marker-lines，marker-line需要先有stamp-id，併入後會把該marker-line的new拿掉（表示不需要建立anchor） */
        for (const k in record) {
            const mkln = this._markerlines.find(e => { var _a; return e.stampId && ((_a = e.marker) === null || _a === void 0 ? void 0 : _a.mark) === k; });
            if (mkln === undefined) {
                console.error(this._body);
                throw new Error(`Card-body裡找不到${k}`);
            }
            const cont = record[k];
            if (cont.comment && cont.poll) {
                throw new Error('不能同時是comment & poll');
            }
            if (cont.comment) {
                if (cont.commentId === undefined) {
                    throw new Error('缺commentId');
                }
                else {
                    mkln.comment = true;
                    mkln.commentId = cont.commentId;
                }
            }
            if (cont.poll) {
                if (cont.pollId === undefined || cont.commentId === undefined) {
                    throw new Error('缺commentId or pollId');
                }
                else {
                    mkln.poll = true;
                    mkln.pollId = cont.pollId;
                    mkln.commentId = cont.commentId;
                }
            }
            delete mkln.new;
        }
    }
}
exports.TextEditor = TextEditor;
// --- Unused functions, wait to remove ---
function markersToText(markers, formatter) {
    var _a;
    /**
     * TODO:
     * - netsed card
     * - 排序、filter
     * - 再編輯的情況：poll需要涵蓋上次投票&本次全新的
     */
    const lines = [];
    for (const e of formatter) {
        if (e.inline) {
            // TODO: 缺少驗證（例如inline mark可有複數個marker）
            const mk = markers.find(f => f.mark === e.mark);
            lines.push(`${e.mark} ${(_a = mk === null || mk === void 0 ? void 0 : mk.value) !== null && _a !== void 0 ? _a : ''}`);
        }
        else if (e.multiline) {
            lines.push(`${e.mark}`);
            for (const mk of markers.filter(f => f.mark === e.mark))
                lines.push(`${mk.value}`);
            lines.push('');
        }
    }
    return lines.join('\n');
}
function initText(formatter) {
    let lines = [];
    // let linenumber = 0;
    for (const e of formatter) {
        let stamp;
        // 先處理data-creation & 建立linemeta, stamp
        // if (e.poll) {
        //   await prisma.poll.create({
        //     data: {
        //       cat: PA.PollCat.FIXED,
        //       // status?: PollStatus
        //       // choices?: XOR<PollCreatechoicesInput, Enumerable<string>>
        //       // user: UserCreateOneWithoutPollsInput
        //       // comment: CommentCreateOneWithoutPollInput
        //       // votes?: VoteCreateManyWithoutPollInput
        //       // count?: PollCountCreateOneWithoutPollInput
        //     }
        //   })
        // }
        // 處理實際的text
        if (e.inline) {
            lines = lines.concat(`${e.mark}\n`.split('\n'));
        }
        if (e.multiline) {
            lines = lines.concat(`${e.mark}\n\n\n\n`.split('\n'));
        }
    }
    return lines.join('\n');
}
