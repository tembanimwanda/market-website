from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ================= BOOTH =================
class Booth(db.Model):
    __tablename__ = "booth"

    booth_number = db.Column(db.String(50), primary_key=True)
    size = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Available")

    # Relationship
    applications = db.relationship(
        "Application",
        back_populates="booth",
        cascade="all, delete-orphan"
    )


# ================= VENDOR =================
class Vendor(db.Model):
    __tablename__ = "vendor"

    phone = db.Column(db.String(20), primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    business_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    nrc = db.Column(db.String(50), unique=True, nullable=False)

    # Relationship
    applications = db.relationship(
        "Application",
        back_populates="vendor",
        cascade="all, delete-orphan"
    )


# ================= APPLICATION =================
class Application(db.Model):
    __tablename__ = "application"

    id = db.Column(db.Integer, primary_key=True)

    booth_number = db.Column(
        db.String(50),
        db.ForeignKey("booth.booth_number"),
        nullable=False
    )

    vendor_phone = db.Column(
        db.String(20),
        db.ForeignKey("vendor.phone"),
        nullable=False
    )

    payment_mode = db.Column(db.String(50))
    payment_reference = db.Column(db.String(100))
    mobile_network = db.Column(db.String(50))
    payment_amount = db.Column(db.Integer)

    status = db.Column(db.String(20), nullable=False, default="Pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    booth = db.relationship("Booth", back_populates="applications")
    vendor = db.relationship("Vendor", back_populates="applications")


# ================= ADMIN =================
class Admin(db.Model):
    __tablename__ = "admin"

    username = db.Column(db.String(100), primary_key=True)
    password_hash = db.Column(db.String(255), nullable=False)
