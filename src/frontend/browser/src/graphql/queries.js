"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.LOGIN = exports.SINGUP = exports.UPDATE_REPLY_LIKE = exports.CREATE_REPLY_LIKE = exports.UPDATE_COMMENT_LIKE = exports.CREATE_COMMENT_LIKE = exports.UPDATE_ANCHOR_LIKE = exports.CREATE_ANCHOR_LIKE = exports.CREATE_VOTE = exports.CREATE_REPLY = exports.CREATE_MYCARD = exports.CREATE_CARD_BODY = exports.AUTOMARK = exports.SEARCH_ALL = exports.ME = exports.IS_LOGGED_IN = exports.MY_VOTES = exports.MY_REPLY_LIKES = exports.MY_COMMENT_LIKES = exports.MY_ANCHOR_LIKES = exports.REPLIES = exports.COMMENT = exports.ANCHOR = exports.MYCARD = exports.SELFCARD = exports.OCARD = exports.COCARD = exports.LATEST_CARDS = void 0;
var client_1 = require("@apollo/client");
// ----------------------------
// Fragment
// ----------------------------
var VOTE = client_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment vote on Vote {\n    __typename\n    id\n    pollId\n    choiceIdx\n  }\n"], ["\n  fragment vote on Vote {\n    __typename\n    id\n    pollId\n    choiceIdx\n  }\n"])));
var POLL = client_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  fragment poll on Poll {\n    __typename\n    id\n    commentId\n    choices\n    count {\n      nVotes\n    }\n    createdAt\n  }\n"], ["\n  fragment poll on Poll {\n    __typename\n    id\n    commentId\n    choices\n    count {\n      nVotes\n    }\n    createdAt\n  }\n"])));
var ANCHOR_LIKE = client_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  fragment anchorLike on AnchorLike {\n    __typename\n    id\n    anchorId\n    choice\n    createdAt\n    updatedAt\n  }\n"], ["\n  fragment anchorLike on AnchorLike {\n    __typename\n    id\n    anchorId\n    choice\n    createdAt\n    updatedAt\n  }\n"])));
var ANCHOR_COUNT = client_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  fragment anchorCount on AnchorCount {\n    __typename\n    id\n    nViews\n    nUps\n    nDowns\n  }\n"], ["\n  fragment anchorCount on AnchorCount {\n    __typename\n    id\n    nViews\n    nUps\n    nDowns\n  }\n"])));
var ANCHOR_FRAGMENT = client_1.gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  fragment anchorFragment on Anchor {\n    __typename\n    id\n    userId\n    count {\n      ...anchorCount\n    }\n    cocardId\n    ocardId\n    selfcardId\n  }\n  ", "\n"], ["\n  fragment anchorFragment on Anchor {\n    __typename\n    id\n    userId\n    count {\n      ...anchorCount\n    }\n    cocardId\n    ocardId\n    selfcardId\n  }\n  ", "\n"])), ANCHOR_COUNT);
var REPLY_COUNT = client_1.gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  fragment replyCount on ReplyCount {\n    __typename\n    id\n    nViews\n    nUps\n    nDowns\n    # updatedAt\n  }\n"], ["\n  fragment replyCount on ReplyCount {\n    __typename\n    id\n    nViews\n    nUps\n    nDowns\n    # updatedAt\n  }\n"])));
var COMMENT_COUNT = client_1.gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  fragment commentCount on CommentCount {\n    __typename\n    id\n    nViews\n    nUps\n    nDowns\n    # updatedAt\n  }\n"], ["\n  fragment commentCount on CommentCount {\n    __typename\n    id\n    nViews\n    nUps\n    nDowns\n    # updatedAt\n  }\n"])));
var REPLY = client_1.gql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  fragment reply on Reply {\n    __typename\n    id\n    userId\n    isTop\n    text\n    updatedAt\n    count {\n      ...replyCount\n    }\n  }\n  ", "\n"], ["\n  fragment reply on Reply {\n    __typename\n    id\n    userId\n    isTop\n    text\n    updatedAt\n    count {\n      ...replyCount\n    }\n  }\n  ", "\n"])), REPLY_COUNT);
var COMMENT_FRAGMENT = client_1.gql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  fragment commentFragment on Comment {\n    __typename\n    id\n    userId\n    cocardId\n    ocardId\n    selfcardId\n    isTop\n    text\n    # updatedAt\n    createdAt\n    replies {\n      ...reply\n    }\n    topReplies {\n      ...reply\n    }\n    poll {\n      ...poll\n    }\n    count {\n      ...commentCount\n    }\n    meta {\n      seq\n      mark\n      src\n    }\n  }\n  ", "\n  ", "\n  ", "\n"], ["\n  fragment commentFragment on Comment {\n    __typename\n    id\n    userId\n    cocardId\n    ocardId\n    selfcardId\n    isTop\n    text\n    # updatedAt\n    createdAt\n    replies {\n      ...reply\n    }\n    topReplies {\n      ...reply\n    }\n    poll {\n      ...poll\n    }\n    count {\n      ...commentCount\n    }\n    meta {\n      seq\n      mark\n      src\n    }\n  }\n  ", "\n  ", "\n  ", "\n"])), REPLY, POLL, COMMENT_COUNT);
var COMMENT_LIKE = client_1.gql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  fragment commentLike on CommentLike {\n    __typename\n    id\n    commentId\n    choice\n    updatedAt\n  }\n"], ["\n  fragment commentLike on CommentLike {\n    __typename\n    id\n    commentId\n    choice\n    updatedAt\n  }\n"])));
var REPLY_LIKE = client_1.gql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  fragment replyLike on ReplyLike {\n    __typename\n    id\n    replyId\n    choice\n    updatedAt\n  }\n"], ["\n  fragment replyLike on ReplyLike {\n    __typename\n    id\n    replyId\n    choice\n    updatedAt\n  }\n"])));
var LINK_FRAGMENT = client_1.gql(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  fragment linkFragment on Link {\n    __typename\n    id\n    url\n    domain\n    srcType\n    srcId\n    oauthorName\n  }\n"], ["\n  fragment linkFragment on Link {\n    __typename\n    id\n    url\n    domain\n    srcType\n    srcId\n    oauthorName\n  }\n"])));
var CARD_BODY = client_1.gql(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  fragment cardBody on CardBody {\n    __typename\n    id\n    userId\n    text\n    prevId\n    # linemetas {\n    #   linenumber\n    #   userId\n    #   anchorId\n    #   stampId\n    #   src\n    #   # new\n    #   reply\n    #   poll\n    #   broken\n    #   nested\n    #   pollId\n    #   commentId\n    # }\n  }\n"], ["\n  fragment cardBody on CardBody {\n    __typename\n    id\n    userId\n    text\n    prevId\n    # linemetas {\n    #   linenumber\n    #   userId\n    #   anchorId\n    #   stampId\n    #   src\n    #   # new\n    #   reply\n    #   poll\n    #   broken\n    #   nested\n    #   pollId\n    #   commentId\n    # }\n  }\n"])));
var COCARD_FRAGMENT = client_1.gql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  fragment cocardFragment on Cocard {\n    __typename\n    id\n    template\n    meta {\n      commentId\n      symbol\n      conn\n    }\n    body {\n      ...cardBody\n    }\n    link {\n      ...linkFragment\n    }\n  }\n  ", "\n  ", "\n"], ["\n  fragment cocardFragment on Cocard {\n    __typename\n    id\n    template\n    meta {\n      commentId\n      symbol\n      conn\n    }\n    body {\n      ...cardBody\n    }\n    link {\n      ...linkFragment\n    }\n  }\n  ", "\n  ", "\n"])), CARD_BODY, LINK_FRAGMENT);
var OCARD_FRAGMENT = client_1.gql(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  fragment ocardFragment on Ocard {\n    __typename\n    id\n    template\n    body {\n      ...cardBody\n    }\n    symbol {\n      name\n      cat\n    }\n    oauthorName\n  }\n  ", "\n"], ["\n  fragment ocardFragment on Ocard {\n    __typename\n    id\n    template\n    body {\n      ...cardBody\n    }\n    symbol {\n      name\n      cat\n    }\n    oauthorName\n  }\n  ", "\n"])), CARD_BODY);
var SELFCARD_FRAGMENT = client_1.gql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  fragment selfcardFragment on Selfcard {\n    __typename\n    id\n    template\n    body {\n      ...cardBody\n    }\n    symbol {\n      name\n      cat\n    }\n  }\n  ", "\n"], ["\n  fragment selfcardFragment on Selfcard {\n    __typename\n    id\n    template\n    body {\n      ...cardBody\n    }\n    symbol {\n      name\n      cat\n    }\n  }\n  ", "\n"
    // ----------------------------
    // Query
    // ----------------------------
])), CARD_BODY);
// ----------------------------
// Query
// ----------------------------
exports.LATEST_CARDS = client_1.gql(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  query latestCards($afterId: String) {\n    latestCards(afterId: $afterId) {\n      ...cocardFragment\n    }\n  }\n  ", "\n"], ["\n  query latestCards($afterId: String) {\n    latestCards(afterId: $afterId) {\n      ...cocardFragment\n    }\n  }\n  ", "\n"])), COCARD_FRAGMENT);
exports.COCARD = client_1.gql(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  query cocard($url: String!) {\n    cocard(url: $url) {\n      ...cocardFragment\n    }\n  }\n  ", "\n"], ["\n  query cocard($url: String!) {\n    cocard(url: $url) {\n      ...cocardFragment\n    }\n  }\n  ", "\n"])), COCARD_FRAGMENT);
exports.OCARD = client_1.gql(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n  query ocard($id: ID, $oauthorName: String, $symbolName: String) {\n    ocard(id: $id, oauthorName: $oauthorName, symbolName: $symbolName) {\n      ...ocardFragment\n    }\n  }\n  ", "\n"], ["\n  query ocard($id: ID, $oauthorName: String, $symbolName: String) {\n    ocard(id: $id, oauthorName: $oauthorName, symbolName: $symbolName) {\n      ...ocardFragment\n    }\n  }\n  ", "\n"])), OCARD_FRAGMENT);
exports.SELFCARD = client_1.gql(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n  query selfcard($id: ID!) {\n    selfcard(id: $id) {\n      ...selfcardFragment\n    }\n  }\n  ", "\n"], ["\n  query selfcard($id: ID!) {\n    selfcard(id: $id) {\n      ...selfcardFragment\n    }\n  }\n  ", "\n"])), SELFCARD_FRAGMENT);
exports.MYCARD = client_1.gql(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\n  query mycard($symbolName: String!) {\n    mycard(symbolName: $symbolName) {\n      ...selfcardFragment\n    }\n  }\n  ", "\n"], ["\n  query mycard($symbolName: String!) {\n    mycard(symbolName: $symbolName) {\n      ...selfcardFragment\n    }\n  }\n  ", "\n"
    // export const COMMENTS = gql`
    //   query comments($cardId: ID!, $afterId: ID) {
    //     comments(cardId: $cardId, afterId: $afterId) {
    //       ...comment
    //     }
    //   }
    //   ${COMMENT}
    // `
    // export const COMMENTS_BY_SYMBOL = gql`
    //   query commentsBySymbol($pageTitle: String!, $symbol: String!, $afterId: ID) {
    //     commentsBySymbol(pageTitle: $pageTitle, symbol: $symbol, afterId: $afterId) {
    //       ...comment
    //     }
    //   }
    //   ${COMMENT}
    // `
])), SELFCARD_FRAGMENT);
// export const COMMENTS = gql`
//   query comments($cardId: ID!, $afterId: ID) {
//     comments(cardId: $cardId, afterId: $afterId) {
//       ...comment
//     }
//   }
//   ${COMMENT}
// `
// export const COMMENTS_BY_SYMBOL = gql`
//   query commentsBySymbol($pageTitle: String!, $symbol: String!, $afterId: ID) {
//     commentsBySymbol(pageTitle: $pageTitle, symbol: $symbol, afterId: $afterId) {
//       ...comment
//     }
//   }
//   ${COMMENT}
// `
exports.ANCHOR = client_1.gql(templateObject_22 || (templateObject_22 = __makeTemplateObject(["\n  query anchor($id: ID!) {\n    anchor(id: $id) {\n      ...anchorFragment\n    }\n  }\n  ", "\n"], ["\n  query anchor($id: ID!) {\n    anchor(id: $id) {\n      ...anchorFragment\n    }\n  }\n  ", "\n"])), ANCHOR_FRAGMENT);
exports.COMMENT = client_1.gql(templateObject_23 || (templateObject_23 = __makeTemplateObject(["\n  query comment($id: ID!) {\n    comment(id: $id) {\n      ...commentFragment\n    }\n  }\n  ", "\n"], ["\n  query comment($id: ID!) {\n    comment(id: $id) {\n      ...commentFragment\n    }\n  }\n  ", "\n"])), COMMENT_FRAGMENT);
exports.REPLIES = client_1.gql(templateObject_24 || (templateObject_24 = __makeTemplateObject(["\n  query replies($commentId: ID!, $afterId: ID) {\n    replies(commentId: $commentId, afterId: $afterId) {\n      ...reply\n    }\n  }\n  ", "\n"], ["\n  query replies($commentId: ID!, $afterId: ID) {\n    replies(commentId: $commentId, afterId: $afterId) {\n      ...reply\n    }\n  }\n  ", "\n"])), REPLY);
exports.MY_ANCHOR_LIKES = client_1.gql(templateObject_25 || (templateObject_25 = __makeTemplateObject(["\n  query myAnchorLikes {\n    myAnchorLikes {\n      ...anchorLike\n    }\n  }\n  ", "\n"], ["\n  query myAnchorLikes {\n    myAnchorLikes {\n      ...anchorLike\n    }\n  }\n  ", "\n"])), ANCHOR_LIKE);
exports.MY_COMMENT_LIKES = client_1.gql(templateObject_26 || (templateObject_26 = __makeTemplateObject(["\n  query myCommentLikes {\n    myCommentLikes {\n      ...commentLike\n    }\n  }\n  ", "\n"], ["\n  query myCommentLikes {\n    myCommentLikes {\n      ...commentLike\n    }\n  }\n  ", "\n"])), COMMENT_LIKE);
exports.MY_REPLY_LIKES = client_1.gql(templateObject_27 || (templateObject_27 = __makeTemplateObject(["\n  query myReplyLikes {\n    myReplyLikes {\n      ...replyLike\n    }\n  }\n  ", "\n"], ["\n  query myReplyLikes {\n    myReplyLikes {\n      ...replyLike\n    }\n  }\n  ", "\n"])), REPLY_LIKE);
exports.MY_VOTES = client_1.gql(templateObject_28 || (templateObject_28 = __makeTemplateObject(["\n  query myVotes {\n    myVotes {\n      ...vote\n    }\n  }\n  ", "\n"], ["\n  query myVotes {\n    myVotes {\n      ...vote\n    }\n  }\n  ", "\n"])), VOTE);
exports.IS_LOGGED_IN = client_1.gql(templateObject_29 || (templateObject_29 = __makeTemplateObject(["\n  query IsUserLoggedIn {\n    isLoggedIn @client\n  }\n"], ["\n  query IsUserLoggedIn {\n    isLoggedIn @client\n  }\n"])));
exports.ME = client_1.gql(templateObject_30 || (templateObject_30 = __makeTemplateObject(["\n  query me {\n    me {\n      id\n    }\n  }\n"], ["\n  query me {\n    me {\n      id\n    }\n  }\n"])));
exports.SEARCH_ALL = client_1.gql(templateObject_31 || (templateObject_31 = __makeTemplateObject(["\n  query searchAll($term: String!) {\n    searchAll(term: $term)\n  }\n"], ["\n  query searchAll($term: String!) {\n    searchAll(term: $term)\n  }\n"])));
exports.AUTOMARK = client_1.gql(templateObject_32 || (templateObject_32 = __makeTemplateObject(["\n  query automark($text: String!) {\n    automark(text: $text)\n  }\n"], ["\n  query automark($text: String!) {\n    automark(text: $text)\n  }\n"
    // ----------------------------
    // mutation
    // ----------------------------
])));
// ----------------------------
// mutation
// ----------------------------
exports.CREATE_CARD_BODY = client_1.gql(templateObject_33 || (templateObject_33 = __makeTemplateObject(["\n  mutation createCardBody($cardId: ID!, $data: CardBodyInput!) {\n    createCardBody(cardId: $cardId, data: $data) {\n      ...cardBody\n    }\n  }\n  ", "\n"], ["\n  mutation createCardBody($cardId: ID!, $data: CardBodyInput!) {\n    createCardBody(cardId: $cardId, data: $data) {\n      ...cardBody\n    }\n  }\n  ", "\n"])), CARD_BODY);
exports.CREATE_MYCARD = client_1.gql(templateObject_34 || (templateObject_34 = __makeTemplateObject(["\n  mutation createMycard($symbolName: String!) {\n    createMycard(symbolName: $symbolName) {\n      ...selfcardFragment\n    }\n  }\n  ", "\n"], ["\n  mutation createMycard($symbolName: String!) {\n    createMycard(symbolName: $symbolName) {\n      ...selfcardFragment\n    }\n  }\n  ", "\n"
    // export const CREATE_OCARD = gql`
    //   mutation createOcard($symbolName: String!, $oauthorName: String!, $data: [CommentInput!]!) {
    //     createOcard(symbolName: $symbolName, oauthorName: $oauthorName, data: $data)  {
    //       ...ocardFragment
    //     }
    //   }
    //   ${OCARD_FRAGMENT}
    // `
    // export const CREATE_COCARD = gql`
    //   mutation createCocard($url: String!) {
    //     createCocard(url: $url)  {
    //       ...cocardFragment
    //     }
    //   }
    //   ${COCARD_FRAGMENT}
    // `
    // export const CREATE_COMMENTS = gql`
    //   mutation createComments($cardId: String!, $cardType: String!, $symbolName: String, $data: [CommentInput!]!) {
    //     createComments(cardId: $cardId, cardType: $cardType, symbolName: $symbolName, data: $data) {
    //       ...comment
    //     }
    //   }
    //   ${COMMENT}
    // `
    // export const CREATE_COMMENT = gql`
    //   mutation createComment($cardIds: [CardIdInput!], $data: CommentInput!) {
    //     createComment(cardId: $cardId,  cardType: $cardType, data: $data) {
    //       ...comment
    //     }
    //   }
    //   ${COMMENT}
    // `
])), SELFCARD_FRAGMENT);
// export const CREATE_OCARD = gql`
//   mutation createOcard($symbolName: String!, $oauthorName: String!, $data: [CommentInput!]!) {
//     createOcard(symbolName: $symbolName, oauthorName: $oauthorName, data: $data)  {
//       ...ocardFragment
//     }
//   }
//   ${OCARD_FRAGMENT}
// `
// export const CREATE_COCARD = gql`
//   mutation createCocard($url: String!) {
//     createCocard(url: $url)  {
//       ...cocardFragment
//     }
//   }
//   ${COCARD_FRAGMENT}
// `
// export const CREATE_COMMENTS = gql`
//   mutation createComments($cardId: String!, $cardType: String!, $symbolName: String, $data: [CommentInput!]!) {
//     createComments(cardId: $cardId, cardType: $cardType, symbolName: $symbolName, data: $data) {
//       ...comment
//     }
//   }
//   ${COMMENT}
// `
// export const CREATE_COMMENT = gql`
//   mutation createComment($cardIds: [CardIdInput!], $data: CommentInput!) {
//     createComment(cardId: $cardId,  cardType: $cardType, data: $data) {
//       ...comment
//     }
//   }
//   ${COMMENT}
// `
exports.CREATE_REPLY = client_1.gql(templateObject_35 || (templateObject_35 = __makeTemplateObject(["\n  mutation createReply($commentId: ID!, $data: ReplyInput!) {\n    createReply(commentId: $commentId, data: $data) {\n      ...reply\n    }\n  }\n  ", "\n"], ["\n  mutation createReply($commentId: ID!, $data: ReplyInput!) {\n    createReply(commentId: $commentId, data: $data) {\n      ...reply\n    }\n  }\n  ", "\n"])), REPLY);
exports.CREATE_VOTE = client_1.gql(templateObject_36 || (templateObject_36 = __makeTemplateObject(["\n  mutation createVote($pollId: ID!, $choiceIdx: Int!) {\n    createVote(pollId: $pollId, choiceIdx: $choiceIdx) {\n      ...vote\n    }\n  }\n  ", "\n"], ["\n  mutation createVote($pollId: ID!, $choiceIdx: Int!) {\n    createVote(pollId: $pollId, choiceIdx: $choiceIdx) {\n      ...vote\n    }\n  }\n  ", "\n"])), VOTE);
exports.CREATE_ANCHOR_LIKE = client_1.gql(templateObject_37 || (templateObject_37 = __makeTemplateObject(["\n  mutation createAnchorLike($anchorId: ID!, $data: LikeInput!) {\n    createAnchorLike(anchorId: $anchorId, data: $data) {\n      like {\n        ...anchorLike\n      }\n      count {\n        ...anchorCount\n      }\n    }\n  }\n  ", "\n  ", "\n"], ["\n  mutation createAnchorLike($anchorId: ID!, $data: LikeInput!) {\n    createAnchorLike(anchorId: $anchorId, data: $data) {\n      like {\n        ...anchorLike\n      }\n      count {\n        ...anchorCount\n      }\n    }\n  }\n  ", "\n  ", "\n"])), ANCHOR_LIKE, ANCHOR_COUNT);
exports.UPDATE_ANCHOR_LIKE = client_1.gql(templateObject_38 || (templateObject_38 = __makeTemplateObject(["\n  mutation updateAnchorLike($id: ID!, $data: LikeInput!) {\n    updateAnchorLike(id: $id, data: $data) {\n      like {\n        ...anchorLike\n      }\n      count {\n        ...anchorCount\n      }\n    }\n  }\n  ", "\n  ", "\n"], ["\n  mutation updateAnchorLike($id: ID!, $data: LikeInput!) {\n    updateAnchorLike(id: $id, data: $data) {\n      like {\n        ...anchorLike\n      }\n      count {\n        ...anchorCount\n      }\n    }\n  }\n  ", "\n  ", "\n"])), ANCHOR_LIKE, ANCHOR_COUNT);
exports.CREATE_COMMENT_LIKE = client_1.gql(templateObject_39 || (templateObject_39 = __makeTemplateObject(["\n  mutation createCommentLike($commentId: ID!, $data: LikeInput!) {\n    createCommentLike(commentId: $commentId, data: $data) {\n      like {\n        ...commentLike\n      }\n      count {\n        ...commentCount\n      }\n    }\n  }\n  ", "\n  ", "\n"], ["\n  mutation createCommentLike($commentId: ID!, $data: LikeInput!) {\n    createCommentLike(commentId: $commentId, data: $data) {\n      like {\n        ...commentLike\n      }\n      count {\n        ...commentCount\n      }\n    }\n  }\n  ", "\n  ", "\n"])), COMMENT_LIKE, COMMENT_COUNT);
exports.UPDATE_COMMENT_LIKE = client_1.gql(templateObject_40 || (templateObject_40 = __makeTemplateObject(["\n  mutation updateCommentLike($id: ID!, $data: LikeInput!) {\n    updateCommentLike(id: $id, data: $data) {\n      like {\n        ...commentLike\n      }\n      count {\n        ...commentCount\n      }\n    }\n  }\n  ", "\n  ", "\n"], ["\n  mutation updateCommentLike($id: ID!, $data: LikeInput!) {\n    updateCommentLike(id: $id, data: $data) {\n      like {\n        ...commentLike\n      }\n      count {\n        ...commentCount\n      }\n    }\n  }\n  ", "\n  ", "\n"])), COMMENT_LIKE, COMMENT_COUNT);
exports.CREATE_REPLY_LIKE = client_1.gql(templateObject_41 || (templateObject_41 = __makeTemplateObject(["\n  mutation createReplyLike($replyId: ID!, $data: LikeInput!) {\n    createReplyLike(replyId: $replyId, data: $data) {\n      like {\n        ...replyLike\n      }\n      count {\n        ...replyCount\n      }\n    }\n  }\n  ", "\n  ", "\n"], ["\n  mutation createReplyLike($replyId: ID!, $data: LikeInput!) {\n    createReplyLike(replyId: $replyId, data: $data) {\n      like {\n        ...replyLike\n      }\n      count {\n        ...replyCount\n      }\n    }\n  }\n  ", "\n  ", "\n"])), REPLY_LIKE, REPLY_COUNT);
exports.UPDATE_REPLY_LIKE = client_1.gql(templateObject_42 || (templateObject_42 = __makeTemplateObject(["\n  mutation updateReplyLike($id: ID!, $data: LikeInput!) {\n    updateReplyLike(id: $id, data: $data) {\n      like {\n        ...replyLike\n      }\n      count {\n        ...replyCount\n      }\n    }\n  }\n  ", "\n  ", "\n"], ["\n  mutation updateReplyLike($id: ID!, $data: LikeInput!) {\n    updateReplyLike(id: $id, data: $data) {\n      like {\n        ...replyLike\n      }\n      count {\n        ...replyCount\n      }\n    }\n  }\n  ", "\n  ", "\n"
    // export const UPDATE_POLL_VOTE = gql`
    //   mutation updatePostVote($postId: ID!, $data: PostVoteInput!) {
    //     updatePostVote(postId: $postId, data: $data) {
    //       ...postVote
    //     }
    //   }
    //   ${POST_VOTE}
    // `
    // export const UPDATE_COMMENT = gql`
    //   mutation updateComment($id: ID!, $data: CommentInput!) {
    //     updateComment(id: $id, data: $data) {
    //       ...comment
    //     }
    //   }
    //   ${COMMENT}
    // `
])), REPLY_LIKE, REPLY_COUNT);
// export const UPDATE_POLL_VOTE = gql`
//   mutation updatePostVote($postId: ID!, $data: PostVoteInput!) {
//     updatePostVote(postId: $postId, data: $data) {
//       ...postVote
//     }
//   }
//   ${POST_VOTE}
// `
// export const UPDATE_COMMENT = gql`
//   mutation updateComment($id: ID!, $data: CommentInput!) {
//     updateComment(id: $id, data: $data) {
//       ...comment
//     }
//   }
//   ${COMMENT}
// `
exports.SINGUP = client_1.gql(templateObject_43 || (templateObject_43 = __makeTemplateObject(["\n  mutation signup($email: String!, $password: String!) {\n    signup(email: $email, password: $password) {\n      token\n      user {\n        id\n      }\n    }\n  }\n"], ["\n  mutation signup($email: String!, $password: String!) {\n    signup(email: $email, password: $password) {\n      token\n      user {\n        id\n      }\n    }\n  }\n"])));
exports.LOGIN = client_1.gql(templateObject_44 || (templateObject_44 = __makeTemplateObject(["\n  mutation login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n      }\n    }\n  }\n"], ["\n  mutation login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      token\n      user {\n        id\n      }\n    }\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44;
