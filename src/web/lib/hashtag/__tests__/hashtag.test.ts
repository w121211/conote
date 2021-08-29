import { tokenize } from 'prismjs'
import { grammar } from '../text'

test('grammar', () => {
  // expect(clean(replaceBulletInput(templateTicker.body, params))).toMatchSnapshot()
  const a = 'this is a test #(...) #Aaa #Bbb #(...) #Ccc #Ddd'
  expect(tokenize(a, grammar)).toEqual([])
})
