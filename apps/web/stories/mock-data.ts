import { DiscussFragment, DiscussPostFragment } from '../apollo/query.graphql'

export const blocks = []

//
// Discuss
//
//
//
//
//
//

const discuss: DiscussFragment = {
  __typename: 'Discuss',
  id: 'vND44fw4Qh',
  userId: 'EYOPHXutXd',
  status: 'ACTIVE',
  meta: {
    tags: ['space-colonization', 'engineering', 'mars'],
  },
  title:
    ' What would be the best way to build a city structure inside a Mars lava tube? ',
  content: `It has been suggested that lava tubes at Hadriacus Mons could provide a location for a human habitat that would screen out harmful radiation.

https://en.wikipedia.org/wiki/Hadriacus_Mons

My idea for a colony is that it was initially built inside the lava tube (which I gather is huge - 190m wide, 160m tall (100m below surface). This could hold say a 50-story structure of some kind. Once in place, you could extend structures through the surface with radiation protection so you could have windows and a view outside.

Space isn't a problem, but I'm thinking materials are. Assume this is in the future and we have advanced ships and a presence on Mars for many decades - beyond exploration and into settling.

Question: What's the best method to build a city colony structure in the lava tube?

Would it make the most sense to build a "skyscraper" inside with access to the surface? Or would there be some better way to build in this huge open space? Alternately you could begin tunneling in to the rock itself within the tube and build inside the Mars rock itself.

Apparently you might be able to make "mooncrete" (https://en.wikipedia.org/wiki/Lunarcrete) - could you make a sort of "marscrete?"`,
  createdAt: '2022-04-04T19:19:53',
  updatedAt: '2022-04-04T19:19:53',
  count: { nPosts: 10 },
}

const discussPosts: DiscussPostFragment[] = [
  {
    __typename: 'DiscussPost',
    id: '3477',
    userId: 'eezdxKvd3l',
    status: 'ACTIVE',
    content: `Start building in the middle of the tube. That means you can transport materials from both directions rather than just one. Build the heavy structures here in the middle. Like nuclear reactors and water purifiers and oxygen makers.

Build the potato farms on either side of the tube. They need sunlight after all. People also require sunlight to not go bonkers insane. So build homes on either end of the tube near the farms. Make sure to leave a long throughfare between the two sides of the tube. You will need to expand the homes deeper into the tube as population increases.

Don't burrow into the tube wall. There is no need for this. The tube is already burrowed into the mountainside. Why burrow further. It needs the same amount of materials, since you still need to build walls inside the walls to run electrical wires and heating tubes behind.

A single large building is a bad idea. You want each home to have a separate oxygen supply. That means even if one home starts to leak space air you can just run next door.`,
    createdAt: '2022-04-08T22:50:53',
    updatedAt: '2022-04-08T22:50:53',
  },
  {
    __typename: 'DiscussPost',
    id: '3481',
    userId: 'Fts0PzttTS',
    status: 'ACTIVE',
    content: `AKA inflatable building. You need to blow pressurized atmosphere anyway because we like that. Let the atmosphere you blow in there serve a structural role too. Down in the tube all you need is to keep the atmosphere from blowing away and a strong inflatable shell will do fine. It is cheap. It will conform to the tube walls. It is easy to make it modular for expansion or rearrangements. It is easy to patch from the inside.`,
    createdAt: '2022-04-08T20:58:53',
    updatedAt: '2022-04-08T20:58:53',
  },
  {
    __typename: 'DiscussPost',
    id: '3494',
    userId: '5QEhGXX508',
    status: 'ACTIVE',
    content: `3D printing….

Building on the experience learned from building moon habitats that used 3D printing a lot has been learned that can be transferred to Mars. Of course neither the moon or mars have a lot of free water, so 3D printing of concrete like materials was more difficult than on Earth. On the moon the scaling up of solar sintering turned out to be important. On Mars since less sunlight was available, fusion furnaces were used to sinter the crushed and processed mars rock instead but many of the control systems and robotics and software to plan out the city were based on what was learned on the moon.`,
    createdAt: '2022-04-08T22:00:33',
    updatedAt: '2022-04-08T22:00:33',
  },
  {
    __typename: 'DiscussPost',
    id: '3515',
    userId: 'IyHb7hHgiv',
    status: 'ACTIVE',
    content: `My idea is a rotating donut-shaped base living area that would constantly be spinning to passively give astronauts their share of exercise while working. The donut would be on thick steel poles that extend to the sky about 10m. The donut will also be made out of steel.

Although Mars dust can be a big problem for it can be detrimental to the lungs and is electrostatic, in order to enter, their will be a series of airlocks. The first is where they will 'dock' their spacesuit after work outside, which will most likely be covered in dust. After docking, they will slide out into a room, and then go into the main hub.

Food will be a problem to, so an area for aquaponics would be set up to provide astronauts with a nutritious variety of foods.`,
    createdAt: '2022-04-09T07:16:33',
    updatedAt: '2022-04-09T07:16:33',
  },
]

export const mockDiscuss = {
  discuss,
  posts: discussPosts,
}
