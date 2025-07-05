import React, { useState } from 'react';
import { SearchForm } from '@/components/SearchForm';
import { BusinessTable } from '@/components/BusinessTable';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { UserMenu } from '@/components/auth/UserMenu';
import { Business } from '@/types/business';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResults = (results: Business[]) => {
    setBusinesses(results);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              California Business Finder
            </h1>
            <p className="text-xl text-gray-600">
              Discover and extract business information across California
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="search">Search Businesses</TabsTrigger>
            <TabsTrigger value="settings">API Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-6">
            <Card className="p-6">
              <SearchForm 
                onResults={handleSearchResults}
                onLoadingChange={handleLoadingChange}
              />
            </Card>

            {(businesses.length > 0 || isLoading) && (
              <Card className="p-6">
                <BusinessTable 
                  businesses={businesses} 
                  isLoading={isLoading}
                />
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="p-6">
              <ApiKeySettings />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
