/* eslint-disable no-undef */
const mockSearch = jest.fn().mockResolvedValue({ hits: [] });

const mockInitIndex = jest.fn(() => ({
  search: mockSearch,
}));

const mockClient = {
  initIndex: mockInitIndex,
};

const algoliasearch = jest.fn(() => mockClient);

// Export the mock and its methods to make them accessible in tests
algoliasearch.mockClient = mockClient;
algoliasearch.mockInitIndex = mockInitIndex;
algoliasearch.mockSearch = mockSearch;

module.exports = algoliasearch;
