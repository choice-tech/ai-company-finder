
import { Business, SearchParams } from '@/types/business';

// Using Google Places API (New) - this provides more detailed information including phone numbers
const PLACES_API_BASE_URL = 'https://places.googleapis.com/v1/places';

export const searchBusinesses = async (
  params: SearchParams,
  apiKey: string
): Promise<Business[]> => {
  try {
    console.log('Searching for businesses with params:', params);
    
    const allBusinesses: Business[] = [];
    let nextPageToken: string | null = null;
    let pageCount = 0;
    const maxPages = 5; // Limit to prevent excessive API calls
    
    do {
      console.log(`Fetching page ${pageCount + 1}...`);
      
      // Using Places API (New) Text Search endpoint
      const searchUrl = `${PLACES_API_BASE_URL}:searchText`;
      
      const requestBody = {
        textQuery: `${params.query} in ${params.location}`,
        maxResultCount: 20, // Maximum allowed per request
        locationRestriction: {
          rectangle: {
            low: {
              latitude: 32.5342, // Southern California
              longitude: -124.4096
            },
            high: {
              latitude: 42.0095, // Northern California  
              longitude: -114.1308
            }
          }
        },
        ...(nextPageToken && { pageToken: nextPageToken })
      };

      console.log('Making request to Places API (New):', searchUrl);
      
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.priceLevel,places.types,places.businessStatus,nextPageToken'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', response.status, errorText);
        throw new Error(`Places API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.places || data.places.length === 0) {
        console.log('No more places found');
        break;
      }

      console.log(`Found ${data.places.length} places on page ${pageCount + 1}`);

      // Process the results
      for (const place of data.places) {
        try {
          // Extract email from website (basic attempt)
          let email = '';
          if (place.websiteUri) {
            try {
              const domain = new URL(place.websiteUri).hostname.replace('www.', '');
              // Common email patterns for businesses
              const commonPrefixes = ['info', 'contact', 'hello', 'admin', 'support'];
              email = `${commonPrefixes[0]}@${domain}`;
            } catch (e) {
              console.log('Could not extract domain from website:', place.websiteUri);
            }
          }
          
          const business: Business = {
            id: place.id,
            name: place.displayName?.text || 'Unknown',
            phone: place.nationalPhoneNumber || place.internationalPhoneNumber || '',
            website: place.websiteUri || '',
            email: email || '',
            address: place.formattedAddress || '',
            rating: place.rating,
            priceLevel: place.priceLevel,
            types: place.types || [],
            placeId: place.id
          };
          
          allBusinesses.push(business);
        } catch (error) {
          console.error('Error processing place:', error, place);
          // Continue with other places even if one fails
        }
      }
      
      nextPageToken = data.nextPageToken || null;
      pageCount++;
      
      // Add a small delay between requests to respect rate limits
      if (nextPageToken && pageCount < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } while (nextPageToken && pageCount < maxPages);
    
    console.log(`Total processed businesses: ${allBusinesses.length} from ${pageCount} pages`);
    return allBusinesses;
    
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
};

// Function to get detailed place information if needed
export const getPlaceDetails = async (
  placeId: string,
  apiKey: string
): Promise<any> => {
  try {
    const detailsUrl = `${PLACES_API_BASE_URL}/${placeId}`;
    
    const response = await fetch(detailsUrl, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,nationalPhoneNumber,internationalPhoneNumber,websiteUri,rating,priceLevel,types,businessStatus'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Places API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};
