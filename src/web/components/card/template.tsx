import { useRouter } from 'next/router'
import classes from './card-page.module.scss'

export const Template = () => {
  const router = useRouter()
  return (
    <div className={classes.main}>
      <div className={classes.template}>
        <div>
          <div className={classes.title}>*標題</div>
          <div>*內容大類 技術、研究、公司...</div>
          <div>*來源url</div>
          <div>*tags </div>
          <div>*股票操作建議 /買 /賣</div>
        </div>

        <div>----以下開始新增內容小卡----</div>
        <div>
          <div className={classes.sectionTitle}>股票、事件</div>
          <div className={classes.marker}>介紹</div>
          <div>
            <div className={classes.marker}>最新[!]</div>
            <div>- 最新發生的事件</div>
            <div className={classes.marker}>問題[?]</div>
            <div>- 提出問題 - 問題的回答</div>
            <div className={classes.marker}>概要[*]</div>
            <div>- 產品</div>
            <div>- 產業</div>
            <div className={classes.marker}>加[+]</div>
            <div>- 看好的理由</div>
            <div className={classes.marker}>減[-]</div>
            <div>- 看壞的理由</div>
            <div className={classes.marker}>比較[vs]</div>
            <div>- 競爭對手 - 競爭產品</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Template
