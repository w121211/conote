import {
  BulletParser,
  tokenizeBulletString,
} from '../../../frontend/components/bullet/bullet-parser'

// it('grammar', () => {
//   // expect(clean(replaceBulletInput(templateTicker.body, params))).toMatchSnapshot()
//   const a = 'this is a test #(...) #Aaa #Bbb #(...) #Ccc #Ddd'
//   // expect(tokenize(a, grammar)).toEqual([])
// })

// test.each([
//   'Hello #world !!! #Aa1 // #Bb2 // #Cc3 #Dd4',
//   '// #Cc3 #Dd4',
//   'Hello #world !!! !((poll))(#A1 #A2 #A3) some text ... !((poll:123))(#Bb1 #Bb2)',
//   '::[[$PFE宣布研發中疫苗90%有效]]',
// ])('parseBulletHead', str => {
//   expect(BulletParser.parseBulletHead({ str })).toMatchSnapshot()
// })

const testBullets = [
  'Hello #world !!! #Aa1 // #Bb2 // #Cc3 #Dd4',
  '#Hello world#',
  '#這是一個 discuss-c123456789101112345671239089#',
  '// #Cc3 #Dd4',
  'Hello #world !!! !((poll))(#A1 #A2 #A3) some text ... !((poll:123))(#Bb1 #Bb2)',
  '::[[$PFE宣布研發中疫苗90%有效]]',
]

it.each(testBullets)("tokenize '%s'", async bulletStr => {
  expect(tokenizeBulletString(bulletStr)).toMatchSnapshot()
})

it.each(testBullets)("parse '%s'", async bulletStr => {
  expect(BulletParser.parse(bulletStr)).toMatchSnapshot()
})
