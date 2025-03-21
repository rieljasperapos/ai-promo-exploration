# Exploration

### Functionality

The primary purpose of this service is to provide an efficient method for users to access local promotions that are valid within a specified radius from their location. By filtering based on user preferences, the service enables a personalized experience, thereby improving customer engagement. Key functionalities include:

- **User Preference Handling**: The service takes inputs such as user location, card types, and preferences to filter promotions effectively.
- **Promotional Data Retrieval**: It communicates with a database of promotional offers using the Algolia search engine, which allows for fast and reliable searches through large datasets.

### Key Technologies

- **Express.js**: This powerful web application framework is used to create a server that manages incoming requests and delivers responses appropriately.
- **Algolia**: Utilized for its search capabilities, Algolia allows for seamless filtering and retrieval of promotional data, providing an enhanced experience for both users and developers.
- **geolib**: For geofencing (e.g., only show promotions that are 5km away from the users location)

### Installation

#### Prerequisites

- **Node.js**: Version 14 or higher.
- **npm (Node Package Manager)**
- **Git**: To clone the repository.

#### Cloning the repository

```Shell
git clone https://github.com/your-username/promo-filtering-service.git
```

#### Installing dependencies

```Shell
npm install
```

#### Setting up environment variables

```
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_api_key
ALGOLIA_INDEX_NAME=your_algolia_index_name
PORT=your_port_number
```

#### Usage

```
npm start
```

#### Making Request to the API

The Promotional Filtering Service exposes a single API endpoint for filtering promotions based on user preferences. To access this endpoint, you'll need to send a POST request to /api/promos/filter. Below are two examples demonstrating how to format your requests, including expected responses.

Example Request 1: Successful Filtering

```JSON
POST /api/promos/filter HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "cardTypes": ["BDO Gold"],
  "preferences": ["Seafood", "Fast Food"],
  "location": { "lat": 10.33, "lng": 123.90 }
}
```

#### Expected Responses

```JSON
{
    "ai": "\"Enjoy 10% off seafood dishes at Red House Cebu with BDO Gold or HSBC cards and save 50% on dine-in or takeout at McDo Ayala with BDO Gold or Metrobank Platinum cards from March 8-27, 2025!\"",
    "promos": [
        {
            "aiNote": "Experience the best seafood at Red House Cebu with a 10% discount from March 8-27, 2025. This promo is only for BDO Gold and HSBC cardholders who dine-in and spend a minimum of PHP 500. Valid for seafood dishes only!",
            "id": "cf30b8b77ffc6_dashboard_generated_id",
            "name": "Red House 10% Off",
            "promoPeriod": {
                "startDate": "March 8, 2025",
                "endDate": "March 27, 2025"
            },
            "participatingBranches": [
                {
                    "name": "Red House Cebu",
                    "type": "Seafood",
                    "loc": {
                        "lat": 10.3172,
                        "long": 123.889
                    },
                    "isBeyond5km": false
                }
            ],
            "cardTypes": [
                {
                    "id": "1",
                    "name": "BDO Gold"
                },
                {
                    "id": "2",
                    "name": "HSBC"
                }
            ],
            "terms": {
                "minimumAmount": 500,
                "transactionTypes": [
                    "dine-in"
                ],
                "restrictions": [
                    "valid for seafood dishes only"
                ]
            }
        },
        {
            "aiNote": "Enjoy a whopping 50% off at McDo Ayala from March 8-27, 2025! This irresistible deal is available for BDO Gold and Metrobank Platinum cardholders, for dine-in and takeout. Just remember, no combinations allowed!",
            "id": "1c7cd081e01947_dashboard_generated_id",
            "name": "McDo 50% Discount",
            "promoPeriod": {
                "startDate": "March 8, 2025",
                "endDate": "March 27, 2025"
            },
            "participatingBranches": [
                {
                    "name": "McDo Ayala",
                    "type": "Fast Food",
                    "loc": {
                        "lat": 10.3182,
                        "long": 123.9052
                    },
                    "isBeyond5km": false
                }
            ],
            "cardTypes": [
                {
                    "id": "1",
                    "name": "BDO Gold"
                },
                {
                    "id": "2",
                    "name": "Metrobank Platinum"
                }
            ],
            "terms": {
                "minimumAmount": 0,
                "transactionTypes": [
                    "dine-in",
                    "takeout"
                ],
                "restrictions": [
                    "no-combination"
                ]
            }
        }
    ]
}
```

**When the promo that fits the users data are beyond 5km**

```JSON
{
    "message": "All promos are beyond 5km from your location."
}
```

**No promotions matched user data**

```JSON
{
    "ai": "No available promotions at the moment.",
    "promos": []
}
```

## API Endpoints

The Promotional Filtering Service exposes a single API endpoint designed to filter promotions based on user specifications. Below are the detailed descriptions of the available API endpoint, along with the request parameters and expected response formats.

**Endpoint: Filter Promotions**

- **URL**: `/api/promos/filter`
- **HTTP Method**: `POST`

Request Parameters
To successfully utilize this endpoint, you must include the following parameters in the request body:

| **Parameter** | **Type**     | **Description**                                                                                                   | **Required** |
| ------------- | ------------ | ----------------------------------------------------------------------------------------------------------------- | ------------ |
| `location`    | Object       | An object representing user location with latitude and longitude. Example: `{ "lat": 14.5995, "long": 120.9842 }` | **Yes**      |
| `cardTypes`   | Array of Str | An array of card types for filtering, such as `["gold", "silver"]`                                                | **Optional** |
| `preferences` | Array of Str | An array of user preferences for promotions, e.g., `["food", "electronics"]`                                      | **Optional** |
