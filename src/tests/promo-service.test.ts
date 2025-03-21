import { SearchClient, SearchIndex } from 'algoliasearch';
import { UserType } from '../types/promotion-types';

const mockSearch = jest.fn();
const mockIndex: Partial<SearchIndex> = {
  search: mockSearch,
};
const mockClient: Partial<SearchClient> = {
  initIndex: jest.fn().mockReturnValue(mockIndex),
};

jest.mock('algoliasearch', () => {
  return jest.fn(() => mockClient);
});

import { fetchFilteredPromos } from '../services/promo.service';

const mockUser: UserType = {
  location: { lat: 14.5995, lng: 120.9842 },
  preferences: ['Food', 'Shopping'],
  cardTypes: ['Visa', 'MasterCard'],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchFilteredPromos', () => {
  test('should return filtered promos when valid data is received', async () => {
    mockSearch.mockResolvedValue({
      hits: [
        {
          objectID: '1',
          title: 'Promo 1',
          promo_period: {
            startDate: Math.floor(Date.now() / 1000) - 1000,
            endDate: Math.floor(Date.now() / 1000) + 1000,
          },
          participatingBranches: [
            {
              name: 'Branch 1',
              type: 'Store',
              _geoloc: { lat: 14.6, lng: 120.98 },
            },
          ],
          applicableCards: ['Visa'],
          terms: {
            minimumAmount: 600,
            transactionTypes: ['Online', 'In-store'],
            restrictions: ['Limited to weekends'],
          },
        },
      ],
    });

    const result = await fetchFilteredPromos(mockUser);
    expect(mockSearch).toHaveBeenCalled();
    expect(result).toEqual([
      {
        id: '1',
        name: 'Promo 1',
        promoPeriod: expect.any(Object),
        participatingBranches: expect.any(Array),
        cardTypes: expect.any(Array),
        terms: expect.any(Object),
      },
    ]);
  });

  test('should handle Algolia API errors', async () => {
    mockSearch.mockRejectedValue(new Error('Algolia API error'));

    const result = await fetchFilteredPromos(mockUser);

    expect(mockSearch).toHaveBeenCalled();
    expect(result).toEqual({
      error: 'An error occurred while fetching promos.',
    });
  });

  test('should return error if all promos are beyond 5km', async () => {
    mockSearch.mockResolvedValue({
      hits: [
        {
          objectID: '2',
          title: 'Promo 2',
          promo_period: {
            startDate: Math.floor(Date.now() / 1000) - 1000,
            endDate: Math.floor(Date.now() / 1000) + 1000,
          },
          participatingBranches: [
            {
              name: 'Far Branch',
              type: 'Store',
              _geoloc: { lat: 10.0, lng: 100.0 },
            },
          ],
          applicableCards: ['MasterCard'],
          terms: {
            minimumAmount: 600,
            transactionTypes: ['Online', 'In-store'],
            restrictions: ['Limited to weekends'],
          },
        },
      ],
    });

    const result = await fetchFilteredPromos(mockUser);
    expect(result).toEqual({
      error: 'All promos are beyond 5km from your location.',
    });
  });
});
