# PropFind — Premier Architectural Property Discovery Platform

**PropFind** is an ultra-luxury property discovery and acquisition platform designed for buyers and renters to discover architectural homes across 80 prime worldwide destinations.

Built with **React**, **Tailwind CSS**, **Node.js**, **Python (Flask)**, and **SQLite**, with styling inspired by the **White • Ivory • Iris** color palette and golden ratio grid alignment.

---

## 🌟 Key Highlights & Capabilities

1. **Bespoke PropFind Logo & Design System**:
   - Palette: Pure White, Warm Ivory (`#FAFAF5`), and Deep Royal Iris (`#4F46E5` / `#6366F1` / `#3730A3`).
   - Floaty micro-animations, glassmorphism backdrops, and golden ratio card proportions.
   - Interactive mouse follower with Iris precision cursor and ambient glow physics.

2. **Hero Section**:
   - **Visual Balance**: Left side showcases a heated infinity swimming pool with sea ocean views; right side showcases a crystal clean glassy apartment tower.
   - **3-Line Floaty Animated Headline**: Clicking anywhere on the 3-line headline triggers a smooth floaty spring transition with dynamic architectural taglines.
   - **Quick Discovery Bar**: Search by location, category, budget tier, and buy/rent availability.

3. **Strict Section Hierarchy**:
   - **Navbar**: Brand Logo, Buy/Rent toggle, compare count, saved favorites, role portal dropdown.
   - **Hero Section**: Floaty headline, visual hero canvas, quick search bar.
   - **About Section**: Placed directly below the Hero section.
   - **Contact Section**: Placed directly below the About section with consultation and mailing dispatch.
   - **Filter & Discovery Hub**: 80 properties categorized across Residential, Commercial, Warehouse, Farmhouse, Beach House.
   - **Paginated Grid with 3-Dots Selector**: Multi-page navigation with `...` quick jump dots.
   - **Geospatial Map Explorer ("Find Location")**: Interactive map with 80 custom plotted price markers and seller cards.
   - **Executive Contact Strip**: Fixed at the very bottom with Owner Phone (`+1 (800) 776-7346`), Email (`owner.desk@propfind.luxury`), Address (`742 Iris Blvd, Suite 1200, SF, CA`), and PropFind Logo.

4. **Real-Time Availability Locking**:
   - When a property is acquired (Buy or Rent), the SQLite database immediately updates its status to `SOLD` or `RENTED`.
   - The listing is locked instantly—no other client can purchase or lease it. Duplicate attempts return a 400 rejection.
   - Confetti celebration on successful acquisition.

5. **Direct Seller Credentials & Simulated Mailing Dispatch**:
   - The Enquiry modal displays the seller's verified credentials (avatar, full name, agency, direct telephone, email) *first*.
   - Clients enter their details (Name, Email, Phone, Tour Date, Message).
   - Upon clicking "Send Enquiry", the message is saved to the SQLite database and an official TLS 1.3 email dispatch receipt is generated.

6. **Separate Portals for Buyer and Seller**:
   - **Buyer Portal**: Track saved favorites, review sent inquiries, inspect acquired deeds.
   - **Seller Portal**: Manage listed properties, review incoming leads with client contact numbers and emails, reset availability status, and list new properties.

---

## 🚀 Running the Project

### 1. Python Backend (Flask + SQLite)
```bash
cd backend
python -m pip install flask flask-cors
python database.py   # Seeds 80 properties into propfind.db
python app.py        # Starts REST API on http://127.0.0.1:5000
```

### 2. Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server on http://localhost:5173
```

---

## 🏛️ 80 Pre-Seeded Properties
- **16 Beach Houses**: Malibu, Miami Beach, Carmel, Key Biscayne, Laguna Beach, Maui, Cabo, Hamptons, Santorini, Gold Coast, Newport Beach, Phuket, Cape Town, Ibiza, Amalfi, Kauai.
- **16 Residential Condos & Penthouses**: San Francisco, Tribeca NYC, Bel Air, Mayfair London, Austin, Seattle, Chicago, Tokyo, Paris, Vancouver, Sydney, Boston, Scottsdale, Denver, Aspen, Toronto.
- **16 Commercial Hubs**: Silicon Valley, Hudson Yards, The Shard London, Singapore Marina Bay, Frankfurt, Dubai DIFC, Zurich, Austin Downtown, Hong Kong Central, Berlin Potsdamer, Tokyo Marunouchi, Seoul Gangnam, Seattle SLU, Amsterdam Zuidas, Brickell Miami, Denver LoDo.
- **16 Warehouses & Logistics Hubs**: Inland Empire, Dallas, Chicago Joliet, Rotterdam Port, Atlanta Aerotropolis, Phoenix Sky Harbor, New Jersey Turnpike, Hamburg, Houston Port, Manchester, Dubai South, Sydney Western, Tokyo Bay, Memphis FedEx, Seattle Kent, Miami FTZ.
- **16 Farmhouses & Vineyards**: Napa Valley, Tuscan Hills, Sonoma Alexander Valley, Provence Lavender, Texas Hill Country, Hudson Valley, Mendoza Andes, Cotswolds, Margaret River, Bordeaux Saint-Émilion, Willamette Valley, Vermont, Santa Ynez, Stellenbosch, Charlottesville, Queenstown.
