from flask import Blueprint, request, jsonify
from models import db, Booth, Vendor, Application

applications_bp = Blueprint("applications_bp", __name__)

# ================= GET ALL APPLICATIONS =================
@applications_bp.route("/", methods=["GET"])
def get_applications():
    apps = Application.query.all()
    result = []
    for a in apps:
        vendor = Vendor.query.filter_by(phone=a.vendor_phone).first()
        booth = Booth.query.filter_by(booth_number=a.booth_number).first()
        result.append({
            "booth_number": a.booth_number,
            "vendor_phone": a.vendor_phone,
            "vendor_name": vendor.full_name if vendor else "N/A",
            "business_name": vendor.business_name if vendor else "N/A",
            "phone": vendor.phone if vendor else "N/A",
            "location": booth.location if booth else "N/A",
            "status": a.status,
            "payment_amount": a.payment_amount,
            "payment_mode": a.payment_mode,
            "payment_reference": a.payment_reference,
            "mobile_network": a.mobile_network
        })
    return jsonify(result)

# ================= SUBMIT APPLICATION =================
@applications_bp.route("/", methods=["POST"])
def submit_application():
    data = request.json

    # Check booth availability
    booth = Booth.query.filter_by(booth_number=data["booth_number"]).first()
    if not booth or booth.status.lower() != "available":
        return jsonify({"error": "Booth not available"}), 400

    # Check for duplicate vendor
    if Vendor.query.filter(
        (Vendor.phone==data["phone"]) |
        (Vendor.email==data["email"]) |
        (Vendor.nrc==data["nrc"])
    ).first():
        return jsonify({"error":"Duplicate vendor detected"}), 400

    # Create vendor
    vendor = Vendor(
        full_name=data["vendor_name"],
        business_name=data["business_name"],
        phone=data["phone"],
        email=data["email"],
        nrc=data["nrc"]
    )
    db.session.add(vendor)
    db.session.commit()

    # Create application
    booth.status = "pending"
    app_obj = Application(
        booth_number=booth.booth_number,
        vendor_phone=vendor.phone,
        payment_mode=data["payment_mode"],
        payment_reference=data.get("payment_reference", "N/A"),
        mobile_network=data.get("mobile_network", "N/A"),
        payment_amount=data["payment_amount"]
    )

    db.session.add(app_obj)
    db.session.commit()

    return jsonify({"message": "Application submitted successfully"})

# ================= APPROVE APPLICATION =================
@applications_bp.route("/<string:booth_number>/approve", methods=["POST"])
def approve_application(booth_number):
    app_obj = Application.query.filter_by(booth_number=booth_number).first_or_404()
    app_obj.status = "Approved"

    booth = Booth.query.filter_by(booth_number=booth_number).first()
    if booth:
        booth.status = "Occupied"

    db.session.commit()
    return jsonify({"message": "Application approved"})

# ================= REJECT APPLICATION =================
@applications_bp.route("/<string:booth_number>/reject", methods=["POST"])
def reject_application(booth_number):
    app_obj = Application.query.filter_by(booth_number=booth_number).first_or_404()
    app_obj.status = "Rejected"

    booth = Booth.query.filter_by(booth_number=booth_number).first()
    if booth:
        booth.status = "Available"

    db.session.commit()
    return jsonify({"message": "Application rejected"})

# ================= DELETE APPLICATION =================
@applications_bp.route("/<string:booth_number>", methods=["DELETE"])
def delete_application(booth_number):
    app_obj = Application.query.filter_by(booth_number=booth_number).first_or_404()

    booth = Booth.query.filter_by(booth_number=booth_number).first()
    if booth:
        booth.status = "Available"

    db.session.delete(app_obj)
    db.session.commit()
    return jsonify({"message": "Application deleted successfully"})
