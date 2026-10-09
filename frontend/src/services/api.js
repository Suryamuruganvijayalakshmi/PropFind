// API Client Service for PropFind

const BASE_URL = '/api';

export const api = {
  // Stats
  async getStats() {
    try {
      const res = await fetch(`${BASE_URL}/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (err) {
      console.warn('API error, using cached stats:', err);
      return {
        total_properties: 80,
        available_properties: 80,
        sold_or_rented: 0,
        unique_locations: 71,
        verified_sellers: 12
      };
    }
  },

  // Properties listing with filters
  async getProperties(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.listing_type && params.listing_type !== 'all') query.append('listing_type', params.listing_type);
    if (params.property_type && params.property_type !== 'all') query.append('property_type', params.property_type);
    if (params.location && params.location !== 'all') query.append('location', params.location);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.amenity && params.amenity !== 'all') query.append('amenity', params.amenity);
    if (params.min_price) query.append('min_price', params.min_price);
    if (params.max_price) query.append('max_price', params.max_price);
    if (params.seller_email) query.append('seller_email', params.seller_email);

    try {
      const res = await fetch(`${BASE_URL}/properties?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch properties');
      const data = await res.json();
      return data.properties || [];
    } catch (err) {
      console.error('Error fetching properties from backend:', err);
      return [];
    }
  },

  // Single Property Detail
  async getProperty(id) {
    const res = await fetch(`${BASE_URL}/properties/${id}`);
    if (!res.ok) throw new Error('Property not found');
    return await res.json();
  },

  // Buy or Rent a Property (Enforces Availability Lock)
  async buyProperty(id, buyerData = {}) {
    const res = await fetch(`${BASE_URL}/properties/${id}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buyerData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to acquire property');
    }
    return data;
  },

  // Reset Property Status (For testing or Seller re-listing)
  async resetProperty(id) {
    const res = await fetch(`${BASE_URL}/properties/${id}/reset`, {
      method: 'POST'
    });
    return await res.json();
  },

  // Submit Enquiry & Trigger Simulated Email Dispatch
  async submitEnquiry(enquiryData) {
    const res = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit enquiry');
    }
    return data;
  },

  // Get Enquiries (by seller or buyer)
  async getEnquiries(params = {}) {
    const query = new URLSearchParams();
    if (params.seller_email) query.append('seller_email', params.seller_email);
    if (params.buyer_email) query.append('buyer_email', params.buyer_email);
    const res = await fetch(`${BASE_URL}/enquiries?${query.toString()}`);
    return await res.json();
  },

  // Toggle Favorite
  async toggleFavorite(propertyId, userId = 1) {
    const res = await fetch(`${BASE_URL}/favorites/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: propertyId, user_id: userId })
    });
    return await res.json();
  },

  // Get User Favorites
  async getFavorites(userId = 1) {
    const res = await fetch(`${BASE_URL}/favorites?user_id=${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  // User Auth Login
  async login(credentials) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  },

  // Add new property (Seller)
  async createProperty(propertyData) {
    const res = await fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to list property');
    }
    return data;
  }
};
