import { BlockInput, writeBlocks } from '../../src/utils'

export const mockBlockInput: BlockInput = [
  '[[Firefox]]',
  [
    [
      'About',
      [
        'Official site: https://www.mozilla.org/en-US/firefox/new/',
        'Super fast and fiercely independent. Get the only browser that works to make the internet better for everyone.',
        'Backed by the non-profit that puts people first',
        [
          'Latest Firefox features',
          [
            '[[Picture-in-Picture]]\n' +
              'Pop a video out of the browser window so you can stream and multitask.',
            'Choose your color\n' +
              'Personalize your experience with new colorways.',
            'An extra layer of protection\n' +
              '[[DNS over HTTPS (DoH)]] helps keep internet service providers from selling your data.',
          ],
        ],
      ],
    ],
    [
      'Discuss',
      [
        [
          '#How Firefox compares to other browsers?#',
          [
            // '@source https://www.mozilla.org/en-US/firefox/browsers/compare/',
            //     'A great internet browser should have the functionality you need, portability across devices, and the privacy you deserve.',
          ],
        ],
        // [
        //   '#Which browser is best at keeping things confidential?#',
        //   [
        //     'Its not unreasonable to expect a high level of data protection and privacy from the products we regularly use to get online.',
        //     'At a minimum, a browser should offer some version of “private browsing mode” that automatically deletes your history and search history so other users on the same computer cant access it.',
        //     'In this area, all seven of the browsers compared here score points.',
        //   ],
        // ],
      ],
    ],
  ],
]

export const mockBlocks = writeBlocks(mockBlockInput)
