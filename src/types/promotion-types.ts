export interface Promotion {
  id: string;
  title: string;
  description: string;
  promo_period: {
    startDate: string;
    endDate: string;
  };
  participatingBranches: {
    name: string;
    type: string;
    _geoloc: {
      lat: number;
      long: number;
    };
  }[];
  applicableCards: { id: string; name: string }[];
}

export interface Promo {
  objectID: string;
  title: string;
  promo_period: {
    startDate: number;
    endDate: number;
  };
  participatingBranches?: {
    name: string;
    type: string;
    _geoloc: { lat: number; lng: number };
  }[];
  applicableCards: string[];
  terms: {
    minimumAmount: number,
    transactionTypes: string[],
    restrictions: string[]
  }
}

// Transformed promo type after filtering
export interface FilteredPromo {
  id: string;
  name: string;
  promoPeriod: {
    startDate: string;
    endDate: string;
  };
  participatingBranches: Array<{
    name: string;
    type: string;
    loc: {
      lat: number;
      long: number;
    };
    isBeyond5km: boolean;
  }>;
  cardTypes: Array<{
    id: string;
    name: string;
  }>;
  terms: {
    minimumAmount: number,
    transactionTypes: string[],
    restrictions: string[]
  };
}

export interface UserPreferences {
  cardTypes: string[];
  preferences: string[];
  location: GeoLocation;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}
