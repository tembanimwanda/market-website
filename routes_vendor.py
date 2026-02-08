from flask import Blueprint, jsonify
from models import db, Vendor

# Create a Blueprint for vendor-related routes
vendors_bp = Blueprint("vendors_bp", __name__, url_prefix="/api/vendors")


# ================= GET ALL VENDORS =================
@vendors_bp.route("/", methods=["GET"])
def get_vendors():
    try:
        vendors = Vendor.query.all()
        return jsonify([
            {
                "phone": v.phone,
                "full_name": v.full_name,
                "business_name": v.business_name,
                "email": v.email,
                "nrc": v.nrc
            }
            for v in vendors
        ])
    except Exception as e:
        return jsonify({"error": "Failed to fetch vendors"}), 500
