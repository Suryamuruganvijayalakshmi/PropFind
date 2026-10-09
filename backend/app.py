import json
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection, init_db

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ensure database is initialized
init_db()

def dict_from_row(row):
    d = dict(row)
    if "amenities" in d and isinstance(d["amenities"], str):
        try:
            d["amenities"] = json.loads(d["amenities"])
        except Exception:
            d["amenities"] = []
    if "gallery" in d and isinstance(d["gallery"], str):
        try:
            d["gallery"] = json.loads(d["gallery"])
        except Exception:
            d["gallery"] = [d.get("image_url", "")]
    return d

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "PropFind Python API", "db": "SQLite"})

@app.route("/api/stats", methods=["GET"])
def get_stats():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM properties")
    total = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM properties WHERE status = 'available'")
    available = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM properties WHERE status IN ('sold', 'rented')")
    sold = c.fetchone()[0]
    
    c.execute("SELECT COUNT(DISTINCT location) FROM properties")
    locations = c.fetchone()[0]
    
    conn.close()
    return jsonify({
        "total_properties": total,
        "available_properties": available,
        "sold_or_rented": sold,
        "unique_locations": locations,
        "verified_sellers": 12
    })

@app.route("/api/properties", methods=["GET"])
def get_properties():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Query parameters
    search = request.args.get("search", "").strip()
    listing_type = request.args.get("listing_type", "").strip() # 'buy' or 'rent'
    property_type = request.args.get("property_type", "").strip() # 'residential', 'commercial', etc.
    location = request.args.get("location", "").strip()
    status = request.args.get("status", "").strip()
    amenity = request.args.get("amenity", "").strip()
    seller_email = request.args.get("seller_email", "").strip()
    min_price = request.args.get("min_price", type=int)
    max_price = request.args.get("max_price", type=int)
    featured = request.args.get("featured", type=int)

    query = "SELECT * FROM properties WHERE 1=1"
    params = []

    if search:
        query += " AND (title LIKE ? OR location LIKE ? OR address LIKE ? OR description LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    if listing_type and listing_type.lower() != "all":
        query += " AND listing_type = ?"
        params.append(listing_type.lower())

    if property_type and property_type.lower() != "all":
        query += " AND property_type = ?"
        params.append(property_type.lower())

    if location and location.lower() != "all":
        query += " AND location LIKE ?"
        params.append(f"%{location}%")

    if status and status.lower() != "all":
        query += " AND status = ?"
        params.append(status.lower())

    if min_price is not None:
        query += " AND price >= ?"
        params.append(min_price)

    if max_price is not None:
        query += " AND price <= ?"
        params.append(max_price)

    if featured is not None:
        query += " AND featured = ?"
        params.append(featured)

    if seller_email:
        query += " AND seller_email = ?"
        params.append(seller_email)

    query += " ORDER BY featured DESC, id ASC"

    c.execute(query, params)
    rows = c.fetchall()
    properties = [dict_from_row(r) for r in rows]

    if amenity and amenity.lower() != "all":
        properties = [p for p in properties if any(amenity.lower() in a.lower() for a in p.get("amenities", []))]

    conn.close()
    return jsonify({
        "count": len(properties),
        "properties": properties
    })

@app.route("/api/properties/<int:prop_id>", methods=["GET"])
def get_property_detail(prop_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM properties WHERE id = ?", (prop_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Property not found"}), 404
    return jsonify(dict_from_row(row))

@app.route("/api/properties/<int:prop_id>/buy", methods=["POST"])
def buy_property(prop_id):
    data = request.json or {}
    buyer_name = data.get("buyer_name", "Anonymous Buyer")
    buyer_id = data.get("buyer_id", 1)

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM properties WHERE id = ?", (prop_id,))
    prop = c.fetchone()

    if not prop:
        conn.close()
        return jsonify({"error": "Property not found"}), 404

    if prop["status"] != "available":
        conn.close()
        current_status = prop["status"].upper()
        return jsonify({
            "error": f"This property is no longer available. It has already been {current_status} by {prop['buyer_name'] or 'another client'}."
        }), 400

    new_status = "sold" if prop["listing_type"] == "buy" else "rented"
    c.execute("""
    UPDATE properties 
    SET status = ?, buyer_id = ?, buyer_name = ?
    WHERE id = ?
    """, (new_status, buyer_id, buyer_name, prop_id))
    conn.commit()

    c.execute("SELECT * FROM properties WHERE id = ?", (prop_id,))
    updated_prop = c.fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Congratulations! You have successfully acquired this property. Status is now {new_status.upper()}.",
        "property": dict_from_row(updated_prop),
        "transaction_code": f"PF-TXN-{prop_id}-992"
    })

@app.route("/api/properties/<int:prop_id>/reset", methods=["POST"])
def reset_property_availability(prop_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
    UPDATE properties 
    SET status = 'available', buyer_id = NULL, buyer_name = NULL
    WHERE id = ?
    """, (prop_id,))
    conn.commit()
    c.execute("SELECT * FROM properties WHERE id = ?", (prop_id,))
    row = c.fetchone()
    conn.close()
    return jsonify({
        "success": True,
        "message": "Property status reset to AVAILABLE.",
        "property": dict_from_row(row)
    })

@app.route("/api/properties", methods=["POST"])
def create_property():
    data = request.json or {}
    required = ["title", "price", "property_type", "location", "address", "lat", "lng", "sqft", "image_url"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    amenities = json.dumps(data.get("amenities", ["Clean Glass Facade", "Smart Home", "24/7 Security"]))
    gallery = json.dumps(data.get("gallery", [data["image_url"]]))

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
    INSERT INTO properties (
        title, price, listing_type, property_type, location, address, lat, lng,
        bedrooms, bathrooms, sqft, amenities, image_url, gallery, description,
        status, seller_id, seller_name, seller_agency, seller_phone, seller_email,
        seller_avatar, seller_rating, seller_verified, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["title"],
        int(data["price"]),
        data.get("listing_type", "buy"),
        data["property_type"],
        data["location"],
        data["address"],
        float(data["lat"]),
        float(data["lng"]),
        int(data.get("bedrooms", 0)),
        int(data.get("bathrooms", 0)),
        int(data["sqft"]),
        amenities,
        data["image_url"],
        gallery,
        data.get("description", "Exquisite modern property presented by PropFind."),
        int(data.get("seller_id", 1)),
        data.get("seller_name", "Elena Rostova"),
        data.get("seller_agency", "Azure International"),
        data.get("seller_phone", "+1 (555) 908-1122"),
        data.get("seller_email", "elena@azureestates.com"),
        data.get("seller_avatar", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"),
        4.9,
        1,
        0
    ))
    conn.commit()
    new_id = c.lastrowid
    c.execute("SELECT * FROM properties WHERE id = ?", (new_id,))
    row = c.fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Property listed successfully!",
        "property": dict_from_row(row)
    }), 201

@app.route("/api/enquiries", methods=["POST"])
def create_enquiry():
    data = request.json or {}
    prop_id = data.get("property_id")
    buyer_name = data.get("buyer_name")
    buyer_email = data.get("buyer_email")
    buyer_phone = data.get("buyer_phone")
    tour_date = data.get("tour_date", "")
    message = data.get("message", "")

    if not prop_id or not buyer_name or not buyer_email or not buyer_phone:
        return jsonify({"error": "Please provide your Name, Email, Phone, and Property ID"}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM properties WHERE id = ?", (prop_id,))
    prop = c.fetchone()

    if not prop:
        conn.close()
        return jsonify({"error": "Property not found"}), 404

    seller_email = prop["seller_email"]
    prop_title = prop["title"]

    c.execute("""
    INSERT INTO enquiries (
        property_id, property_title, seller_email, buyer_name, buyer_email,
        buyer_phone, tour_date, message, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    """, (prop_id, prop_title, seller_email, buyer_name, buyer_email, buyer_phone, tour_date, message))
    conn.commit()
    enquiry_id = c.lastrowid
    conn.close()

    # Simulated email dispatch details
    email_dispatch = {
        "dispatch_id": f"MAIL-PF-{enquiry_id}-DISPATCH",
        "to_seller": {
            "email": seller_email,
            "seller_name": prop["seller_name"],
            "subject": f"[PropFind Lead] High-Intent Enquiry for {prop_title}",
            "summary": f"Prospective client {buyer_name} ({buyer_phone}) submitted an enquiry requesting contact."
        },
        "to_buyer": {
            "email": buyer_email,
            "subject": f"Enquiry Confirmation: {prop_title} | PropFind Concierge",
            "summary": f"Your enquiry has been securely forwarded to {prop['seller_name']} at {prop['seller_agency']}."
        },
        "delivered_via": "PropFind SMTP Gateway (TLS 1.3)",
        "timestamp": "Just now"
    }

    return jsonify({
        "success": True,
        "message": "Your enquiry has been sent to the property seller and a confirmation email has been dispatched!",
        "enquiry_id": enquiry_id,
        "email_dispatch": email_dispatch
    }), 201

@app.route("/api/enquiries", methods=["GET"])
def get_enquiries():
    seller_email = request.args.get("seller_email")
    buyer_email = request.args.get("buyer_email")

    conn = get_db_connection()
    c = conn.cursor()

    if seller_email:
        c.execute("SELECT * FROM enquiries WHERE seller_email = ? ORDER BY id DESC", (seller_email,))
    elif buyer_email:
        c.execute("SELECT * FROM enquiries WHERE buyer_email = ? ORDER BY id DESC", (buyer_email,))
    else:
        c.execute("SELECT * FROM enquiries ORDER BY id DESC LIMIT 50")

    rows = c.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/favorites", methods=["GET"])
def get_user_favorites():
    user_id = request.args.get("user_id", default=1, type=int)
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
    SELECT p.* FROM properties p
    JOIN favorites f ON p.id = f.property_id
    WHERE f.user_id = ?
    ORDER BY f.id DESC
    """, (user_id,))
    rows = c.fetchall()
    conn.close()
    return jsonify([dict_from_row(r) for r in rows])

@app.route("/api/favorites/toggle", methods=["POST"])
def toggle_favorite():
    data = request.json or {}
    user_id = data.get("user_id", 1)
    property_id = data.get("property_id")

    if not property_id:
        return jsonify({"error": "Property ID required"}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id FROM favorites WHERE user_id = ? AND property_id = ?", (user_id, property_id))
    existing = c.fetchone()

    if existing:
        c.execute("DELETE FROM favorites WHERE id = ?", (existing["id"],))
        conn.commit()
        conn.close()
        return jsonify({"favorited": False, "message": "Removed from favorites"})
    else:
        c.execute("INSERT INTO favorites (user_id, property_id) VALUES (?, ?)", (user_id, property_id))
        conn.commit()
        conn.close()
        return jsonify({"favorited": True, "message": "Saved to favorites!"})

@app.route("/api/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id, name, email, role, phone, avatar, agency FROM users")
    rows = c.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    role = data.get("role", "buyer").strip().lower()

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email,))
    user = c.fetchone()

    if not user:
        # Create quick guest user with requested role
        c.execute("""
        INSERT INTO users (name, email, role, phone, avatar) 
        VALUES (?, ?, ?, ?, ?)
        """, (
            data.get("name", "PropFind Client"),
            email if email else f"client_{role}@propfind.luxury",
            role,
            "+1 (555) 300-8800",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
        ))
        conn.commit()
        user_id = c.lastrowid
        c.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = c.fetchone()

    conn.close()
    return jsonify({
        "success": True,
        "user": dict(user)
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
