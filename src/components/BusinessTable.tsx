
import React, { useState } from 'react';
import { Business } from '@/types/business';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Phone, Mail, Globe, Star, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface BusinessTableProps {
  businesses: Business[];
  isLoading: boolean;
}

export const BusinessTable: React.FC<BusinessTableProps> = ({ businesses, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (business.phone && business.phone.includes(searchTerm))
  );

  const handleExport = () => {
    const csvContent = [
      ['Business Name', 'Phone', 'Website', 'Email', 'Address', 'Rating', 'Types'],
      ...filteredBusinesses.map(business => [
        business.name,
        business.phone || '',
        business.website || '',
        business.email || '',
        business.address,
        business.rating || '',
        business.types.join(', ')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `california-businesses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Loading Businesses...</h2>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Business Results ({filteredBusinesses.length})
        </h2>
        {businesses.length > 0 && (
          <Button onClick={handleExport} variant="outline">
            Export CSV
          </Button>
        )}
      </div>

      {businesses.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {filteredBusinesses.length === 0 && businesses.length > 0 && (
        <p className="text-gray-500 text-center py-8">No businesses match your search.</p>
      )}

      {filteredBusinesses.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Types</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">
                    {business.name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {business.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          <a href={`tel:${business.phone}`} className="hover:text-blue-600">
                            {business.phone}
                          </a>
                        </div>
                      )}
                      {business.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          <a href={`mailto:${business.email}`} className="hover:text-blue-600">
                            {business.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        Visit
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {business.address}
                  </TableCell>
                  <TableCell>
                    {business.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {business.rating}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {business.types.slice(0, 2).map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
