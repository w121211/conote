function queryYoutube(url: string) {
  return {
    contentType: 'video',
    contentId: '123',
    contentAuthorId: '345',
  };
}

function _analyzeUrl(url: string) {
  const resolvedUrl = '';
  return {
    domain: '',
    resolvedUrl: '',
  };
}

function getOrCreatePage(url: string) {
  const resolvedUrl = '';
  // Get or create a page by url
  // const link = prisma.link.findOne({})
  // const link = {}
  const page = {};

  // Get or create the author page if applicable
  const authorPage = {};
  // page.update(authorPage)
}

function annotate(url: string) {}
