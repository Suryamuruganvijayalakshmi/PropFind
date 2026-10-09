import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "propfind.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Properties Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price INTEGER NOT NULL,
        listing_type TEXT NOT NULL DEFAULT 'buy', -- 'buy' or 'rent'
        property_type TEXT NOT NULL, -- 'residential', 'commercial', 'warehouse', 'farmhouse', 'beach_house'
        location TEXT NOT NULL,
        address TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        bedrooms INTEGER DEFAULT 0,
        bathrooms INTEGER DEFAULT 0,
        sqft INTEGER NOT NULL,
        amenities TEXT NOT NULL, -- JSON array
        image_url TEXT NOT NULL,
        gallery TEXT NOT NULL, -- JSON array
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available', -- 'available', 'sold', 'rented'
        buyer_id INTEGER,
        buyer_name TEXT,
        seller_id INTEGER DEFAULT 1,
        seller_name TEXT NOT NULL,
        seller_agency TEXT NOT NULL,
        seller_phone TEXT NOT NULL,
        seller_email TEXT NOT NULL,
        seller_avatar TEXT NOT NULL,
        seller_rating REAL DEFAULT 4.9,
        seller_verified INTEGER DEFAULT 1,
        featured INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'buyer', -- 'buyer' or 'seller'
        phone TEXT,
        avatar TEXT,
        agency TEXT,
        password TEXT NOT NULL DEFAULT 'pass123',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Enquiries Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER NOT NULL,
        property_title TEXT NOT NULL,
        seller_email TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        buyer_email TEXT NOT NULL,
        buyer_phone TEXT NOT NULL,
        tour_date TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'contacted'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties (id)
    );
    """)

    # Favorites Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, property_id)
    );
    """)

    conn.commit()

    # Seed initial users if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        seed_users(conn)

    # Seed 80 properties if empty
    cursor.execute("SELECT COUNT(*) FROM properties")
    if cursor.fetchone()[0] == 0:
        seed_properties(conn)

    conn.close()

def seed_users(conn):
    cursor = conn.cursor()
    users = [
        ("Sarah Jenkins", "sarah.buyer@propfind.com", "buyer", "+1 (555) 234-8901", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", None, "pass123"),
        ("Marcus Vance", "marcus.seller@vanceholdings.com", "seller", "+1 (555) 789-4321", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "Vance Elite Realty", "pass123"),
        ("Elena Rostova", "elena@azureestates.com", "seller", "+1 (555) 908-1122", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "Azure International", "pass123"),
        ("Julian Thorne", "julian@apexcommercial.com", "seller", "+1 (555) 443-8890", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "Apex Prime Commercial", "pass123")
    ]
    cursor.executemany("INSERT INTO users (name, email, role, phone, avatar, agency, password) VALUES (?, ?, ?, ?, ?, ?, ?)", users)
    conn.commit()

def seed_properties(conn):
    cursor = conn.cursor()
    
    # 80 Distinct Properties with accurate coordinates, realistic high-end images, amenities, and sellers
    # Distributed across:
    # 16 Residential
    # 16 Commercial
    # 16 Warehouse
    # 16 Farmhouse
    # 16 Beach House
    # With a mix of Buy and Rent, prices, and locations.
    
    properties_raw = [
        # --- 16 BEACH HOUSES ---
        {
            "title": "Azure Horizon Glass Villa & Infinity Pool",
            "price": 6450000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "Malibu, California",
            "address": "21804 Pacific Coast Hwy, Malibu, CA 90265",
            "lat": 34.0259, "lng": -118.7798,
            "bedrooms": 5, "bathrooms": 6, "sqft": 7200,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Smart Home", "24/7 Security", "Private Beach Access", "Wine Cellar"],
            "image_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"],
            "description": "Spectacular modern oceanfront sanctuary featuring floor-to-ceiling glass pavilions, panoramic Pacific horizons, and a heated infinity pool touching the sea breeze.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "The Palm Horizon Overwater Haven",
            "price": 28000,
            "listing_type": "rent",
            "property_type": "beach_house",
            "location": "Miami Beach, Florida",
            "address": "4420 Ocean Drive, Miami Beach, FL 33139",
            "lat": 25.7907, "lng": -80.1300,
            "bedrooms": 4, "bathrooms": 5, "sqft": 5400,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Yacht Dock", "Outdoor Kitchen", "Gym"],
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"],
            "description": "Ultra-sleek waterfront residence with private deep-water yacht mooring, expansive cantilevered terraces, and sun-drenched infinity lounger decks.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Cliffside Crystal Pavilion",
            "price": 8900000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "Carmel-by-the-Sea, California",
            "address": "10 Scenic Road, Carmel, CA 93923",
            "lat": 36.5434, "lng": -121.9261,
            "bedrooms": 6, "bathrooms": 7, "sqft": 8100,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Fire Pits", "Heated Floors", "Helipad"],
            "image_url": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"],
            "description": "Perched upon granite cliffs, this masterpiece combines steel-framed monolithic glass walls with an ocean-view lap pool overlooking the dramatic surf.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Biscayne Bay Glass Mirage",
            "price": 22000,
            "listing_type": "rent",
            "property_type": "beach_house",
            "location": "Key Biscayne, Florida",
            "address": "620 Harbor Drive, Key Biscayne, FL 33149",
            "lat": 25.6937, "lng": -80.1628,
            "bedrooms": 4, "bathrooms": 4, "sqft": 4800,
            "amenities": ["Swimming Pool", "Sea View", "Private Beach Access", "Smart Home", "Solar Energy"],
            "image_url": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80"],
            "description": "Private sanctuary offering crystalline coastal vistas, secluded sand shore, and custom glass architectural envelopes engineered for seamless indoor-outdoor living.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Laguna Emerald Cove Villa",
            "price": 5200000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "Laguna Beach, California",
            "address": "319 Cliff Drive, Laguna Beach, CA 92651",
            "lat": 33.5427, "lng": -117.7854,
            "bedrooms": 5, "bathrooms": 5, "sqft": 6100,
            "amenities": ["Swimming Pool", "Sea View", "Spa & Sauna", "Clean Glass Facade", "Elevator"],
            "image_url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"],
            "description": "Awe-inspiring seaside retreat featuring floor-to-ceiling retractable glass doors opening to saltwater pools and private cove steps.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Maui Kahana Coastal Estate",
            "price": 7800000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "Lahaina, Hawaii",
            "address": "4880 Lower Honoapiilani Rd, Lahaina, HI 96761",
            "lat": 20.9789, "lng": -156.6719,
            "bedrooms": 6, "bathrooms": 6, "sqft": 7500,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Tropical Garden", "Private Chef Kitchen"],
            "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"],
            "description": "Polynesian modernism combined with minimalist glass walls. Complete with dual infinity pools facing breathtaking whale-watching channels.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Cabo San Lucas Glass Cliff Villa",
            "price": 18500,
            "listing_type": "rent",
            "property_type": "beach_house",
            "location": "Cabo San Lucas, Mexico",
            "address": "Pedregal Cliffs Lot 44, Cabo San Lucas 23453",
            "lat": 22.8833, "lng": -109.9167,
            "bedrooms": 4, "bathrooms": 5, "sqft": 5200,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Infinity Jacuzzi", "Security Patrol"],
            "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80"],
            "description": "Dramatic Pacific cliff views with cantilevered sunbeds, negative-edge pool, and floor-to-ceiling hurricane glass architecture.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Hamptons Dunes Glass Residence",
            "price": 9400000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "East Hampton, New York",
            "address": "88 Ocean Avenue, East Hampton, NY 11937",
            "lat": 40.9634, "lng": -72.1848,
            "bedrooms": 6, "bathrooms": 7, "sqft": 8400,
            "amenities": ["Swimming Pool", "Sea View", "Tennis Court", "Clean Glass Facade", "Wine Cellar"],
            "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
            "description": "Prestigious Hamptons oceanfront showpiece. Designed with curated triple-pane clarity glass, heated saltwater pool, and direct dune walkway.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Santorini Caldera Sky Villa",
            "price": 15000,
            "listing_type": "rent",
            "property_type": "beach_house",
            "location": "Oia, Santorini",
            "address": "Nikolaou Nomikou 12, Oia 84702",
            "lat": 36.4618, "lng": 25.3753,
            "bedrooms": 3, "bathrooms": 3, "sqft": 3200,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Cave Spa", "Sunset Deck"],
            "image_url": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"],
            "description": "Pure Aegean luxury built into volcanic cliffs. Frameless glass balustrades frame the legendary sunset pool.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Gold Coast Sovereign Waters Villa",
            "price": 4900000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "Surfers Paradise, Queensland",
            "address": "15 Ocean Boulevard, Surfers Paradise 4217",
            "lat": -28.0024, "lng": 153.4318,
            "bedrooms": 5, "bathrooms": 5, "sqft": 6500,
            "amenities": ["Swimming Pool", "Sea View", "Pontoon Dock", "Clean Glass Facade", "EV Charging"],
            "image_url": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"],
            "description": "Australian coastal perfection featuring glass-enclosed open concept lounges and an infinity pool mirroring canal waters.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Newport Beach Oceanfront Sanctuary",
            "price": 7100000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "Newport Beach, California",
            "address": "2201 Ocean Front, Newport Beach, CA 92663",
            "lat": 33.6189, "lng": -117.9298,
            "bedrooms": 5, "bathrooms": 6, "sqft": 6800,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Rooftop Terrace", "Sub-Zero Kitchen"],
            "image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"],
            "description": "Sleek architectural lines bathed in sunlight with heated seaside swimming pool, smart motorized glass louvers, and private boardwalk patio.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Phuket Andaman Glass Pavilion",
            "price": 12500,
            "listing_type": "rent",
            "property_type": "beach_house",
            "location": "Phuket, Thailand",
            "address": "40/1 Millionaires Mile, Kamala, Phuket 83150",
            "lat": 7.9519, "lng": 98.2799,
            "bedrooms": 4, "bathrooms": 4, "sqft": 5100,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Tropical Spa", "Butler Service"],
            "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"],
            "description": "Tropical minimalism surrounded by sea mist. Boasts 25-meter infinity pool, polished teak surfaces, and floor-to-ceiling crystalline walls.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Cape Town Atlantic Seaboard Villa",
            "price": 6200000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "Camps Bay, Cape Town",
            "address": "82 Victoria Road, Camps Bay 8005",
            "lat": -33.9515, "lng": 18.3780,
            "bedrooms": 5, "bathrooms": 5, "sqft": 6900,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Twelve Apostles View", "Solar Backup"],
            "image_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"],
            "description": "Dramatic modern design framing Lion's Head and the Atlantic ocean. Rim-flow swimming pool and triple-glazed soundproof glass walls.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Ibiza White Glass Sunset Villa",
            "price": 19500,
            "listing_type": "rent",
            "property_type": "beach_house",
            "location": "Ibiza, Spain",
            "address": "Cala Tarida Hillside, 07829 Sant Josep",
            "lat": 38.9372, "lng": 1.2389,
            "bedrooms": 5, "bathrooms": 5, "sqft": 5800,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "DJ Booth", "Outdoor Bar"],
            "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"],
            "description": "Iconic Balearic retreat bathed in golden hour light with infinity pool that cascades into the Mediterranean twilight.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Amalfi Positano Clifftop Haven",
            "price": 8500000,
            "listing_type": "buy",
            "property_type": "beach_house",
            "location": "Positano, Italy",
            "address": "Via Cristoforo Colombo 45, Positano 84017",
            "lat": 40.6281, "lng": 14.4850,
            "bedrooms": 4, "bathrooms": 4, "sqft": 4400,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Terraced Lemon Grove", "Wine Cellar"],
            "image_url": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"],
            "description": "Historic Italian charm engineered with cutting-edge cantilevered glass viewing platforms and sea-facing heated pool.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Kauai Hanalei Bay Coastal Sanctuary",
            "price": 24000,
            "listing_type": "rent",
            "property_type": "beach_house",
            "location": "Hanalei, Hawaii",
            "address": "5-5134 Kuhio Hwy, Hanalei, HI 96714",
            "lat": 22.2036, "lng": -159.5015,
            "bedrooms": 4, "bathrooms": 5, "sqft": 5300,
            "amenities": ["Swimming Pool", "Sea View", "Clean Glass Facade", "Mountain Backdrop", "Surf Racks"],
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
            "description": "Nestled between lush emerald peaks and turquoise surf, this pavilion boasts heated lap pool and seamless floor-to-ceiling glass.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },

        # --- 16 RESIDENTIAL PROPERTIES (Penthouses, Glass Condos, Urban Mansions) ---
        {
            "title": "The Lumina Sky Penthouse with Glass Terrace",
            "price": 4850000,
            "listing_type": "buy",
            "property_type": "residential",
            "location": "San Francisco, California",
            "address": "333 Main St, Tower A, San Francisco, CA 94105",
            "lat": 37.7900, "lng": -122.3920,
            "bedrooms": 3, "bathrooms": 4, "sqft": 3950,
            "amenities": ["Clean Glass Facade", "Smart Home", "24/7 Security", "Private Elevator", "Gym", "EV Charging", "City Skyline View"],
            "image_url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"],
            "description": "Floor-to-ceiling triple glazed glass tower residence overlooking the Bay Bridge, fitted with Italian Calacatta marble and automated smart shades.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Tribeca Glass Loft & Private Garden Roof",
            "price": 14000,
            "listing_type": "rent",
            "property_type": "residential",
            "location": "New York, New York",
            "address": "68 Franklin St, New York, NY 10013",
            "lat": 40.7183, "lng": -74.0049,
            "bedrooms": 3, "bathrooms": 3, "sqft": 3200,
            "amenities": ["Clean Glass Facade", "Rooftop Garden", "Fireplace", "Smart Home", "Wine Cellar"],
            "image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
            "description": "Historic Tribeca industrial warmth paired with crisp modern floor-to-ceiling glass expanses, cast iron beams, and private elevator landing.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Bel Air Modernist Glass Monolith",
            "price": 12800000,
            "listing_type": "buy",
            "property_type": "residential",
            "location": "Los Angeles, California",
            "address": "10410 Bellagio Rd, Los Angeles, CA 90077",
            "lat": 34.0815, "lng": -118.4452,
            "bedrooms": 6, "bathrooms": 8, "sqft": 10500,
            "amenities": ["Swimming Pool", "Clean Glass Facade", "Smart Home", "Home Theater", "24/7 Security", "Wine Cellar", "Gym"],
            "image_url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"],
            "description": "Architectural tour de force designed by world-renowned masters with glass cantilevered wings, zero-edge pool, and canyon views.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Mayfair High-Glass Belgravia Penthouse",
            "price": 18000,
            "listing_type": "rent",
            "property_type": "residential",
            "location": "London, United Kingdom",
            "address": "12 Grosvenor Crescent, London SW1X 7EE",
            "lat": 51.5014, "lng": -0.1517,
            "bedrooms": 4, "bathrooms": 4, "sqft": 4100,
            "amenities": ["Clean Glass Facade", "Concierge Service", "Underground Parking", "Smart Home", "Spa & Sauna"],
            "image_url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
            "description": "Prestigious London address featuring expansive glass curtain walls overlooking private garden squares and Buckingham palace gardens.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "The Glass Cube Highland Villa",
            "price": 3750000,
            "listing_type": "buy",
            "property_type": "residential",
            "location": "Austin, Texas",
            "address": "4508 Mount Bonnell Rd, Austin, TX 78731",
            "lat": 30.3208, "lng": -97.7733,
            "bedrooms": 4, "bathrooms": 5, "sqft": 5200,
            "amenities": ["Swimming Pool", "Clean Glass Facade", "Solar Energy", "Smart Home", "EV Charging", "Lake View"],
            "image_url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
            "description": "Lake Austin vista residence crafted with steel framework and transparent glass walls, nestled in ancient live oaks.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Seattle Pike Glass Spire Residence",
            "price": 9500,
            "listing_type": "rent",
            "property_type": "residential",
            "location": "Seattle, Washington",
            "address": "1521 2nd Ave, Penthouse 34, Seattle, WA 98101",
            "lat": 47.6097, "lng": -122.3396,
            "bedrooms": 3, "bathrooms": 3, "sqft": 2800,
            "amenities": ["Clean Glass Facade", "Sound Views", "24/7 Security", "Wine Cellar", "Gym"],
            "image_url": "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
            "description": "Spectacular Puget Sound and Olympic Mountain vistas with full perimeter acoustic insulated glass curtain.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Chicago Lakeshore Glass Tower Flat",
            "price": 2650000,
            "listing_type": "buy",
            "property_type": "residential",
            "location": "Chicago, Illinois",
            "address": "840 N Lake Shore Dr, Chicago, IL 60611",
            "lat": 41.8988, "lng": -87.6190,
            "bedrooms": 3, "bathrooms": 3, "sqft": 3400,
            "amenities": ["Clean Glass Facade", "Lake Michigan View", "Valet Parking", "Indoor Lap Pool", "Smart Home"],
            "image_url": "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"],
            "description": "Stunning Gold Coast luxury flat overlooking Lake Michigan with uninterrupted horizontal glass ribbons.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Tokyo Roppongi Sky Sanctuary",
            "price": 16000,
            "listing_type": "rent",
            "property_type": "residential",
            "location": "Tokyo, Japan",
            "address": "6-10-1 Roppongi, Minato City, Tokyo 106-0032",
            "lat": 35.6628, "lng": 139.7314,
            "bedrooms": 2, "bathrooms": 2, "sqft": 2400,
            "amenities": ["Clean Glass Facade", "Mount Fuji View", "Concierge Service", "Smart Home", "Heated Hinoki Tub"],
            "image_url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
            "description": "Futuristic Japanese elegance with sound-dampened smart electrochromic glass providing privacy at the press of a switch.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Parisian Haussmann-Modernist Duplex",
            "price": 5600000,
            "listing_type": "buy",
            "property_type": "residential",
            "location": "Paris, France",
            "address": "28 Avenue Montaigne, 75008 Paris",
            "lat": 48.8662, "lng": 2.3082,
            "bedrooms": 4, "bathrooms": 4, "sqft": 3600,
            "amenities": ["Clean Glass Facade", "Eiffel Tower View", "Private Courtyard", "Wine Cellar", "Smart Home"],
            "image_url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"],
            "description": "Where classical Parisian moldings meet an ultra-contemporary glass atrium and private rooftop view of the Iron Lady.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Vancouver Coal Harbour Glass Point",
            "price": 11000,
            "listing_type": "rent",
            "property_type": "residential",
            "location": "Vancouver, Canada",
            "address": "1280 W Pender St, Vancouver, BC V6E 4S1",
            "lat": 49.2888, "lng": -123.1246,
            "bedrooms": 3, "bathrooms": 3, "sqft": 2900,
            "amenities": ["Clean Glass Facade", "Sea View", "Marina Slips", "Smart Home", "24/7 Security"],
            "image_url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80"],
            "description": "Spectacular waterfront condominium with panoramic glass curtain wall looking onto North Shore snow peaks and yachts.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Sydney Harbour Bridge Glass Haven",
            "price": 8200000,
            "listing_type": "buy",
            "property_type": "residential",
            "location": "Sydney, Australia",
            "address": "1 Macquarie St, Sydney NSW 2000",
            "lat": -33.8587, "lng": 151.2140,
            "bedrooms": 4, "bathrooms": 4, "sqft": 4500,
            "amenities": ["Clean Glass Facade", "Sea View", "Opera House View", "Heated Pool", "Private Concierge"],
            "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
            "description": "Front-row harbor living with custom curved architectural glass framing the Opera House and Harbour Bridge.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Boston Back Bay Brownstone Penthouse",
            "price": 8200,
            "listing_type": "rent",
            "property_type": "residential",
            "location": "Boston, Massachusetts",
            "address": "192 Commonwealth Ave, Boston, MA 02116",
            "lat": 42.3519, "lng": -71.0784,
            "bedrooms": 3, "bathrooms": 3, "sqft": 2700,
            "amenities": ["Clean Glass Facade", "Rooftop Deck", "Elevator", "Historic Brick", "Smart Thermostat"],
            "image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"],
            "description": "Modern glass roof addition atop an iconic 1890s sandstone brownstone with skyline sunroom and gas lanterns.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Scottsdale Sonoran Glass Villa",
            "price": 4100000,
            "listing_type": "buy",
            "property_type": "residential",
            "location": "Scottsdale, Arizona",
            "address": "10824 E Desert Trail, Scottsdale, AZ 85255",
            "lat": 33.6846, "lng": -111.8753,
            "bedrooms": 5, "bathrooms": 6, "sqft": 6400,
            "amenities": ["Swimming Pool", "Clean Glass Facade", "Mountain Backdrop", "Solar Energy", "Fire Pits"],
            "image_url": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"],
            "description": "Rammed-earth and glass pavilion designed to frame McDowell Mountain sunsets, featuring an integrated lap pool.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Denver Cherry Creek Glass Townhome",
            "price": 6900,
            "listing_type": "rent",
            "property_type": "residential",
            "location": "Denver, Colorado",
            "address": "250 Columbine St, Denver, CO 80206",
            "lat": 39.7190, "lng": -104.9540,
            "bedrooms": 3, "bathrooms": 4, "sqft": 3100,
            "amenities": ["Clean Glass Facade", "Rooftop Hot Tub", "Heated Driveway", "Smart Home", "EV Charging"],
            "image_url": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
            "description": "Multi-tier glass residence in high-end Cherry Creek North with private elevator, heated glass sunroom, and mountain views.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Aspen Red Mountain Snow Glass Chalet",
            "price": 14500000,
            "listing_type": "buy",
            "property_type": "residential",
            "location": "Aspen, Colorado",
            "address": "720 Willoughby Way, Aspen, CO 81611",
            "lat": 39.1989, "lng": -106.8175,
            "bedrooms": 6, "bathrooms": 7, "sqft": 9200,
            "amenities": ["Swimming Pool", "Clean Glass Facade", "Ski-In/Ski-Out", "Wine Cellar", "Spa & Sauna", "Smart Home"],
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"],
            "description": "Billionaire Mountain residence with thermally insulated glass curtains providing unobstructed vistas of Ajax Mountain.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Toronto Yorkville Glass Sky Suite",
            "price": 10500,
            "listing_type": "rent",
            "property_type": "residential",
            "location": "Toronto, Canada",
            "address": "155 Yorkville Ave, Toronto, ON M5R 1C4",
            "lat": 43.6702, "lng": -79.3916,
            "bedrooms": 3, "bathrooms": 3, "sqft": 3000,
            "amenities": ["Clean Glass Facade", "Valet Service", "Smart Home", "Private Elevator", "Gym"],
            "image_url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"],
            "description": "Executive residence in elite Yorkville featuring 11-foot finished ceilings and acoustic triple-glazed panoramic glass.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },

        # --- 16 COMMERCIAL PROPERTIES (Offices, Tech Towers, Flagship Buildings) ---
        {
            "title": "The Prism Core Silicon Valley Tech Tower",
            "price": 34000000,
            "listing_type": "buy",
            "property_type": "commercial",
            "location": "San Jose, California",
            "address": "400 S 1st St, San Jose, CA 95113",
            "lat": 37.3308, "lng": -121.8860,
            "bedrooms": 0, "bathrooms": 24, "sqft": 48000,
            "amenities": ["Clean Glass Facade", "LEED Platinum", "High-Speed Fiber", "24/7 Security", "EV Fleet Charging", "Auditorium"],
            "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"],
            "description": "Next-generation corporate headquarters wrapped in low-E structural glazing with smart climate automation and expansive cafeteria terraces.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Hudson Yards Glass Executive Suites",
            "price": 65000,
            "listing_type": "rent",
            "property_type": "commercial",
            "location": "New York, New York",
            "address": "50 Hudson Yards, Fl 42, New York, NY 10001",
            "lat": 40.7539, "lng": -74.0007,
            "bedrooms": 0, "bathrooms": 8, "sqft": 14000,
            "amenities": ["Clean Glass Facade", "24/7 Security", "Smart Elevator", "Boardroom Facilities", "City Skyline View"],
            "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "World-class corporate workplace with 360-degree glass views of Manhattan, dedicated high-speed server infrastructure, and VIP lounge.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "The Shard Edge Corporate Floors",
            "price": 78000,
            "listing_type": "rent",
            "property_type": "commercial",
            "location": "London, United Kingdom",
            "address": "32 London Bridge St, London SE1 9SG",
            "lat": 51.5045, "lng": -0.0865,
            "bedrooms": 0, "bathrooms": 12, "sqft": 18500,
            "amenities": ["Clean Glass Facade", "24/7 Security", "Thames River View", "LEED Gold", "Conference Hall"],
            "image_url": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "Pinnacle commercial floors perched high in Western Europe's most iconic glass spire, overlooking the River Thames and the City.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Singapore Marina Bay Financial Hub",
            "price": 42000000,
            "listing_type": "buy",
            "property_type": "commercial",
            "location": "Singapore, Central Area",
            "address": "8 Marina Blvd, Marina Bay 018981",
            "lat": 1.2800, "lng": 103.8540,
            "bedrooms": 0, "bathrooms": 32, "sqft": 62000,
            "amenities": ["Clean Glass Facade", "Green Mark Platinum", "Sky Garden", "Direct MRT Link", "Tier-4 Data Center"],
            "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"],
            "description": "Trophy commercial building in the heart of Singapore's financial district featuring double-glazed curtain walls and lush vertical green terraces.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Frankfurt Main Tower Financial Office",
            "price": 54000,
            "listing_type": "rent",
            "property_type": "commercial",
            "location": "Frankfurt, Germany",
            "address": "Neue Mainzer Str. 52-58, 60311 Frankfurt",
            "lat": 50.1128, "lng": 8.6722,
            "bedrooms": 0, "bathrooms": 10, "sqft": 15000,
            "amenities": ["Clean Glass Facade", "High-Speed Elevators", "Secure Vaults", "Skyline Restaurant Access"],
            "image_url": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "Premium banking suites in Frankfurt's banking quarter with acoustic acoustic triple glazing and state-of-the-art HVAC systems.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Dubai DIFC Crystal Plaza Building",
            "price": 28000000,
            "listing_type": "buy",
            "property_type": "commercial",
            "location": "Dubai, UAE",
            "address": "Gate Precinct 4, DIFC, Dubai",
            "lat": 25.2048, "lng": 55.2708,
            "bedrooms": 0, "bathrooms": 20, "sqft": 42000,
            "amenities": ["Clean Glass Facade", "24/7 Security", "Private VIP Entrances", "Helipad Access", "Luxury Retail Arcade"],
            "image_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "Architectural marvel engineered with solar reflective crystal glass to withstand the Arabian sun while presenting opulent office suites.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Zurich Paradeplatz Corporate Pavilion",
            "price": 45000,
            "listing_type": "rent",
            "property_type": "commercial",
            "location": "Zurich, Switzerland",
            "address": "Bahnhofstrasse 45, 8001 Zurich",
            "lat": 47.3703, "lng": 8.5393,
            "bedrooms": 0, "bathrooms": 6, "sqft": 9500,
            "amenities": ["Clean Glass Facade", "Bank Grade Security", "Private Courtyard", "High-Tech Meeting Hubs"],
            "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "Exclusive private wealth management headquarters on the prestigious Bahnhofstrasse with bespoke Swiss glass craftsmanship.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Austin Downtown Glass Tech Campus",
            "price": 24500000,
            "listing_type": "buy",
            "property_type": "commercial",
            "location": "Austin, Texas",
            "address": "300 Colorado St, Austin, TX 78701",
            "lat": 30.2662, "lng": -97.7451,
            "bedrooms": 0, "bathrooms": 18, "sqft": 36000,
            "amenities": ["Clean Glass Facade", "Rooftop Lounge", "EV Charging", "Fitness Center", "Dog Park"],
            "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"],
            "description": "Purpose-built tech innovation campus featuring open-concept column-free floor plates and high-transparency glass curtains.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Hong Kong Central Glass Skyscraper Floor",
            "price": 92000,
            "listing_type": "rent",
            "property_type": "commercial",
            "location": "Hong Kong, Central",
            "address": "88 Queensway, Central, Hong Kong",
            "lat": 22.2783, "lng": 114.1648,
            "bedrooms": 0, "bathrooms": 14, "sqft": 21000,
            "amenities": ["Clean Glass Facade", "Victoria Harbour View", "24/7 Security", "Private Elevator Bank"],
            "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "Elite financial headquarters commanding views across Victoria Harbour, fitted with smart acoustic micro-glass dividers.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Berlin Potsdamer Platz Glass Center",
            "price": 18900000,
            "listing_type": "buy",
            "property_type": "commercial",
            "location": "Berlin, Germany",
            "address": "Potsdamer Platz 1, 10785 Berlin",
            "lat": 52.5096, "lng": 13.3765,
            "bedrooms": 0, "bathrooms": 16, "sqft": 31000,
            "amenities": ["Clean Glass Facade", "LEED Certified", "Underground Parking", "Subway Access", "Solar Energy"],
            "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"],
            "description": "Futuristic landmark commercial building featuring energy-generating photovoltaic glass facades and smart atrium ventilation.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Tokyo Marunouchi Financial Headquarters",
            "price": 85000,
            "listing_type": "rent",
            "property_type": "commercial",
            "location": "Tokyo, Japan",
            "address": "1-5-1 Marunouchi, Chiyoda City, Tokyo 100-6590",
            "lat": 35.6812, "lng": 139.7671,
            "bedrooms": 0, "bathrooms": 14, "sqft": 19500,
            "amenities": ["Clean Glass Facade", "Earthquake Isolated Base", "Imperial Palace View", "Executive Boardrooms"],
            "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "Premier grade-A office space facing the Imperial Palace gardens, engineered with cutting-edge Japanese seismic glass technology.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Seoul Gangnam Glass Innovation Tower",
            "price": 27000000,
            "listing_type": "buy",
            "property_type": "commercial",
            "location": "Seoul, South Korea",
            "address": "513 Teheran-ro, Gangnam-gu, Seoul",
            "lat": 37.5088, "lng": 127.0609,
            "bedrooms": 0, "bathrooms": 22, "sqft": 44000,
            "amenities": ["Clean Glass Facade", "AI Climate Control", "Robotic Delivery Access", "Fiber Backbone"],
            "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"],
            "description": "High-tech skyscraper along Teheran Valley showcasing transparent media facade glass and automated building management.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Seattle South Lake Union Bio-Tech Building",
            "price": 38000,
            "listing_type": "rent",
            "property_type": "commercial",
            "location": "Seattle, Washington",
            "address": "500 Fairview Ave N, Seattle, WA 98109",
            "lat": 47.6237, "lng": -122.3330,
            "bedrooms": 0, "bathrooms": 8, "sqft": 16000,
            "amenities": ["Clean Glass Facade", "Wet Lab Infrastructure", "LEED Gold", "Bike Lockers & Showers"],
            "image_url": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "Specialized life sciences and tech center with state-of-the-art clean room filtration and transparent solar glass envelope.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Amsterdam Zuidas Glass Atrium Offices",
            "price": 16500000,
            "listing_type": "buy",
            "property_type": "commercial",
            "location": "Amsterdam, Netherlands",
            "address": "Gustav Mahlerlaan 10, 1082 PP Amsterdam",
            "lat": 52.3364, "lng": 4.8735,
            "bedrooms": 0, "bathrooms": 14, "sqft": 28000,
            "amenities": ["Clean Glass Facade", "BREEAM Outstanding", "Canal Views", "Solar Energy", "Underground Parking"],
            "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"],
            "description": "Ultra-sustainable European commercial hub featuring a 6-story light-filled glass atrium and circular economy architecture.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Miami Brickell Financial Center Office",
            "price": 31000,
            "listing_type": "rent",
            "property_type": "commercial",
            "location": "Miami, Florida",
            "address": "701 Brickell Ave, Miami, FL 33131",
            "lat": 25.7667, "lng": -80.1903,
            "bedrooms": 0, "bathrooms": 6, "sqft": 11000,
            "amenities": ["Clean Glass Facade", "Bay Views", "Hurricane Impact Glazing", "Valet Parking", "24/7 Security"],
            "image_url": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "High-profile Brickell business suite with sweeping views of Biscayne Bay and sleek floor-to-ceiling blue reflective glass.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Denver LoDo Historic Glass Warehouse Conversion",
            "price": 12800000,
            "listing_type": "buy",
            "property_type": "commercial",
            "location": "Denver, Colorado",
            "address": "1601 Blake St, Denver, CO 80202",
            "lat": 39.7516, "lng": -104.9989,
            "bedrooms": 0, "bathrooms": 10, "sqft": 22000,
            "amenities": ["Clean Glass Facade", "Exposed Timber Beams", "Rooftop Deck", "High Speed Fiber"],
            "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "description": "Timber, masonry, and floor-to-ceiling glass come together in this creative commercial agency building steps from Union Station.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },

        # --- 16 WAREHOUSE & INDUSTRIAL LOGISTICS HUBS ---
        {
            "title": "Apex Velocity Global Logistics Megahub",
            "price": 26500000,
            "listing_type": "buy",
            "property_type": "warehouse",
            "location": "Inland Empire, California",
            "address": "14200 Slover Ave, Fontana, CA 92337",
            "lat": 34.0722, "lng": -117.4812,
            "bedrooms": 0, "bathrooms": 12, "sqft": 320000,
            "amenities": ["36ft Clear Height", "54 Loading Docks", "ESFR Sprinklers", "Solar Roof", "EV Semi Charging", "24/7 Security"],
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"],
            "description": "Class-A state-of-the-art logistics hub featuring cross-dock configurations, high-security gatehouses, and full automated racking compatibility.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Dallas North Metro Cold Storage & Distribution",
            "price": 42000,
            "listing_type": "rent",
            "property_type": "warehouse",
            "location": "Dallas, Texas",
            "address": "8900 Ambassador Row, Dallas, TX 75247",
            "lat": 32.8184, "lng": -96.8770,
            "bedrooms": 0, "bathrooms": 6, "sqft": 115000,
            "amenities": ["Temperature Controlled", "Freezer / Cooler Zones", "28 Dock High Doors", "Heavy Power (3000A)", "24/7 Security"],
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "description": "Specialized multi-temp cold chain facility featuring dual refrigeration systems and expansive truck staging aprons.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Chicago I-80 Corridor Logistics Center",
            "price": 19800000,
            "listing_type": "buy",
            "property_type": "warehouse",
            "location": "Joliet, Illinois",
            "address": "3500 CenterPoint Way, Joliet, IL 60436",
            "lat": 41.4883, "lng": -88.1360,
            "bedrooms": 0, "bathrooms": 8, "sqft": 240000,
            "amenities": ["Intermodal Rail Access", "40ft Clear Ceiling", "48 Dock Levelers", "Trailer Parking (120 Stalls)"],
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"],
            "description": "Direct intermodal connectivity with Midwest freight lines, high-cube racking capacity, and heavy concrete aprons.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Rotterdam Port Industrial Gateway Hub",
            "price": 38000,
            "listing_type": "rent",
            "property_type": "warehouse",
            "location": "Rotterdam, Netherlands",
            "address": "Maasvlakte 2 Haven 9200, 3199 LK Rotterdam",
            "lat": 51.9610, "lng": 4.0289,
            "bedrooms": 0, "bathrooms": 8, "sqft": 140000,
            "amenities": ["Deep Sea Port Access", "Bonded Customs Zone", "Hazmat Certified", "Gantry Crane Installed"],
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "description": "Direct quayside multimodal transshipment facility with customs bonded security clearance and heavy container handling.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Atlanta Aerotropolis Air Cargo Facility",
            "price": 17200000,
            "listing_type": "buy",
            "property_type": "warehouse",
            "location": "Atlanta, Georgia",
            "address": "1200 Aviation Blvd, Atlanta, GA 30354",
            "lat": 33.6558, "lng": -84.4277,
            "bedrooms": 0, "bathrooms": 6, "sqft": 180000,
            "amenities": ["Airside Tarmac Access", "24/7 TSA Bonded", "High-Security Fencing", "Fast Highway Access"],
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"],
            "description": "Prime position adjoining Hartsfield-Jackson airport for rapid air freight distribution and last-mile logistics operations.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Phoenix Sky Harbor Advanced Distribution",
            "price": 28000,
            "listing_type": "rent",
            "property_type": "warehouse",
            "location": "Phoenix, Arizona",
            "address": "4250 S 43rd Ave, Phoenix, AZ 85043",
            "lat": 33.4075, "lng": -112.1528,
            "bedrooms": 0, "bathrooms": 6, "sqft": 92000,
            "amenities": ["Insulated Roof Coating", "24 Loading Docks", "Heavy 3-Phase Power", "Trailer Yard"],
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "description": "High-efficiency desert distribution facility featuring advanced white reflective roof and full temperature control.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "New Jersey Exit 8A Turnpike Warehouse",
            "price": 22400000,
            "listing_type": "buy",
            "property_type": "warehouse",
            "location": "Cranbury, New Jersey",
            "address": "150 Station Rd, Cranbury, NJ 08512",
            "lat": 40.3090, "lng": -74.5204,
            "bedrooms": 0, "bathrooms": 8, "sqft": 260000,
            "amenities": ["Port Newark Transit", "ESFR Fire Protection", "42 Docks", "Guard Shack", "Solar Energy"],
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"],
            "description": "Crown jewel in New Jersey's primary distribution corridor serving the greater New York metropolitan market.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Hamburg Port Industrial Park",
            "price": 32000,
            "listing_type": "rent",
            "property_type": "warehouse",
            "location": "Hamburg, Germany",
            "address": "Kattwykstrasse 12, 21107 Hamburg",
            "lat": 53.4939, "lng": 9.9482,
            "bedrooms": 0, "bathrooms": 6, "sqft": 98000,
            "amenities": ["Port Barge Connection", "High-Bay Racking", "Sprinkler System", "Heavy Floor Load (10t/m2)"],
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "description": "Northern European logistics hub situated adjacent to container terminals with reinforced concrete floor slabs.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Houston Port Chemical & Cargo Complex",
            "price": 15800000,
            "listing_type": "buy",
            "property_type": "warehouse",
            "location": "Houston, Texas",
            "address": "9800 Highway 225, Pasadena, TX 77507",
            "lat": 29.7042, "lng": -95.1432,
            "bedrooms": 0, "bathrooms": 8, "sqft": 175000,
            "amenities": ["Blast Proof Construction", "Spill Containment System", "Rail Spur", "24/7 Security"],
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"],
            "description": "Specialized industrial storage facility built to highest petrochemical and maritime handling standards.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Manchester Freight City Distribution Depot",
            "price": 25000,
            "listing_type": "rent",
            "property_type": "warehouse",
            "location": "Manchester, United Kingdom",
            "address": "Trafford Park Way, Manchester M17 1AN",
            "lat": 53.4682, "lng": -2.3168,
            "bedrooms": 0, "bathrooms": 5, "sqft": 85000,
            "amenities": ["Motorway Junction M60", "Automated Roller Shutters", "Secure Gated Yard", "LED Lighting"],
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "description": "Modern high-throughput fulfillment center situated in Trafford Park with rapid transit to Liverpool and Leeds.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Dubai South Logistics City Mega Vault",
            "price": 31000000,
            "listing_type": "buy",
            "property_type": "warehouse",
            "location": "Dubai, UAE",
            "address": "Aviation City, Dubai South",
            "lat": 24.8967, "lng": 55.1518,
            "bedrooms": 0, "bathrooms": 14, "sqft": 350000,
            "amenities": ["Free Trade Zone Tax Free", "Al Maktoum Airport Link", "Robotic Sortation Ready", "Full AC"],
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"],
            "description": "Ultra-large scale climate conditioned distribution facility within the bonded Dubai South Free Trade Zone.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Sydney Western Port Logistics Hub",
            "price": 35000,
            "listing_type": "rent",
            "property_type": "warehouse",
            "location": "Sydney, Australia",
            "address": "44 Wonderland Dr, Eastern Creek NSW 2766",
            "lat": -33.8055, "lng": 150.8490,
            "bedrooms": 0, "bathrooms": 6, "sqft": 105000,
            "amenities": ["B-Double Truck Access", "Solar Array Installed", "13.7m Ridge Height", "ESFR Sprinklers"],
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "description": "Premier industrial precinct in Sydney's outer west with direct access to M4 and M7 arterial corridors.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Tokyo Bay Odaiba Automated Logistics Center",
            "price": 28500000,
            "listing_type": "buy",
            "property_type": "warehouse",
            "location": "Tokyo, Japan",
            "address": "Aomi 2-Chome, Koto City, Tokyo 135-0064",
            "lat": 35.6186, "lng": 139.7788,
            "bedrooms": 0, "bathrooms": 10, "sqft": 190000,
            "amenities": ["Seismic Base Isolation", "High-Speed Freight Lifts", "AS/RS Automated Storage", "Port Access"],
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"],
            "description": "Multi-story urban distribution masterpiece on Tokyo Bay equipped with earthquake isolation dampeners.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Memphis FedEx Hub Intermodal Warehouse",
            "price": 23000,
            "listing_type": "rent",
            "property_type": "warehouse",
            "location": "Memphis, Tennessee",
            "address": "3300 Democrat Rd, Memphis, TN 38118",
            "lat": 35.0645, "lng": -89.9711,
            "bedrooms": 0, "bathrooms": 4, "sqft": 88000,
            "amenities": ["Overnight Parcel Sortation Access", "32ft Clear", "Cross-Dock Configuration", "24/7 Security"],
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "description": "Strategic asset directly adjacent to world's largest air cargo hub, ideal for medical or high-value overnight distribution.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Seattle Kent Valley High-Cube Distribution",
            "price": 14200000,
            "listing_type": "buy",
            "property_type": "warehouse",
            "location": "Kent, Washington",
            "address": "20420 72nd Ave S, Kent, WA 98032",
            "lat": 47.4170, "lng": -122.2452,
            "bedrooms": 0, "bathrooms": 6, "sqft": 130000,
            "amenities": ["Port of Seattle & Tacoma Access", "ESFR Sprinklers", "26 Docks", "Heavy Floor Load"],
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"],
            "description": "Prime industrial corridor property serving the Pacific Northwest with robust logistics infrastructure.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Miami Airport Foreign Trade Zone Warehouse",
            "price": 29000,
            "listing_type": "rent",
            "property_type": "warehouse",
            "location": "Doral, Florida",
            "address": "2500 NW 107th Ave, Doral, FL 33172",
            "lat": 25.7989, "lng": -80.3708,
            "bedrooms": 0, "bathrooms": 5, "sqft": 94000,
            "amenities": ["FTZ #281 Active Zone", "MIA Airport 5 Min", "Air Conditioned Office Block", "Secured Gated Entry"],
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "description": "Leading gateway warehouse for Latin American and Caribbean import/export operations with foreign trade zone benefits.",
            "seller_name": "Julian Thorne", "seller_agency": "Apex Prime Commercial", "seller_phone": "+1 (555) 443-8890", "seller_email": "julian@apexcommercial.com", "seller_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", "featured": 0
        },

        # --- 16 FARMHOUSES & VINEYARD ESTATES ---
        {
            "title": "Napa Valley Glass Modernist Vineyard Estate",
            "price": 11500000,
            "listing_type": "buy",
            "property_type": "farmhouse",
            "location": "St. Helena, California",
            "address": "1280 Spring Mountain Rd, St Helena, CA 94574",
            "lat": 38.5085, "lng": -122.4820,
            "bedrooms": 5, "bathrooms": 6, "sqft": 7800,
            "amenities": ["Active Vineyard (18 Acres)", "Swimming Pool", "Clean Glass Facade", "Wine Cave Cellar", "Olive Grove", "Guest Casita"],
            "image_url": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
            "description": "Striking combination of reclaimed timber and floor-to-ceiling clean glass pavilions looking out over rows of Cabernet Sauvignon vines.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Tuscan Hills Podere Glass & Stone Manor",
            "price": 14000,
            "listing_type": "rent",
            "property_type": "farmhouse",
            "location": "Siena, Italy",
            "address": "Localita San Miniato 14, 53040 Pienza",
            "lat": 43.0768, "lng": 11.6787,
            "bedrooms": 6, "bathrooms": 6, "sqft": 6400,
            "amenities": ["Swimming Pool", "Clean Glass Facade", "Organic Olive Press", "Wood Fire Oven", "Equestrian Stables"],
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"],
            "description": "Centuries-old limestone estate expanded with contemporary panoramic glass salon framing the cypress-lined hills of Val d'Orcia.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 1
        },
        {
            "title": "Sonoma Alexander Valley Modern Ranch",
            "price": 7900000,
            "listing_type": "buy",
            "property_type": "farmhouse",
            "location": "Healdsburg, California",
            "address": "4100 Dry Creek Rd, Healdsburg, CA 95448",
            "lat": 38.6385, "lng": -122.9238,
            "bedrooms": 4, "bathrooms": 5, "sqft": 5800,
            "amenities": ["Swimming Pool", "Clean Glass Facade", "Solar Farm", "Organic Vegetable Farm", "Bocce Court"],
            "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"],
            "description": "Sustainable luxury living in California wine country with open-plan glass living spaces seamlessly connecting to heritage oak groves.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Provence Lavender Fields Glass Mas",
            "price": 12000,
            "listing_type": "rent",
            "property_type": "farmhouse",
            "location": "Gordes, France",
            "address": "Route de Cavaillon, 84220 Gordes",
            "lat": 43.9126, "lng": 5.2003,
            "bedrooms": 5, "bathrooms": 5, "sqft": 5100,
            "amenities": ["Swimming Pool", "Clean Glass Facade", "Lavender Fields", "Pergola Dining", "Stone Wine Vault"],
            "image_url": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"],
            "description": "Secluded French country home boasting large floor-to-ceiling steel-framed glass windows framing fragrant purple lavender fields.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Texas Hill Country Cypress River Ranch",
            "price": 5400000,
            "listing_type": "buy",
            "property_type": "farmhouse",
            "location": "Fredericksburg, Texas",
            "address": "1200 Ranch Rd 1623, Blanco, TX 78606",
            "lat": 30.0988, "lng": -98.4214,
            "bedrooms": 5, "bathrooms": 5, "sqft": 6200,
            "amenities": ["River Frontage", "Swimming Pool", "Clean Glass Facade", "Barn & Stables", "Fire Pits"],
            "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"],
            "description": "Ranch lifestyle with modern sophistication. Native Texas limestone, cantilevered glass wings, and deep riverfront swimming holes.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Hudson Valley Apple Orchard Glass Manor",
            "price": 9500,
            "listing_type": "rent",
            "property_type": "farmhouse",
            "location": "Rhinebeck, New York",
            "address": "45 Mill Road, Rhinebeck, NY 12572",
            "lat": 41.9268, "lng": -73.9126,
            "bedrooms": 4, "bathrooms": 4, "sqft": 4600,
            "amenities": ["Cider Press Barn", "Heated Pool", "Clean Glass Facade", "Wood Burning Stove", "Geothermal Heating"],
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
            "description": "Tranquil country escape 2 hours from NYC, wrapped in glass walls that showcase blossoming apple orchards and dramatic autumn foliage.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Mendoza Andes Foothills Vineyard Estate",
            "price": 4200000,
            "listing_type": "buy",
            "property_type": "farmhouse",
            "location": "Mendoza, Argentina",
            "address": "Ruta Provincial 92, Uco Valley 5560",
            "lat": -33.6186, "lng": -69.1558,
            "bedrooms": 5, "bathrooms": 6, "sqft": 7100,
            "amenities": ["Malbec Vineyard", "Snow Peak View", "Swimming Pool", "Clean Glass Facade", "Private Bodega"],
            "image_url": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
            "description": "Modern winery estate in the iconic Uco Valley with floor-to-ceiling thermal glass facing the snow-capped Andes mountains.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Cotswolds Glass Barn Conversion",
            "price": 8500,
            "listing_type": "rent",
            "property_type": "farmhouse",
            "location": "Chipping Norton, United Kingdom",
            "address": "Church Lane, Kingham, Chipping Norton OX7 6YA",
            "lat": 51.9070, "lng": -1.6190,
            "bedrooms": 4, "bathrooms": 4, "sqft": 4200,
            "amenities": ["Clean Glass Facade", "Heritage Honey Stone", "Wood Burner", "Tennis Court", "Wildflower Meadow"],
            "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"],
            "description": "Architect-designed transformation of an 18th-century threshing barn with double-height glass gables and underfloor heating.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Margaret River Coastal Vineyard Estate",
            "price": 6800000,
            "listing_type": "buy",
            "property_type": "farmhouse",
            "location": "Margaret River, Australia",
            "address": "250 Caves Road, Yallingup WA 6282",
            "lat": -33.6445, "lng": 115.0270,
            "bedrooms": 5, "bathrooms": 5, "sqft": 6900,
            "amenities": ["Chardonnay Vines", "Ocean Breeze Vistas", "Swimming Pool", "Clean Glass Facade", "Tasting Room"],
            "image_url": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
            "description": "World-class terroir meets award-winning residential architecture with glazed entertaining pavilions and natural spring dams.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Bordeaux Saint-Émilion Chateaux & Glass Atrium",
            "price": 16000,
            "listing_type": "rent",
            "property_type": "farmhouse",
            "location": "Bordeaux, France",
            "address": "Route de Pomerol, 33330 Saint-Émilion",
            "lat": 44.8943, "lng": -0.1558,
            "bedrooms": 6, "bathrooms": 6, "sqft": 7500,
            "amenities": ["Grand Cru Terroir", "Swimming Pool", "Clean Glass Facade", "Underground Barrel Cellar", "Helipad"],
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"],
            "description": "Historic estate infused with modern glass pavilions, allowing guests to dine under the stars with direct view of century-old vineyards.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Willamette Valley Pinot Noir Glass Estate",
            "price": 5100000,
            "listing_type": "buy",
            "property_type": "farmhouse",
            "location": "Dundee, Oregon",
            "address": "9400 Worden Hill Rd, Dundee, OR 97115",
            "lat": 45.2789, "lng": -123.0134,
            "bedrooms": 4, "bathrooms": 4, "sqft": 5200,
            "amenities": ["Dundee Hills Views", "Swimming Pool", "Clean Glass Facade", "Tasting Cellar", "Solar Powered"],
            "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"],
            "description": "Perched above foggy morning valleys, this Oregon estate combines sustainably harvested timber with massive low-iron glass walls.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Vermont Green Mountain Glass Maple Farm",
            "price": 7500,
            "listing_type": "rent",
            "property_type": "farmhouse",
            "location": "Stowe, Vermont",
            "address": "410 Mountain Rd, Stowe, VT 05672",
            "lat": 44.4654, "lng": -72.6874,
            "bedrooms": 4, "bathrooms": 4, "sqft": 4800,
            "amenities": ["Sugarbush Grove", "Clean Glass Facade", "Outdoor Cedar Hot Tub", "Heated Radiant Floors"],
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
            "description": "Cozy alpine luxury meeting transparent modern architecture with floor-to-ceiling glass viewing Mt. Mansfield.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Santa Ynez Valley Equestrian Glass Ranch",
            "price": 8900000,
            "listing_type": "buy",
            "property_type": "farmhouse",
            "location": "Santa Ynez, California",
            "address": "3200 Roblar Ave, Santa Ynez, CA 93460",
            "lat": 34.6105, "lng": -120.0846,
            "bedrooms": 5, "bathrooms": 6, "sqft": 7300,
            "amenities": ["12-Stall Barn", "Riding Arena", "Swimming Pool", "Clean Glass Facade", "Pecan Orchard"],
            "image_url": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
            "description": "Pristine California equestrian ranch with modern architectural glass residence overlooking rolling golden pastures.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Stellenbosch Cape Dutch Glass Manor",
            "price": 10500,
            "listing_type": "rent",
            "property_type": "farmhouse",
            "location": "Stellenbosch, South Africa",
            "address": "R44 Winery Way, Stellenbosch 7600",
            "lat": -33.9321, "lng": 18.8602,
            "bedrooms": 5, "bathrooms": 5, "sqft": 6000,
            "amenities": ["Simonsberg Mountain View", "Swimming Pool", "Clean Glass Facade", "Chenin Blanc Vines", "Wine Cellar"],
            "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"],
            "description": "Historic Cape Dutch homestead renovated with frameless glass extensions framing dramatic mountain amphitheaters.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Charlottesville Blue Ridge Glass Estate",
            "price": 4600000,
            "listing_type": "buy",
            "property_type": "farmhouse",
            "location": "Charlottesville, Virginia",
            "address": "2500 Garth Rd, Charlottesville, VA 22901",
            "lat": 38.0792, "lng": -78.5492,
            "bedrooms": 5, "bathrooms": 5, "sqft": 6100,
            "amenities": ["Blue Ridge Mountains View", "Swimming Pool", "Clean Glass Facade", "Organic Gardens", "Wine Room"],
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
            "description": "Refined Virginia country estate boasting contemporary floor-to-ceiling glass pavilions that celebrate the changing seasons.",
            "seller_name": "Marcus Vance", "seller_agency": "Vance Elite Realty", "seller_phone": "+1 (555) 789-4321", "seller_email": "marcus.seller@vanceholdings.com", "seller_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", "featured": 0
        },
        {
            "title": "Queenstown Alpine Lakefront Farmhouse",
            "price": 13500,
            "listing_type": "rent",
            "property_type": "farmhouse",
            "location": "Queenstown, New Zealand",
            "address": "Speargrass Flat Rd, Dalefield 9371",
            "lat": -44.9789, "lng": 168.7450,
            "bedrooms": 4, "bathrooms": 4, "sqft": 5300,
            "amenities": ["Remarkables Mountain View", "Clean Glass Facade", "Outdoor Hot Tub", "Heated Ski Locker", "Fireplace"],
            "image_url": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=85",
            "gallery": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
            "description": "New Zealand architectural marvel with floor-to-ceiling double-glazed argon windows looking upon snow-dusted Remarkables.",
            "seller_name": "Elena Rostova", "seller_agency": "Azure International", "seller_phone": "+1 (555) 908-1122", "seller_email": "elena@azureestates.com", "seller_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", "featured": 0
        }
    ]

    # Convert dictionaries to SQLite rows
    rows = []
    for prop in properties_raw:
        rows.append((
            prop["title"],
            prop["price"],
            prop["listing_type"],
            prop["property_type"],
            prop["location"],
            prop["address"],
            prop["lat"],
            prop["lng"],
            prop["bedrooms"],
            prop["bathrooms"],
            prop["sqft"],
            json.dumps(prop["amenities"]),
            prop["image_url"],
            json.dumps(prop.get("gallery", [prop["image_url"]])),
            prop["description"],
            "available", # initially available
            None, # buyer_id
            None, # buyer_name
            1, # seller_id
            prop["seller_name"],
            prop["seller_agency"],
            prop["seller_phone"],
            prop["seller_email"],
            prop["seller_avatar"],
            4.9,
            1,
            prop.get("featured", 0)
        ))
    
    cursor.executemany("""
    INSERT INTO properties (
        title, price, listing_type, property_type, location, address, lat, lng,
        bedrooms, bathrooms, sqft, amenities, image_url, gallery, description,
        status, buyer_id, buyer_name, seller_id, seller_name, seller_agency,
        seller_phone, seller_email, seller_avatar, seller_rating, seller_verified, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows)
    conn.commit()
    print(f"Successfully seeded {len(rows)} properties into propfind.db")

if __name__ == "__main__":
    init_db()
