"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markerToStr = exports.filterTokens = exports.streamToArray = exports.streamToStr = void 0;
// export function randStr(nChar: number): string {
//   return Math.random().toString(36).substr(2, nChar)
// }
function streamToStr(stream, ignoreTokenType) {
    let t = '';
    // console.log(ignoreTokenType);
    // console.log(stream);
    if (typeof stream === 'string') {
        return stream;
    }
    else if (Array.isArray(stream)) {
        for (const e of stream) {
            t += streamToStr(e, ignoreTokenType);
        }
    }
    else if (ignoreTokenType === undefined || ignoreTokenType !== stream.type) {
        t += streamToStr(stream.content, ignoreTokenType);
    }
    return t;
}
exports.streamToStr = streamToStr;
function streamToArray(stream) {
    if (Array.isArray(stream))
        return stream;
    return [stream];
}
exports.streamToArray = streamToArray;
function filterTokens(stream, matcher) {
    const found = [];
    if (typeof stream === 'string') {
        return found;
    }
    else if (Array.isArray(stream)) {
        return stream.reduce((acc, cur) => acc.concat(filterTokens(cur, matcher)), []);
    }
    else {
        if (matcher(stream)) {
            found.push(stream);
        }
        return found.concat(filterTokens(stream.content, matcher));
    }
}
exports.filterTokens = filterTokens;
function markerToStr(marker, addMarker = false) {
    if (addMarker) {
        return `${marker.mark}\n${marker.value}`;
    }
    return marker.value || '';
}
exports.markerToStr = markerToStr;
