# Release

_pre-alpha_

1. 目標：了解什麼樣的方式可以刺激討論、社群想要的討論機制/與預測間的接合、預測的形式
 post{ poll, idea, ask, reply, spin }, comment, like, 
 user-poll{ judge, verdict, cron-notice }, 
 board,
 auto-feed{ 有限來源, cron }, auto-event,
 有限tickers{auto-poll}, 

 vote, ticker-data {co-tickers, co-tags}, tag-data {co-tickers, co-tags},
 event-data {}, 

2. 審核入會制, follow, survey, 社群審查, 強化symbol/commit, poll{revote, voted-choice-tick}, username{preserved-names}, profile{ karma, 等級 },
post{ nViews },
board-date-divider,
symbol-hint,
post-filter{ @me, #symbol },
post-spin{ },
chart, symbol-page{ ticker, event },
post-success-remind

3. bet, 相關tags/tickers, 推薦系統, 社群過濾, notices, social-login, lv

alpha

beta

# Todo

* post children/parent -> spin/reply
* poll-judgment邀請：定期檢查poll是否到期 -> notice -> myOwnFeed?
  * fetchMyNotices, 
* ticker-page with poll
* poll-generator: 定時針對{tickers & ticker-}產生對應的polls -> 創poll-post
* 審核制
  * profile、權限
  * task目標 -> 達成目標後有申請button -> 審核post(=judge poll) -> 通過/否決
* poll-reward
* chart
* ticker chart
* symbol follow/unfollow
* author follow/unfollow
* followed list
* trend/hits
* news scraper -> cluster -> auto-event -> event-page
  * event合併、event分支
* survey：user-record -> robo-generator -> post {@roboSurvey post notice} -> fetchMyNotices -> own-feed
* bet(目標價)

# Give&Take、以事實/預測為前提的交流

Give | Take
---- | -----
給預測 | 看預測
??? | 看文
發文 | ???
審查 | ???
評價 | ???
舉報 | ???


# Site

目標 
* 掌握資訊
  * 快速感受市場消息 -> 大量、充分、多元、不重複、可快速瀏覽 -> 挑出重要消息
    * #link @feed, hits, trends <- 自動情報feed && 社群filter
    * 作為primary-source延伸 = spin
  * 深入挖掘特定資訊 -> 觀點、討論 <- 品質好的post <- 初期經營（認同者） && 從新聞聯想
    * spin
    * #idea #ask 
    * #tag #event# $ticker
    * 資訊pool（為該資訊建立整理頁）
    * 類股、題材：比較
    * 公司：經營、財報、新聞
  * 事件日曆
* 尋找投資機會
  * insider資訊
  * signals
* 尋求互動
  * #poll
  * 引導更多的polls <- 推薦 <-
  * 投完票的反饋：
  * my-actions
  * 建立信賴度
  * 累積信賴值
* 增加karma -> 發文/意見、like/dislike、投票
* survey
  * 增加信任感（了解我）

Pages 
* 設計核心：board以情報流為主，引導user到各個pool，
* Board
* Event（資訊彙整、深入分析）：關注度/熱度、tickers、tags、feeds、posts/polls（世界線/分析）、follow/unfollow、歷史events、
  * 確認投資機會 -> 尋找投資標的 -> 判斷投資策略、進場時機/價位
  * 一個事件可能有多個投資標的，因此需要有綜覽比較，ie透過ticker-group
* $Ticker（標的資訊）：價格、所屬的ticker-groups＆排名、經營/公司資訊、歷史價格&factor、群眾/機器預測、訊號
  * 判斷進場時機/價位
  * 預測走勢
* Ticker-group：tickers的比較、
* #Tag（資訊彙整）：events, feeds
  * 類似wiki功能
  * hash-tag: 熱度、
  * ticker
  * event-trend：熱度
* @User：用於了解信用值、判斷價值基礎
  * 原則匿名，可公開（for宣傳）

Steps
* 內測期
  * 意見的完全交流、希望被最大程度回應/滿足
  * 目的是確定每個功能的運作、需求
  * UI

# Board 

* latest-posts: link, idea, poll, spin/reply, auto-polls <- filter/整理過 <- followed-sources
  * 缺點：錯過就沒了 -> spin/reply的source, hit/trend, link中的關聯post, symbol頁的關聯post
  * 缺點：過多post、沒有篩選、重複（例如spin/reply) -> 可加入filter
* hit/trend
* my-own-feed: poll-updates, survey, 推薦posts/symbols/authors, profile-udpate(?)
 
 * 藉由`fetchMyNotices`讓user得到post, poll(judge, verdict), survey(仍是post), 推薦(markdown string), profile-udpate(markdown string)
* my-actions: voted-polls, commented-posts, 
  * @me


__Post__
* 類別
  * 初級：連結、問題、想法、預測
  * 次級：reply、spin -> 在post上都會顯示root
* spin：可以自{連結、問題、想法}產生，用在post-spins
* reply：可以自{問題、想法}產生，用於post-thread，可以單獨顯示在board嗎？
  * reply的目的是是形成一個主題串，讓人可以快速瀏覽，最主要是用在QA，延伸至想法（當有人想要對這想法做長篇回覆時使用）
  * {預測}形成串可以？可以透過reply來把相關的預測想法集中在這個串 vs 直接寫想法？？？另外預測帖一個禮拜更新一次，可能不適合形成串？
  * 為什麼不能reply{連結}？連結主要用在情報流，單一連結不適合作為串，有event做pool，也有comment允許給予意見，不用在形成串


__預測/想知道__ 
* 金融商品（大盤、個股、指數）
  * 趨勢：ticker-page -> 未來走勢：社群/機器預測 -> 預測後查詢
  * 目標價：ticker-page -> 目標價：社群/機器預測 -> 
  * 類似但更好的替代品？
  * signal（like)
* 經濟模型
* 事件類：影響？未來將如何發展（世界線）？該怎麼投資（策略）？
  * 事件page -> 開啟後可以自動發問
  * 類似的歷史事件、當時的影響
* 比較類：哪一個/哪些（在題材中哪個個股比較好、在市場中哪個金融商品比較好）、排序
  * 題材tag -> 當滿足某些條件後可以發表
* 公司經營類：看好/看壞、新產品發表、業績發表、公司事件
  * 公司page

# Action, Risk and Reward

原則：cost/risk vs reward 要互相平衡
user履歷（信用）：lv、收到的likes、karma（比較不重要）、最後登陸時間、領域、rank

karma（行動值）: 1-100，每天最多+-10，原則：鼓勵user做的動作+、不鼓勵做的動作-、user希望做的動作-

lv
* exp
* 權限
  * like limit
  * follow limit

poll
* social-forecase
* machine-forecast
* 預測正確：增加exp

market-data
signals

* login: +1p vs -MAX(10, 連續沒login日數)
* view (click) 
* like: +1p
* dislike: -1p
* comment: +2P
* vote: +1p
* judgment: +1p
* post: +3p
* report: +1p
* 看poll: -3p
* follow
* unfollow


Post

Reply vs Comment 
皆是回應一個post，comment用於「簡易的意見（字數小於n），看到機率低」，reply為「較完整的論述（字數大於n），看到機率高」

__Cost__

__Karma__


# Tag

採用

#看法 #預測 #
#世界線
#題材

不採用

#機會：是個吸引人的tag，但或許會誘發作者習慣使用，造成氾濫，擠壓到其他tag


一些思考

ticker可以包在tag裡嗎？
對於ticker：price, 相關的ticker,

# 初期：在網站空空如也時該怎樣user回頭率、鼓勵user使用/發文？

網站空空如也（沒有user-content）時仍然可以吸引user駐留的情形 
* 網站本身足夠的實用，ie 工具類網站 -> 依靠工具使用站體
* user覺得他是網站的開創者，可以打造自己想要的天地（有主動權而非被動） <- 尋找著自己天地卻找不到的user、領導型的user

如何促進高品質內容？ 
* 什麼情況會讓user想要發高品質的內容？ 社群氣氛（站體都是高品質文）
* 在氣氛沒有形成的情況 -> 主動創造氣氛 -> 邀稿、正回饋、推薦評價系統（讓高品質的發文更容易展現、獎勵）


需要抓到的一些情緒要素 
* 歸屬感（屬於這裡的一份子） <- 參與、共同成長、共同記憶
* 認同感 -> 讓user覺得站體可以解決自己的問題
  * 想解決的問題：一個多元、有價值、高效的資訊交流地
  * 展示的方法：審核制、等級、社群篩選
* 互動與反饋
  * 自己的貢獻是有被獎勵回饋的
* 優越感

一些做法 
* 審核制、邀請制（門檻的一種）
  * 創造優越感/專屬感 <- 來自權力/階級（有審核權 vs 沒有）
    * 透過努力才能入站 -> 增加站體認同、獲得審核權
  * 申請階段：在一定期間內完成一定量的...
    * survey <- 了解user、讓user對站體有初步理解
    * Quiz（可由user創造）
    * 預測
    * Post（回答、看法觀點） -> 獲得某些程度的likes？ -> 發出審核request(post) -> 審核小組審核通過
    * 限制權限：瀏覽、post
* 要有事做/keep busy -> 參與 -> 關注發展 -> 黏著度
  * 新手任務
  * 邀請（誘導）
  * 練級：預測、
  * 資訊流
* 正回饋（獎勵）：user動作後的一些回報 -> 鼓勵user做動作
  * 前提：這些獎勵是真的有價值（會想要累積，例如：dcard的抽卡）
  * 預測力等級(一種認證、優越感、實力的表現) <- 需透過自身努力取得（努力的價值）
    * 透過預測練級 -> 弱反饋（無法馬上反應）、容易疲乏（同質性太高）、無法一次做太多
  * 對交流/連結的渴望（與他人的連結、認同感、英雄惜英雄） <- like/dislike
  * 個人化、客製化、order-made <- like/disliek
* karma（活動度）
  * 可以用來解鎖 -> 解鎖內容需要夠吸引人（例：預測結果、）
* 門檻（例：會員制） -> 排他、專屬、因為門檻而付出會希望不要浪費
* 提供最基本的資訊內容(情報流) -> 在情報流上可以夠容易的產生user-content
  * comment
  * like/dislike -> 可以透過給評價來分類group？
* 盡可能value user-content && 讓其他user反饋user-content，產生黏著性
  * 概念：想看別人對自己發文的回應
  * 自己互動後的反饋/紀錄、
* 自控user-content -> 邀稿
* 自娛內容、自互動、自工具
* 鼓勵發文：新聞聯想（某些機制可以快速連結新聞與發文）、發文獎勵、邀稿/金錢獎勵、
* 鼓勵發高品質文：高品質文獎勵、邀稿/金錢獎勵、
* 信賴度



# Robo

### poll

可在一段時間過後重投（修正看法）

poll vs bet 
bet是針對目標價，poll針對趨勢

@roboPoll

距離美市開盤還有3小時21分鐘，預測今天的$S&P、$DJI、$NAS走勢




### survey

目的：推薦系統： user-profile {likes, follows, baned, suggested-items} -> ...(某些演算法)... -> 推薦post, symbol, author

@roboSurvey

你關注的市場？ 美股、歐股、日股、港陸股、台股、債市、外匯、ETF（基金）、原油、大宗商品 -> 推薦加入 
你傾向哪類型的投資策略？ 基本面、技術面 
你熟悉的產業？ 傳產、電子、 
你比一般投資人更為了解的產業、商品、股票，因而可做出更佳的預測判斷？（例如你所從事的行業） 
你的投資經驗為？剛開始投資（無經驗）、1年以下、1~3年、3~5年、5~10年、10年以上 
你目前在投資上有什麼困難？剛開始投資沒有頭緒、找不到投資標的、沒有好的投資資訊來源 
本站希望解決的問題中，哪項是你最需要的？提供 
你想要找什麼樣的投資標的？妖股、價值股、題材趨勢股、IPO、 
因為你的關注市場中包括台股，你覺得  
哪些關鍵字是你較感興趣的？ #產品 ＃ 
本站會提供當日新聞流，你希望的量？每日{1, 2, 3}次，每次{30、60、120}筆
你希望的新聞來源？CNYES、
-> 為您訂閱@autoCnyes


$LK
你熟悉瑞興咖啡嗎？看多還是看空？
你覺得瑞興咖啡的產品有潛力嘛？
你的專業領域是？你熟悉哪間公司？你覺得這間公司的未來性？
5秒鐘測驗: TSLA的主要產品是：1. 電動車 2. 線上串流影音 3. 火箭
電動車產業中，你覺得最有發展潛力的是：儲能、電池、整車、
你最看好哪個綠能概念股？
目前正在竄升的趨勢：_________________，哪些是你覺得有機會的？





Suggestions, hits, trends
目前正在竄升的題材（-10 karma）：（#半導體、#呼吸器、#疫苗...）
Karma不足，需要__Karma才可開啟 *如何增加karma


@me
你獲得了12個like [ask]房市第二季後反彈？ [comment]... []
你目前等級為：Lv2，距離Lv3還需要 
你參與的預測投票已經公布結果 [查看]
你目前已累積[]，下一等級：


\[邀請\]評審___________是否重複？, 此主題可能與下列post重複


 
# Group

feature to be added

# Stock Analysis

_比較_

_歷史事件_

_財報分析_
* eps
* 營收
* 盈利率
* 本益比

# Sample Posts

_Ask_
在電動車類股當中，哪些股票值得投資？
未來走勢
訊號
暴跌後
事件的5W1H

_Forecast_
* 金融商品（大盤、個股、指數）
  * 趨勢：ticker-page -> 未來走勢：社群/機器預測 -> 預測後查詢
  * 目標價：ticker-page -> 目標價：社群/機器預測 -> 
  * 類似但更好的替代品？
  * signal（like)判斷
  * 怎麼投資
* 經濟模型
* 事件類：影響？未來將如何發展（世界線）？該怎麼投資（策略）？
  * 事件page -> 開啟後可以自動發問
  * 類似的歷史事件、當時的影響
* 比較類：哪一個/哪些（在題材中哪個個股比較好、在市場中哪個金融商品比較好）、排序
  * 題材tag -> 當滿足某些條件後可以發表
* 公司經營類：看好/看壞、新產品發表、業績發表、公司事件
  * 公司page
  * 秘辛、人事
* 政治、政策的預測

_Stage_
熱議、竄升、關注的ticker <-> 陣營
