// /**
//  * "Walk the internal representation and replace specific key-value pairs. This is inspired from the
//     `walk/postwalk-replace` implementation."
//  */
// // function walkTreeToReplace(tree, mappedUids, replaceKeyword) {
// //     postWalk((x) => {
// //         if (replaceKeyword === 'uid') {

import { Block } from './interfaces'
// import { genBlockUid } from './utils'

// //         }
// //     })
// // }

// /**
//  * "In the internal representation replace the uids and block-strings with new uids."
//  */
// function updateUids(tree, mappedUids) {
//   const blockUidsReplaces = walkTreeToReplace(tree, mappedUids, ':block/uid'),
//     blocksWithReplacedsStrings = walkTreeToReplace(
//       blockUidsReplaces,
//       mappedUids,
//       ':block/string',
//     )
//   return blocksWithReplacedsStrings
// }

// /**
//  * (defn text-to-blocks
//   [text uid root-order]
//   (let [;; Split raw text by line
//         lines       (->> (clojure.string/split-lines text)
//                          (filter (comp not clojure.string/blank?)))
//         ;; Count left offset
//         left-counts (->> lines
//                          (map #(re-find #"^\s*(-|\*)?" %))
//                          (map #(-> % first count)))
//         ;; Trim * - and whitespace
//         sanitize    (map (fn [x] (clojure.string/replace x #"^\s*(-|\*)?\s*" ""))
//                          lines)
//         ;; Generate blocks with tempids
//         blocks      (map-indexed (fn [idx x]
//                                    {:db/id        (dec (* -1 idx))
//                                     :block/string x
//                                     :block/open   true
//                                     :block/uid    (utils/gen-block-uid)}) ; TODO(BUG): UID generation during resolution
//                                  sanitize)
//         top_uids    []
//         ;; Count blocks
//         n           (count blocks)
//         ;; Assign parents
//         parents     (loop [i   1
//                            res [(first blocks)]]
//                       (if (= n i)
//                         res
//                         ;; Nested loop: worst-case O(n^2)
//                         (recur (inc i)
//                                (loop [j (dec i)]
//                                  ;; If j is negative, that means the loop has been compared to every previous line,
//                                  ;; and there are no previous lines with smaller left-offsets, which means block i
//                                  ;; should be a root block.
//                                  ;; Otherwise, block i's parent is the first block with a smaller left-offset
//                                  (if (neg? j)
//                                    (do
//                                      (conj top_uids (nth blocks i))
//                                      (conj res (nth blocks i)))
//                                    (let [curr-count (nth left-counts i)
//                                          prev-count (nth left-counts j nil)]
//                                      (if (< prev-count curr-count)
//                                        (conj res {:db/id          (:db/id (nth blocks j))
//                                                   :block/children (nth blocks i)})
//                                        (recur (dec j)))))))))
//         ;; assign orders for children. order can be local or based on outer context where paste originated
//         ;; if local, look at order within group. if outer, use root-order
//         tx-data     (->> (group-by :db/id parents)
//                          ;; maps smaller than size 8 are ordered, larger are not https://stackoverflow.com/a/15500064
//                          (into (sorted-map-by >))
//                          (mapcat (fn [[_tempid blocks]]
//                                    (loop [order 0
//                                           res   []
//                                           data  blocks]
//                                      (let [{:block/keys [children] :as block} (first data)]
//                                        (cond
//                                          (nil? block) res
//                                          (nil? children) (let [new-res (conj res {:db/id          [:block/uid uid]
//                                                                                   :block/children (assoc block :block/order @root-order)})]
//                                                            (swap! root-order inc)
//                                                            (recur order
//                                                                   new-res
//                                                                   (next data)))
//                                          :else (recur (inc order)
//                                                       (conj res (assoc-in block [:block/children :block/order] order))
//                                                       (next data))))))))]
//     (into [] tx-data)))
//  */

// /**
//  *
//  */
// function textToBlocks(text: string, uid, rootOrder) {
//   const lines = text.split('\n').filter(e => e.length > 0),
//     leftCounts = lines
//       .map(e => e.match(/^\s*(-|\*)?/))
//       .map(e => (e === null ? 0 : e[0].length)),
//     sanitize = lines.map(e => e.replace(/^\s*(-|\*)?\s*/, '')),
//     parentAndOrders: { parentId: number | null; order: number }[] = lines.map(
//       (e, i) => {
//         const curCount = leftCounts[i]
//         let order = 0

//         for (let j = 0; j < i; j++) {
//           const prevCount = leftCounts[j]
//           if (prevCount <= curCount) {
//             return { parent: j, order }
//           } else if (prevCount === curCount) {
//             order += 1
//           }
//         }
//         return { parentId: null, order }
//       },
//     ),
//     treeNodes = lines.map((e, i) => ({
//       ...parentAndOrders[i],
//       id: i,
//       content: e,
//     }))
// }

// // (defn text-to-internal-representation
// //     [text]
// //     (let [cpdb                  (d/create-conn common-db/schema)
// //           copy-paste-block      [{:db/id          -1
// //                                   :block/uid      "copy-paste-uid"
// //                                   :block/children []
// //                                   :block/string   "Block for copy paste"}]
// //           tx-data               (text-to-blocks text
// //                                                 "copy-paste-uid"
// //                                                 (atom 0))]
// //       ;; transact first block
// //       (d/transact! cpdb copy-paste-block)

// //       ;; transact the copied blocks
// //       (d/transact! cpdb tx-data)

// //       ;; get the internal representation
// //       ;; we need the eid of the copy-paste-block because that is where all the blocks are added to
// //       ;; all the copied data will be added as the children of the `copy-paste-block`
// //       (:block/children (common-db/get-internal-representation @cpdb
// //                                                               (:db/id (common-db/get-block @cpdb [:block/uid "copy-paste-uid"]))))))

// /**
//  *
//  */
// function textToInternalRepresentation(text: string) {}
