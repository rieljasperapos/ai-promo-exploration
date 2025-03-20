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
Host: localhost:5000
Content-Type: application/json

{
  "location": { "lat": 14.5995, "long": 120.9842 },
  "cardTypes": ["gold", "silver"],
  "preferences": ["food", "electronics"]
}
```

**Expected Response**

```JSON
{
  "promos": [
    {
      "id": "promo123",
      "name": "Buffalo Wild Wings Free Appetizer",
      "promoPeriod": {
        "startDate": "March 1, 2025",
        "endDate": "March 25, 2025"
      },
      "participatingBranches": [
        {
          "name": "Branch 1",
          "type": "Restaurant",
          "loc": {"lat": 14.6000, "long": 120.9800},
          "isBeyond5km": false
        }
      ],
      "cardTypes": [
        { "id": "1", "name": "gold" },
        { "id": "2", "name": "silver" }
      ],
      "terms": {
        "minimumAmount": 500,
        "transactionTypes": [
          "dine-in"
        ],
        "restrictions": [
          "one appetizer per platter"
        ]
      }
    }
  ]
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
| `cardTypes`   | Array of Str | An array of card types for filtering, such as `["gold", "silver"]`                                                | **Yes**      |
| `preferences` | Array of Str | An array of user preferences for promotions, e.g., `["food", "electronics"]`                                      | **Yes**      |
