from app import create_app
from models import db, Booth, Vendor, Admin
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():

    # ================= CLEAR EXISTING DATA =================
    db.session.query(Booth).delete()
    db.session.query(Vendor).delete()
    db.session.query(Admin).delete()
    db.session.commit()

    # ================= ADD BOOTHS =================
    booths = [
        Booth(
            booth_number="B01",
            size="3x3",
            price=500,
            location="North Wing",
            status="available"
        ),
        Booth(
            booth_number="B02",
            size="4x4",
            price=800,
            location="East Wing",
            status="available"
        ),
        Booth(
            booth_number="B03",
            size="5x5",
            price=1000,
            location="Main Entrance",
            status="available"
        ),
            Booth(
                booth_number="B04",
                size="3x3",
                price=500,
                location="South Wing",
                status="available"
            ),
            Booth(
                booth_number="B05",
                size="4x4",
                price=800,
                location="West Wing",
                status="available"
            )
    ]

    db.session.add_all(booths)

    # ================= ADD SAMPLE VENDOR =================
    vendor = Vendor(
        phone="0971234567",
        full_name="John Banda",
        business_name="Banda Groceries",
        email="john@example.com",
        nrc="123456/10/1"
    )  
    db.session.add(vendor)

    # ================= ADD ADMIN =================
    admin = Admin(
        username="admin",
        password_hash=generate_password_hash("admin123")
    )
    db.session.add(admin)

    # ================= COMMIT =================
    db.session.commit()

    print("Seed data added successfully!")
