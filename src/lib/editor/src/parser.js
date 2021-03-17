"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitByUrl = exports.findUrl = exports.tokenizeSection = exports.tokenizeSymbol = void 0;
const prismjs_1 = __importDefault(require("prismjs"));
const helper_1 = require("./helper");
const GRAMMAR = {
    'multiline-marker': {
        // pattern: /^\[[^\s\]]*\]$(?:\n^(?!\[).+)+/m,
        pattern: /^\[[^\s[\]]*\]$(?:\n^(?!\[[^\s[\]]*\]).+)+/m,
        inside: {
            'line-mark': {
                pattern: /^\[[^\s[\]]*\]$/m,
            },
            'line-value': {
                pattern: /^.+$/m,
                inside: {
                    ticker: { pattern: /\$[A-Z-]+/ },
                    topic: { pattern: /\[\[[^\]]+\]\]/u },
                    stamp: { pattern: /\s%[a-zA-Z0-9]{3}$/ },
                },
            },
            // 'list-string': {
            //     pattern: /^[-]+\s.+$/m,
            // },
        },
    },
    'inline-marker': {
        pattern: /^\[[^\s[\]]+\].*$/m,
        inside: {
            'inline-mark': {
                pattern: /^\[[^\s[\]]+\]/,
            },
            'inline-value': {
                pattern: /^.+$/,
                inside: {
                    ticker: { pattern: /\$[A-Z-]+/ },
                    topic: { pattern: /\[\[[^\]]+\]\]/u },
                    // TODO: 沒辦法將space與stamp分開（會成為一個string，需要trim）
                    stamp: { pattern: /\s%[a-zA-Z0-9]{3}$/ },
                },
            },
        },
    },
    ticker: { pattern: /\$[A-Z-]+/ },
    topic: { pattern: /\[\[[^\]]+\]\]/u },
    // 'radio': {
    //   pattern: /[\s\t]+\[\w?\]\p{L}+/u,
    //   // greedy: true
    // },
};
const SYMBOL_GRAMMAR = {
    ticker: GRAMMAR.ticker,
    topic: GRAMMAR.topic,
};
const SECTION_GRAMMAR = {
    'sect-ticker': {
        alias: 'sect-ticker',
        pattern: /^\n\$[A-Z-]+(@\w+)?$/m,
        inside: {
            'sect-symbol': { pattern: /^\n\$[A-Z-]+/ },
            'sect-user': { pattern: /@\w+/ },
        },
    },
    'sect-ticker-begin-line': {
        alias: 'sect-ticker',
        pattern: /^\$[A-Z-]+(@\w+)?\n/,
        inside: {
            'sect-symbol': { pattern: /^\$[A-Z-]+/ },
            'sect-user': { pattern: /@\w+/ },
        },
    },
    'sect-topic': {
        alias: 'sect-topic',
        pattern: /^\n\[\[[^\]]+\]\](@\w+)?$/m,
        inside: {
            'sect-symbol': { pattern: /^\n\[\[[^\]]+\]\]/u },
            'sect-user': { pattern: /@\w+/ },
        },
    },
    'sect-topic-begin-line': {
        alias: 'sect-topic',
        pattern: /^\[\[[^\]]+\]\](@\w+)?\n/,
        inside: {
            'sect-symbol': { pattern: /^\[\[[^\]]+\]\]/u },
            'sect-user': { pattern: /@\w+/ },
        },
    },
    'sect-breaker': {
        alias: 'sect-breaker',
        pattern: /^\n\/{3,}.+$/m,
    },
    'sect-url': {
        alias: 'sect-url',
        pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/m,
    },
};
function tokenizeSymbol(text) {
    /** 將text中的symbol($AA, [[Topic]])轉成token */
    return prismjs_1.default.tokenize(text, SYMBOL_GRAMMAR);
}
exports.tokenizeSymbol = tokenizeSymbol;
function validate(items, allowedMarkers) {
    for (const e of items) {
        const format = allowedMarkers.find(f => f.mark === e.mark);
        if (format === undefined) {
            e.error = '不在允許的markers中';
            continue;
        }
        if (e.value === undefined) {
            e.error = '沒有value';
            continue;
        }
        if (format.validater && !format.validater(e.value)) {
            e.error = 'value不符合格式';
            continue;
        }
        if (format.inline) {
            const filtered = items.filter(e => e.mark === format.mark);
            for (let i = 0; i < filtered.length - 1; i++) {
                filtered[i].error = '只能define一次，最後一個會被保留';
            }
        }
        // if (e.mark === MARKER_FORMAT.card.mark && getCardId) {
        //     getCardId(e.value)
        //         .then(result => {
        //             if (result === null) {
        //                 e.error = '找不到對應的card'
        //             } else {
        //                 e.cardId = result
        //             }
        //         })
        // }
        // if (e.children) {
        //     if (format.nested) {
        //         // TODO: 當前只有ticker可以nested，應該要靈活一些
        //         e.children = validate(e.children, TICKER_FORMATTER)
        //     } else {
        //         e.error = '不允許nested'
        //     }
        // }
    }
    return items;
}
function tokenizeSection(text, 
// symbolCardDict: Record<string, CardIdentifier>,
// nestedCards: CardIdentifier[] = [],
rootFormat, oauthorName, allowedSects = ['ticker', 'topic']) {
    // 分出text中的每個section
    // let _sect: {bodyTokens: []} = { bodyTokens: [] }
    var _a, _b;
    function _parseSectToken(token) {
        let symbol;
        let user;
        if (Array.isArray(token.content)) {
            for (const e of token.content) {
                if (typeof e === 'string') {
                    // do nothing
                }
                else if (e.type === 'sect-symbol') {
                    symbol = helper_1.streamToStr(e.content).trim();
                }
                else if (e.type === 'sect-user') {
                    user = helper_1.streamToStr(e.content);
                }
            }
            if (symbol === undefined) {
                console.error(token);
                throw new Error();
            }
            return { symbol, user };
        }
        console.error(token);
        throw new Error();
    }
    const sects = [];
    let _sect = {
        bodyTokens: [],
    };
    // let _sectToken: Prism.Token
    // let _bodyTokens: (Prism.Token | string)[] = []
    for (const e of prismjs_1.default.tokenize(text, SECTION_GRAMMAR)) {
        if (typeof e === 'string') {
            _sect.bodyTokens.push(e);
        }
        else if (e.alias === 'sect-ticker') {
            // 先儲存之前的section
            sects.push(Object.assign({}, _sect));
            // TODO: @ME
            const parsed = _parseSectToken(e);
            _sect = {
                ticker: true,
                nestedCard: { symbol: parsed.symbol, oauthor: (_a = parsed.user) !== null && _a !== void 0 ? _a : oauthorName },
                sectToken: e,
                bodyTokens: [],
            };
        }
        else if (e.alias === 'sect-topic') {
            sects.push(Object.assign({}, _sect));
            const parsed = _parseSectToken(e);
            _sect = {
                topic: true,
                nestedCard: { symbol: parsed.symbol, oauthor: (_b = parsed.user) !== null && _b !== void 0 ? _b : oauthorName },
                sectToken: e,
                bodyTokens: [],
            };
        }
        else if (e.alias === 'sect-breaker') {
            sects.push(Object.assign({}, _sect));
            // 把breaker視為獨立的section
            sects.push({ breaker: true, sectToken: e, bodyTokens: [] });
            // breaker之後的新section
            _sect = { bodyTokens: [] };
        }
        else {
            console.error(e);
            throw new Error('應該要處理但未處理的token-type');
        }
    }
    sects.push(Object.assign({}, _sect));
    for (const e of sects) {
        const body = helper_1.streamToStr(e.bodyTokens);
        if (e.ticker || e.topic) {
            // 對section做tokenize section-body
            e.bodyTokens = prismjs_1.default.tokenize(body, GRAMMAR);
        }
        else if (!e.breaker && body.length > 0) {
            // 所有非ticker、topic的card & 有body-string的section皆視為root
            e.root = true;
            e.bodyTokens = prismjs_1.default.tokenize(body, GRAMMAR);
        }
    }
    // 對每個token紀錄linenumber、marker
    let linenumber = 0;
    let mark = null;
    function _recursiveExtend(stream) {
        if (typeof stream === 'string') {
            linenumber += stream.split('\n').length - 1;
            return stream;
        }
        else if (Array.isArray(stream)) {
            return stream.map(e => _recursiveExtend(e));
        }
        else if (stream.type === 'inline-mark' || stream.type === 'line-mark') {
            mark = helper_1.streamToStr(stream.content);
            if (mark === '') {
                throw new Error();
            }
            return Object.assign(Object.assign({}, stream), { linenumber, marker: { mark }, content: _recursiveExtend(stream.content) });
        }
        else if (stream.type === 'inline-value' || stream.type === 'line-value') {
            const value = helper_1.streamToStr(stream.content, 'stamp').trim();
            if (mark === null) {
                throw new Error();
            }
            return Object.assign(Object.assign({}, stream), { linenumber, marker: { mark, value }, content: _recursiveExtend(stream.content) });
        }
        else {
            return Object.assign(Object.assign({}, stream), { linenumber, content: _recursiveExtend(stream.content) });
        }
    }
    for (const e of sects) {
        // section的全部stream（含section-token, body-tokens)
        let stream = [];
        if (e.sectToken)
            stream.push(e.sectToken);
        stream = stream.concat(e.bodyTokens);
        // 轉成ext-token
        mark = null;
        e.stream = _recursiveExtend(stream);
    }
    return sects.map(e => {
        return {
            root: e.root,
            breaker: e.breaker,
            ticker: e.ticker,
            topic: e.topic,
            nestedCard: e.nestedCard,
            stream: e.stream,
        };
    });
}
exports.tokenizeSection = tokenizeSection;
function findUrl(text) {
    /** 從首先出現的單行URL開始，擷取從URL以下的文章 */
    const tokens = prismjs_1.default.tokenize(text, SECTION_GRAMMAR);
    let url;
    const _tokensAfterUrl = [];
    for (const e of tokens) {
        if (url === undefined) {
            if (typeof e !== 'string' && e.type === 'sect-url')
                url = e.content;
            else
                continue;
        }
        _tokensAfterUrl.push(e);
    }
    // return { url, textAfterUrl: tokensToText(_tokensAfterUrl) }
    return { url, textAfterUrl: 'tokensToText(_tokensAfterUrl)' };
}
exports.findUrl = findUrl;
function splitByUrl(text) {
    /** 以text中的單行URL做split，返回:[url, part-text][] */
    const tokens = prismjs_1.default.tokenize(text, SECTION_GRAMMAR);
    let buffer = [];
    let url;
    const splits = [];
    for (const e of tokens) {
        if (typeof e !== 'string' && e.type === 'sect-url') {
            // 儲存前一個buffer後清空
            splits.push([url, helper_1.streamToStr(buffer)]);
            buffer = [];
            // 當前url
            url = e.content;
        }
        else {
            buffer.push(e);
        }
    }
    // 儲存最後一個
    splits.push([url, helper_1.streamToStr(buffer)]);
    return splits;
}
exports.splitByUrl = splitByUrl;
