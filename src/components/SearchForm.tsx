import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Business, SearchParams } from '@/types/business';
import { searchBusinesses } from '@/services/placesApi';
import { fetchStates, fetchCities } from '@/services/locationApi';
import { Search, AlertCircle, Info } from 'lucide-react';

interface SearchFormProps {
  onResults: (businesses: Business[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onResults, onLoadingChange }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    location: '',
    radius: 5000
  });
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [error, setError] = useState<string>('');

  const businessTypes = [
    // Education & Training
    'Basketball academy', 'Tennis academy', 'Soccer academy', 'Swimming academy', 'Martial arts academy',
    'Dance academy', 'Music academy', 'Art academy', 'Language academy', 'Tutoring center',
    'Driving school', 'Cooking school', 'Yoga studio', 'Fitness center', 'Gym',
    
    // Healthcare & Medical
    'Hospital', 'Clinic', 'Dental office', 'Veterinary clinic', 'Pharmacy', 'Physical therapy',
    'Chiropractic clinic', 'Medical center', 'Urgent care', 'Mental health clinic',
    
    // Food & Dining
    'Restaurant', 'Cafe', 'Bar', 'Fast food restaurant', 'Pizza place', 'Bakery',
    'Coffee shop', 'Food truck', 'Catering service', 'Ice cream shop',
    
    // Retail & Shopping
    'Clothing store', 'Grocery store', 'Electronics store', 'Bookstore', 'Jewelry store',
    'Furniture store', 'Hardware store', 'Sporting goods store', 'Pet store', 'Florist',
    
    // Automotive
    'Car dealership', 'Auto repair shop', 'Gas station', 'Car wash', 'Tire shop',
    'Auto parts store', 'Motorcycle dealership', 'Car rental',
    
    // Professional Services
    'Law firm', 'Accounting firm', 'Real estate agency', 'Insurance agency', 'Bank',
    'Marketing agency', 'Consulting firm', 'Tax preparation service', 'Notary public',
    
    // Personal Services
    'Hair salon', 'Barber shop', 'Spa', 'Nail salon', 'Massage therapy', 'Dry cleaner',
    'Tailor', 'Photography studio', 'Event planning', 'Wedding venue',
    
    // Home & Garden
    'Contractor', 'Plumber', 'Electrician', 'Landscaping', 'Interior designer',
    'Home improvement store', 'Garden center', 'Cleaning service', 'Moving company',
    
    // Entertainment & Recreation
    'Movie theater', 'Bowling alley', 'Amusement park', 'Museum', 'Library',
    'Night club', 'Concert hall', 'Sports club', 'Game arcade', 'Mini golf',
    
    // Travel & Hospitality
    'Hotel', 'Motel', 'Bed and breakfast', 'Travel agency', 'Tourist attraction',
    'Airport', 'Bus station', 'Taxi service', 'Car sharing service',
    
    // Technology
    'Computer repair service', 'Software company', 'IT support', 'Phone repair service',
    'Web design agency', 'Data recovery service'
  ];

  // Hardcoded countries for fast selection
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
    'Italy', 'Spain', 'Netherlands', 'Japan', 'South Korea', 'Singapore',
    'New Zealand', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Belgium'
  ];
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const buildLocationString = () => {
    const parts = [];
    if (selectedCity) parts.push(selectedCity);
    if (selectedState) parts.push(selectedState);
    if (selectedCountry) parts.push(selectedCountry);
    if (zipCode) parts.push(zipCode);
    return parts.join(', ');
  };

  // Auto-update custom search query when form fields change
  useEffect(() => {
    if (searchParams.query || selectedCountry || selectedState || selectedCity || zipCode) {
      const location = buildLocationString();
      if (searchParams.query && location) {
        setCustomQuery(`${searchParams.query} in ${location}`);
      } else if (searchParams.query) {
        setCustomQuery(searchParams.query);
      } else if (location) {
        setCustomQuery(`in ${location}`);
      } else {
        setCustomQuery('');
      }
    } else {
      setCustomQuery('');
    }
  }, [searchParams.query, selectedCountry, selectedState, selectedCity, zipCode]);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry).then(setStates).catch(() => setStates([]));
    } else {
      setStates([]);
    }
    setSelectedState('');
    setSelectedCity('');
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetchCities(selectedCountry, selectedState).then(setCities).catch(() => setCities([]));
    } else {
      setCities([]);
    }
    setSelectedCity('');
  }, [selectedCountry, selectedState]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Use custom search if filled, otherwise use form fields
    let queryToUse = searchParams.query;
    let locationToUse = searchParams.location;
    
    if (customQuery && customQuery.trim()) {
      const parts = customQuery.split(' in ');
      queryToUse = parts[0];
      locationToUse = parts.slice(1).join(' in ') || buildLocationString();
    } else {
      locationToUse = buildLocationString();
    }
    
    if (!queryToUse || !locationToUse) {
      const errorMsg = 'Please fill in both business type and location';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const apiKey = localStorage.getItem('google_places_api_key');
    if (!apiKey) {
      const errorMsg = 'Please set your Google Places API key in the settings tab. Make sure to enable Places API (New) in your Google Cloud Console.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    onLoadingChange(true);
    
    try {
      console.log('Starting search with params:', { query: queryToUse, location: locationToUse });
      toast.info('Searching multiple pages for comprehensive results... This may take a moment.');
      
      const results = await searchBusinesses({ 
        query: queryToUse, 
        location: locationToUse, 
        radius: searchParams.radius 
      }, apiKey);
      console.log('Search completed, found:', results.length, 'businesses');
      
      onResults(results);
      toast.success(`Found ${results.length} businesses across multiple pages`);
      setError('');
    } catch (error: any) {
      console.error('Search error:', error);
      
      let errorMessage = 'Failed to search businesses. ';
      
      if (error.message?.includes('403')) {
        errorMessage += 'API key permission denied. Please ensure your API key has Places API (New) enabled and proper permissions.';
      } else if (error.message?.includes('400')) {
        errorMessage += 'Invalid request. Please check your search parameters.';
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        errorMessage += 'API quota exceeded. Please check your Google Cloud billing.';
      } else if (error.message?.includes('REQUEST_DENIED')) {
        errorMessage += 'Request denied. Please check your API key permissions for Places API (New).';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      onResults([]);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Enhanced Business Finder with comprehensive search options. Use the form below or enter a custom search query.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Business Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="business-type">Business Type</Label>
          <Select 
            value={searchParams.query} 
            onValueChange={(value) => setSearchParams(prev => ({ ...prev, query: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select 
              value={selectedCountry} 
              onValueChange={(value) => setSelectedCountry(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Select 
              value={selectedState} 
              onValueChange={(value) => setSelectedState(value)}
              disabled={!selectedCountry}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select 
              value={selectedCity} 
              onValueChange={setSelectedCity}
              disabled={!selectedState}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipcode">Zip Code</Label>
            <Input
              id="zipcode"
              placeholder="Enter zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
        </div>

        {/* Custom Search Option */}
        <div className="space-y-2">
          <Label htmlFor="custom-query">Or enter custom search (overrides above fields)</Label>
          <Input
            id="custom-query"
            placeholder="e.g., Basketball academy in Los Angeles, California, United States"
            className="w-full"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          <Search className="w-4 h-4 mr-2" />
          Search Businesses (Multiple Pages)
        </Button>
      </form>
    </div>
  );
};
