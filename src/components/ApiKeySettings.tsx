
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, Key, ExternalLink } from 'lucide-react';

export const ApiKeySettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('google_places_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySet(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    localStorage.setItem('google_places_api_key', apiKey.trim());
    setIsKeySet(true);
    toast.success('API key saved successfully!');
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('google_places_api_key');
    setApiKey('');
    setIsKeySet(false);
    toast.success('API key cleared');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Google Places API Settings</h2>
        <p className="text-gray-600">
          Configure your Google Places API key to start searching for businesses.
        </p>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          Your API key is stored locally in your browser and never sent to our servers. 
          It's only used to make requests directly to Google Places API.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>API Key Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google Places API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Places API key"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} className="flex-1">
              {isKeySet ? 'Update API Key' : 'Save API Key'}
            </Button>
            {isKeySet && (
              <Button onClick={handleClearApiKey} variant="destructive">
                Clear
              </Button>
            )}
          </div>

          {isKeySet && (
            <Alert>
              <AlertDescription className="text-green-700">
                ✅ API key is configured and ready to use!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to get your Google Places API Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to the Google Cloud Console</li>
            <li>Create a new project or select an existing one</li>
            <li>Enable the Places API (New) and Geocoding API</li>
            <li>Create credentials (API key)</li>
            <li>Restrict the API key to your domain for security</li>
          </ol>
          <Button variant="outline" asChild className="w-full">
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Open Google Cloud Console
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
