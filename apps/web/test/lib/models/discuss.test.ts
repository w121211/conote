import prisma from '../../../lib/prisma'
import { clean } from '../../test-helpers'

// it.each(['https://zhuanlan.zhihu.com/p/75120221', 'https://www.mobile01.com/topicdetail.php?f=793&t=6520838'])(
//   'getOrCreateByUrl()',
//   async url => {
//     const card = await CardModel.getOrCreateByUrl({ url: url })
//     expect(clean(card)).toMatchSnapshot()
//   },
// )

// it('', async () => {
//   prisma.discuss.update({
//     where: { id: '1' },
//     data: {
//       // cards: {disconnect}
//     },
//   })
// })
