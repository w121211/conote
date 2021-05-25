/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestCards
// ====================================================

export interface latestCards_latestCards_meta {
  __typename: "CardMeta";
  commentId: number;
  symbol: string | null;
  conn: string | null;
}

export interface latestCards_latestCards_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface latestCards_latestCards_link {
  __typename: "Link";
  id: string;
  url: string;
  domain: string;
  srcType: string;
  srcId: string | null;
  oauthorName: string | null;
}

export interface latestCards_latestCards {
  __typename: "Cocard";
  id: string;
  template: CardTemplate;
  meta: latestCards_latestCards_meta;
  body: latestCards_latestCards_body | null;
  link: latestCards_latestCards_link;
}

export interface latestCards {
  latestCards: latestCards_latestCards[];
}

export interface latestCardsVariables {
  afterId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: cocard
// ====================================================

export interface cocard_cocard_meta {
  __typename: "CardMeta";
  commentId: number;
  symbol: string | null;
  conn: string | null;
}

export interface cocard_cocard_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface cocard_cocard_link {
  __typename: "Link";
  id: string;
  url: string;
  domain: string;
  srcType: string;
  srcId: string | null;
  oauthorName: string | null;
}

export interface cocard_cocard {
  __typename: "Cocard";
  id: string;
  template: CardTemplate;
  meta: cocard_cocard_meta;
  body: cocard_cocard_body | null;
  link: cocard_cocard_link;
}

export interface cocard {
  cocard: cocard_cocard | null;
}

export interface cocardVariables {
  url: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ocard
// ====================================================

export interface ocard_ocard_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface ocard_ocard_symbol {
  __typename: "Symbol";
  name: string;
  cat: SymbolCat;
}

export interface ocard_ocard {
  __typename: "Ocard";
  id: string;
  template: CardTemplate;
  body: ocard_ocard_body;
  symbol: ocard_ocard_symbol;
  oauthorName: string;
}

export interface ocard {
  ocard: ocard_ocard | null;
}

export interface ocardVariables {
  id?: string | null;
  oauthorName?: string | null;
  symbolName?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: selfcard
// ====================================================

export interface selfcard_selfcard_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface selfcard_selfcard_symbol {
  __typename: "Symbol";
  name: string;
  cat: SymbolCat;
}

export interface selfcard_selfcard {
  __typename: "Selfcard";
  id: string;
  template: CardTemplate;
  body: selfcard_selfcard_body;
  symbol: selfcard_selfcard_symbol;
}

export interface selfcard {
  selfcard: selfcard_selfcard | null;
}

export interface selfcardVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: mycard
// ====================================================

export interface mycard_mycard_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface mycard_mycard_symbol {
  __typename: "Symbol";
  name: string;
  cat: SymbolCat;
}

export interface mycard_mycard {
  __typename: "Selfcard";
  id: string;
  template: CardTemplate;
  body: mycard_mycard_body;
  symbol: mycard_mycard_symbol;
}

export interface mycard {
  mycard: mycard_mycard | null;
}

export interface mycardVariables {
  symbolName: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: anchor
// ====================================================

export interface anchor_anchor_count {
  __typename: "AnchorCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface anchor_anchor {
  __typename: "Anchor";
  id: string;
  userId: string;
  count: anchor_anchor_count;
  cocardId: number | null;
  ocardId: number | null;
  selfcardId: number | null;
}

export interface anchor {
  anchor: anchor_anchor | null;
}

export interface anchorVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: comment
// ====================================================

export interface comment_comment_replies_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface comment_comment_replies {
  __typename: "Reply";
  id: string;
  userId: string;
  isTop: boolean | null;
  text: string;
  updatedAt: any;
  count: comment_comment_replies_count;
}

export interface comment_comment_topReplies_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface comment_comment_topReplies {
  __typename: "Reply";
  id: string;
  userId: string;
  isTop: boolean | null;
  text: string;
  updatedAt: any;
  count: comment_comment_topReplies_count;
}

export interface comment_comment_poll_count {
  __typename: "PollCount";
  nVotes: number[];
}

export interface comment_comment_poll {
  __typename: "Poll";
  id: string;
  commentId: string;
  choices: string[];
  count: comment_comment_poll_count;
  createdAt: any;
}

export interface comment_comment_count {
  __typename: "CommentCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface comment_comment_meta {
  __typename: "CommentMeta";
  seq: number | null;
  mark: string | null;
  src: string | null;
}

export interface comment_comment {
  __typename: "Comment";
  id: string;
  userId: string;
  cocardId: number | null;
  ocardId: number | null;
  selfcardId: number | null;
  isTop: boolean | null;
  text: string | null;
  createdAt: any;
  replies: comment_comment_replies[] | null;
  topReplies: comment_comment_topReplies[] | null;
  poll: comment_comment_poll | null;
  count: comment_comment_count;
  meta: comment_comment_meta | null;
}

export interface comment {
  comment: comment_comment | null;
}

export interface commentVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: replies
// ====================================================

export interface replies_replies_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface replies_replies {
  __typename: "Reply";
  id: string;
  userId: string;
  isTop: boolean | null;
  text: string;
  updatedAt: any;
  count: replies_replies_count;
}

export interface replies {
  replies: replies_replies[];
}

export interface repliesVariables {
  commentId: string;
  afterId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myAnchorLikes
// ====================================================

export interface myAnchorLikes_myAnchorLikes {
  __typename: "AnchorLike";
  id: string;
  anchorId: number;
  choice: LikeChoice;
  createdAt: any;
  updatedAt: any;
}

export interface myAnchorLikes {
  myAnchorLikes: myAnchorLikes_myAnchorLikes[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myCommentLikes
// ====================================================

export interface myCommentLikes_myCommentLikes {
  __typename: "CommentLike";
  id: string;
  commentId: string;
  choice: LikeChoice;
  updatedAt: any;
}

export interface myCommentLikes {
  myCommentLikes: myCommentLikes_myCommentLikes[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myReplyLikes
// ====================================================

export interface myReplyLikes_myReplyLikes {
  __typename: "ReplyLike";
  id: string;
  replyId: string;
  choice: LikeChoice;
  updatedAt: any;
}

export interface myReplyLikes {
  myReplyLikes: myReplyLikes_myReplyLikes[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myVotes
// ====================================================

export interface myVotes_myVotes {
  __typename: "Vote";
  id: string;
  pollId: string;
  choiceIdx: number;
}

export interface myVotes {
  myVotes: myVotes_myVotes[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IsUserLoggedIn
// ====================================================

export interface IsUserLoggedIn {
  isLoggedIn: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me {
  __typename: "User";
  id: string;
}

export interface me {
  me: me_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchAll
// ====================================================

export interface searchAll {
  searchAll: string[];
}

export interface searchAllVariables {
  term: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: automark
// ====================================================

export interface automark {
  automark: string;
}

export interface automarkVariables {
  text: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createCardBody
// ====================================================

export interface createCardBody_createCardBody {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface createCardBody {
  createCardBody: createCardBody_createCardBody;
}

export interface createCardBodyVariables {
  cardId: string;
  data: CardBodyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createMycard
// ====================================================

export interface createMycard_createMycard_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface createMycard_createMycard_symbol {
  __typename: "Symbol";
  name: string;
  cat: SymbolCat;
}

export interface createMycard_createMycard {
  __typename: "Selfcard";
  id: string;
  template: CardTemplate;
  body: createMycard_createMycard_body;
  symbol: createMycard_createMycard_symbol;
}

export interface createMycard {
  createMycard: createMycard_createMycard;
}

export interface createMycardVariables {
  symbolName: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createReply
// ====================================================

export interface createReply_createReply_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface createReply_createReply {
  __typename: "Reply";
  id: string;
  userId: string;
  isTop: boolean | null;
  text: string;
  updatedAt: any;
  count: createReply_createReply_count;
}

export interface createReply {
  createReply: createReply_createReply;
}

export interface createReplyVariables {
  commentId: string;
  data: ReplyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createVote
// ====================================================

export interface createVote_createVote {
  __typename: "Vote";
  id: string;
  pollId: string;
  choiceIdx: number;
}

export interface createVote {
  createVote: createVote_createVote;
}

export interface createVoteVariables {
  pollId: string;
  choiceIdx: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createAnchorLike
// ====================================================

export interface createAnchorLike_createAnchorLike_like {
  __typename: "AnchorLike";
  id: string;
  anchorId: number;
  choice: LikeChoice;
  createdAt: any;
  updatedAt: any;
}

export interface createAnchorLike_createAnchorLike_count {
  __typename: "AnchorCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface createAnchorLike_createAnchorLike {
  __typename: "AnchorLikeResonse";
  like: createAnchorLike_createAnchorLike_like;
  count: createAnchorLike_createAnchorLike_count;
}

export interface createAnchorLike {
  createAnchorLike: createAnchorLike_createAnchorLike;
}

export interface createAnchorLikeVariables {
  anchorId: string;
  data: LikeInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateAnchorLike
// ====================================================

export interface updateAnchorLike_updateAnchorLike_like {
  __typename: "AnchorLike";
  id: string;
  anchorId: number;
  choice: LikeChoice;
  createdAt: any;
  updatedAt: any;
}

export interface updateAnchorLike_updateAnchorLike_count {
  __typename: "AnchorCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface updateAnchorLike_updateAnchorLike {
  __typename: "AnchorLikeResonse";
  like: updateAnchorLike_updateAnchorLike_like;
  count: updateAnchorLike_updateAnchorLike_count;
}

export interface updateAnchorLike {
  updateAnchorLike: updateAnchorLike_updateAnchorLike;
}

export interface updateAnchorLikeVariables {
  id: string;
  data: LikeInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createCommentLike
// ====================================================

export interface createCommentLike_createCommentLike_like {
  __typename: "CommentLike";
  id: string;
  commentId: string;
  choice: LikeChoice;
  updatedAt: any;
}

export interface createCommentLike_createCommentLike_count {
  __typename: "CommentCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface createCommentLike_createCommentLike {
  __typename: "CommentLikeResonse";
  like: createCommentLike_createCommentLike_like;
  count: createCommentLike_createCommentLike_count;
}

export interface createCommentLike {
  createCommentLike: createCommentLike_createCommentLike;
}

export interface createCommentLikeVariables {
  commentId: string;
  data: LikeInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateCommentLike
// ====================================================

export interface updateCommentLike_updateCommentLike_like {
  __typename: "CommentLike";
  id: string;
  commentId: string;
  choice: LikeChoice;
  updatedAt: any;
}

export interface updateCommentLike_updateCommentLike_count {
  __typename: "CommentCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface updateCommentLike_updateCommentLike {
  __typename: "CommentLikeResonse";
  like: updateCommentLike_updateCommentLike_like;
  count: updateCommentLike_updateCommentLike_count;
}

export interface updateCommentLike {
  updateCommentLike: updateCommentLike_updateCommentLike;
}

export interface updateCommentLikeVariables {
  id: string;
  data: LikeInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createReplyLike
// ====================================================

export interface createReplyLike_createReplyLike_like {
  __typename: "ReplyLike";
  id: string;
  replyId: string;
  choice: LikeChoice;
  updatedAt: any;
}

export interface createReplyLike_createReplyLike_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface createReplyLike_createReplyLike {
  __typename: "ReplyLikeResonse";
  like: createReplyLike_createReplyLike_like;
  count: createReplyLike_createReplyLike_count;
}

export interface createReplyLike {
  createReplyLike: createReplyLike_createReplyLike;
}

export interface createReplyLikeVariables {
  replyId: string;
  data: LikeInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateReplyLike
// ====================================================

export interface updateReplyLike_updateReplyLike_like {
  __typename: "ReplyLike";
  id: string;
  replyId: string;
  choice: LikeChoice;
  updatedAt: any;
}

export interface updateReplyLike_updateReplyLike_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface updateReplyLike_updateReplyLike {
  __typename: "ReplyLikeResonse";
  like: updateReplyLike_updateReplyLike_like;
  count: updateReplyLike_updateReplyLike_count;
}

export interface updateReplyLike {
  updateReplyLike: updateReplyLike_updateReplyLike;
}

export interface updateReplyLikeVariables {
  id: string;
  data: LikeInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: signup
// ====================================================

export interface signup_signup_user {
  __typename: "User";
  id: string;
}

export interface signup_signup {
  __typename: "AuthPayload";
  token: string;
  user: signup_signup_user;
}

export interface signup {
  signup: signup_signup;
}

export interface signupVariables {
  email: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login_user {
  __typename: "User";
  id: string;
}

export interface login_login {
  __typename: "AuthPayload";
  token: string;
  user: login_login_user;
}

export interface login {
  login: login_login;
}

export interface loginVariables {
  email: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: vote
// ====================================================

export interface vote {
  __typename: "Vote";
  id: string;
  pollId: string;
  choiceIdx: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: poll
// ====================================================

export interface poll_count {
  __typename: "PollCount";
  nVotes: number[];
}

export interface poll {
  __typename: "Poll";
  id: string;
  commentId: string;
  choices: string[];
  count: poll_count;
  createdAt: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: anchorLike
// ====================================================

export interface anchorLike {
  __typename: "AnchorLike";
  id: string;
  anchorId: number;
  choice: LikeChoice;
  createdAt: any;
  updatedAt: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: anchorCount
// ====================================================

export interface anchorCount {
  __typename: "AnchorCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: anchorFragment
// ====================================================

export interface anchorFragment_count {
  __typename: "AnchorCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface anchorFragment {
  __typename: "Anchor";
  id: string;
  userId: string;
  count: anchorFragment_count;
  cocardId: number | null;
  ocardId: number | null;
  selfcardId: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: replyCount
// ====================================================

export interface replyCount {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: commentCount
// ====================================================

export interface commentCount {
  __typename: "CommentCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: reply
// ====================================================

export interface reply_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface reply {
  __typename: "Reply";
  id: string;
  userId: string;
  isTop: boolean | null;
  text: string;
  updatedAt: any;
  count: reply_count;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: commentFragment
// ====================================================

export interface commentFragment_replies_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface commentFragment_replies {
  __typename: "Reply";
  id: string;
  userId: string;
  isTop: boolean | null;
  text: string;
  updatedAt: any;
  count: commentFragment_replies_count;
}

export interface commentFragment_topReplies_count {
  __typename: "ReplyCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface commentFragment_topReplies {
  __typename: "Reply";
  id: string;
  userId: string;
  isTop: boolean | null;
  text: string;
  updatedAt: any;
  count: commentFragment_topReplies_count;
}

export interface commentFragment_poll_count {
  __typename: "PollCount";
  nVotes: number[];
}

export interface commentFragment_poll {
  __typename: "Poll";
  id: string;
  commentId: string;
  choices: string[];
  count: commentFragment_poll_count;
  createdAt: any;
}

export interface commentFragment_count {
  __typename: "CommentCount";
  id: string;
  nViews: number;
  nUps: number;
  nDowns: number;
}

export interface commentFragment_meta {
  __typename: "CommentMeta";
  seq: number | null;
  mark: string | null;
  src: string | null;
}

export interface commentFragment {
  __typename: "Comment";
  id: string;
  userId: string;
  cocardId: number | null;
  ocardId: number | null;
  selfcardId: number | null;
  isTop: boolean | null;
  text: string | null;
  createdAt: any;
  replies: commentFragment_replies[] | null;
  topReplies: commentFragment_topReplies[] | null;
  poll: commentFragment_poll | null;
  count: commentFragment_count;
  meta: commentFragment_meta | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: commentLike
// ====================================================

export interface commentLike {
  __typename: "CommentLike";
  id: string;
  commentId: string;
  choice: LikeChoice;
  updatedAt: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: replyLike
// ====================================================

export interface replyLike {
  __typename: "ReplyLike";
  id: string;
  replyId: string;
  choice: LikeChoice;
  updatedAt: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: linkFragment
// ====================================================

export interface linkFragment {
  __typename: "Link";
  id: string;
  url: string;
  domain: string;
  srcType: string;
  srcId: string | null;
  oauthorName: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: cardBody
// ====================================================

export interface cardBody {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: cocardFragment
// ====================================================

export interface cocardFragment_meta {
  __typename: "CardMeta";
  commentId: number;
  symbol: string | null;
  conn: string | null;
}

export interface cocardFragment_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface cocardFragment_link {
  __typename: "Link";
  id: string;
  url: string;
  domain: string;
  srcType: string;
  srcId: string | null;
  oauthorName: string | null;
}

export interface cocardFragment {
  __typename: "Cocard";
  id: string;
  template: CardTemplate;
  meta: cocardFragment_meta;
  body: cocardFragment_body | null;
  link: cocardFragment_link;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ocardFragment
// ====================================================

export interface ocardFragment_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface ocardFragment_symbol {
  __typename: "Symbol";
  name: string;
  cat: SymbolCat;
}

export interface ocardFragment {
  __typename: "Ocard";
  id: string;
  template: CardTemplate;
  body: ocardFragment_body;
  symbol: ocardFragment_symbol;
  oauthorName: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: selfcardFragment
// ====================================================

export interface selfcardFragment_body {
  __typename: "CardBody";
  id: string;
  userId: string;
  text: string;
  prevId: number | null;
}

export interface selfcardFragment_symbol {
  __typename: "Symbol";
  name: string;
  cat: SymbolCat;
}

export interface selfcardFragment {
  __typename: "Selfcard";
  id: string;
  template: CardTemplate;
  body: selfcardFragment_body;
  symbol: selfcardFragment_symbol;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CardTemplate {
  TICKER = "TICKER",
  TOPIC = "TOPIC",
  WEBPAGE = "WEBPAGE",
}

export enum LikeChoice {
  DOWN = "DOWN",
  NEUTRAL = "NEUTRAL",
  UP = "UP",
}

export enum SymbolCat {
  TICKER = "TICKER",
  TOPIC = "TOPIC",
}

export interface CardBodyInput {
  text: string;
}

export interface LikeInput {
  choice: LikeChoice;
}

export interface ReplyInput {
  text: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
