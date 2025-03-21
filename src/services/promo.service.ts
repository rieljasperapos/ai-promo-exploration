import algoliasearch from 'algoliasearch';
import { isWithinRadius } from '../utils/geo.utils';
import {
  Promo,
  FilteredPromo,
  UserType,
  GeoLocation,
} from '../types/promotion-types';
import { formatDate } from '../utils/date.utils';
import { algoliaConfig } from '../configs/algolia.configs';

const client = algoliasearch(algoliaConfig.ALGOLIA_APP_ID!, algoliaConfig.ALGOLIA_API_KEY!);
const promoIndex = client.initIndex('promos');

/**
 * Fetches and filters promotions based on user preferences and location
 *
 * @param user - User preferences and location data
 * @returns Promise with filtered promotions or error message
 */
export const fetchFilteredPromos = async (
  user: UserType,
): Promise<FilteredPromo[] | { error: string }> => {
  try {
    const { hits } = await promoIndex.search<Promo>('', {
      facetFilters: [
        user.cardTypes.map((card) => `applicableCards:${card}`),
        user.preferences.map((category) => `categories:${category}`),
      ],
    });

    // Process and filter promotions
    const currentTimestamp = Math.floor(Date.now() / 1000);
    let hasNearbyPromo = false;

    const filteredPromos = hits
      .map((hit) => transformPromotion(hit, user.location, currentTimestamp))
      .filter((promo): promo is FilteredPromo => {
        if (!promo) return false;

        const hasNearbyBranch = promo.participatingBranches.some(
          (branch) => !branch.isBeyond5km,
        );
        if (hasNearbyBranch) hasNearbyPromo = true;

        return true;
      });

    if (!hasNearbyPromo) {
      return { error: 'All promos are beyond 5km from your location.' };
    }

    return filteredPromos;
  } catch (error) {
    console.error('Error fetching promos:', error);
    return { error: 'An error occurred while fetching promos.' };
  }
};

/**
 * Transforms an Algolia hit into a filtered promotion object
 *
 * @param hit - The Algolia search result
 * @param userLocation - User's location coordinates
 * @param currentTimestamp - Current timestamp for date filtering
 * @returns Transformed promotion or null if invalid
 */
function transformPromotion(
  hit: Promo,
  userLocation: GeoLocation,
  currentTimestamp: number,
): FilteredPromo | null {
  if (!hit.participatingBranches || !Array.isArray(hit.participatingBranches)) {
    return null;
  }

  const { startDate, endDate } = hit.promo_period;
  if (startDate > currentTimestamp || endDate < currentTimestamp) {
    return null;
  }

  const updatedBranches = hit.participatingBranches.map((branch) => {
    if (!branch._geoloc) {
      return { ...branch, isBeyond5km: true };
    }

    return {
      ...branch,
      isBeyond5km: !isWithinRadius(
        userLocation,
        branch._geoloc,
        algoliaConfig.DEFAULT_RADIUS_METERS,
      ),
    };
  });

  return {
    id: hit.objectID,
    name: hit.title,
    promoPeriod: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    },
    participatingBranches: updatedBranches.map((branch) => ({
      name: branch.name,
      type: branch.type,
      loc: {
        lat: branch._geoloc?.lat ?? 0,
        long: branch._geoloc?.lng ?? 0,
      },
      isBeyond5km: branch.isBeyond5km,
    })),
    cardTypes: hit.applicableCards.map((card: string, index: number) => ({
      id: `${index + 1}`,
      name: card,
    })),
    terms: {
      minimumAmount: hit.terms.minimumAmount,
      transactionTypes: hit.terms.transactionTypes,
      restrictions: hit.terms.restrictions
    },
  };
}
