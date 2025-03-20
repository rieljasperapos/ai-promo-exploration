import dotenv from 'dotenv'

dotenv.config()

export const algoliaConfig = {
  "ALGOLIA_APP_ID": process.env.ALGOLIA_APP_ID,
  "ALGOLIA_API_KEY": process.env.ALGOLIA_API_KEY,
  "DEFAULT_RADIUS_METERS": 5000, // 5km
}
