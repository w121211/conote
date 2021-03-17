import { readFileSync } from 'fs';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import * as PC from '@prisma/client';
import { connect } from 'http2';

const BOT = { email: 'bot@bot.com', password: 'robo' };

const ROBOPOLL_SCHEMA = [
  { index: 1, title: '', text: '', choices: ''.split(',') },
  { index: 2, title: '', text: '', choices: ''.split(',') },
];

const USERS = [
  { email: 'aaa@aaa.com', password: 'aaa' },
  { email: 'bbb@bbb.com', password: 'bbb' },
  { email: 'ccc@ccc.com', password: 'ccc' },
];

const SYMBOLS = [
  { name: '#ask', cat: PC.SymbolCat.TAG },
  { name: '#reply', cat: PC.SymbolCat.TAG },
  { name: '#idea', cat: PC.SymbolCat.TAG },
  { name: '#poll', cat: PC.SymbolCat.TAG },
  { name: '#link', cat: PC.SymbolCat.TAG },
  { name: '$aaa', cat: PC.SymbolCat.TAG },
  { name: '$bbb', cat: PC.SymbolCat.TAG },
];

const _count = {
  nViews: 90,
  nUps: 10,
  nDowns: 30,
  nComments: 21,
};

const POLLS = [
  {
    cat: PC.PollCat.FIXED,
    title: '狂印前的未來',
    text: '狂印錢的未來狂印錢的未來狂印錢的未來狂印錢的未來狂印錢的未來狂印錢的未來狂印錢的未來',
    user: { connect: { email: USERS[0].email } },
    choices: {
      create: [
        { user: { connect: { email: USERS[0].email } }, text: '選項1' },
        { user: { connect: { email: USERS[0].email } }, text: '選項2' },
        { user: { connect: { email: USERS[0].email } }, text: '選項3' },
      ],
    },
    count: { create: {} },
  },
  {
    cat: PC.PollCat.ADD,
    title: '退休存股該買哪些股票？',
    user: { connect: { email: USERS[1].email } },
    count: { create: {} },
  },
  {
    cat: PC.PollCat.ADD_BY_POST,
    title: '退休存股該買哪些股票？(add by post)',
    user: { connect: { email: USERS[2].email } },
    count: { create: {} },
  },
];

// const ADD_CHOICES = [
//   { id: 1, user: { connect: { email: USERS[0].email } }, text: "選項1" },
// ]

const prisma = new PC.PrismaClient({
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn'],
});

async function main() {
  console.log('seeding');

  await prisma.$executeRaw('TRUNCATE "User", "Symbol" CASCADE;');

  for (let d of USERS) {
    const hashedPassword = await hash(d.password, 10);
    await prisma.user.create({
      data: {
        email: d.email,
        password: hashedPassword,
        profile: { create: {} },
        dailyProfile: { create: {} },
      },
    });
  }

  const symbols = await Promise.all(SYMBOLS.map(e => prisma.symbol.create({ data: e })));
  // console.log(symbols)

  const polls = await Promise.all(POLLS.map(e => prisma.poll.create({ data: e, include: { choices: true } })));

  const POSTS = [
    {
      user: { connect: { email: USERS[0].email } },
      cat: PC.PostCat.REPLY,
      text: '這是回覆1這是回覆1這是回覆1這是回覆1這是回覆1這是回覆1這是回覆1',
      symbols: { connect: [{ name: '$aaa' }] },
      poll: { connect: { id: polls[0].id } },
      votes: {
        create: [
          {
            user: { connect: { email: USERS[0].email } },
            poll: { connect: { id: polls[0].id } },
            choice: { connect: { id: polls[0].choices[0].id } },
          },
        ],
      },
      count: { create: {} },
    },
    {
      user: { connect: { email: USERS[1].email } },
      cat: PC.PostCat.REPLY,
      text: '這是回覆2這是回覆2這是回覆2這是回覆2這是回覆2這是回覆2這是回覆2',
      symbols: { connect: [{ name: '$bbb' }] },
      poll: { connect: { id: polls[0].id } },
      votes: {
        create: [
          {
            user: { connect: { email: USERS[1].email } },
            poll: { connect: { id: polls[0].id } },
            choice: { connect: { id: polls[0].choices[1].id } },
          },
        ],
      },
      count: { create: {} },
    },
  ];

  const posts = await Promise.all(POSTS.map(e => prisma.post.create({ data: e })));
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
