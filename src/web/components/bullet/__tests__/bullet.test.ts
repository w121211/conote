import { BulletParser } from '../parser'

// test('grammar', () => {
//   // expect(clean(replaceBulletInput(templateTicker.body, params))).toMatchSnapshot()
//   const a = 'this is a test #(...) #Aaa #Bbb #(...) #Ccc #Ddd'
//   // expect(tokenize(a, grammar)).toEqual([])
// })

test.each([
  'Hello #world !!! #Aa1 // #Bb2 // #Cc3 #Dd4',
  '// #Cc3 #Dd4',
  'Hello #world !!! !((poll))(#A1 #A2 #A3) some text ... !((poll:123))(#Bb1 #Bb2)',
  '::[[$PFE宣布研發中疫苗90%有效]]',
])('parseBulletHead', str => {
  expect(BulletParser.parseBulletHead({ str })).toMatchSnapshot()
})
