from flask import Blueprint, jsonify, request
from models import db, Booth

booths_bp = Blueprint("booths_bp", __name__)

# ================= GET AVAILABLE BOOTHS =================
@booths_bp.route("/", methods=["GET"])
def get_booths():
    booths = Booth.query.filter_by(status="available").all()
    return jsonify([{
        "booth_number": b.booth_number,
        "size": b.size,
        "price": b.price,
        "location": b.location,
        "status": b.status
    } for b in booths])

# ================= GET SINGLE BOOTH =================
@booths_bp.route("/<string:booth_number>", methods=["GET"])
def get_booth(booth_number):
    booth = Booth.query.filter_by(booth_number=booth_number).first_or_404()
    return jsonify({
        "booth_number": booth.booth_number,
        "size": booth.size,
        "price": booth.price,
        "location": booth.location,
        "status": booth.status
    })

# ================= CREATE BOOTH =================
@booths_bp.route("/", methods=["POST"])
def create_booth():
    data = request.json

    if Booth.query.filter_by(booth_number=data["booth_number"]).first():
        return jsonify({"error": "Booth number already exists"}), 400

    booth = Booth(
        booth_number=data["booth_number"],
        size=data["size"],
        price=data["price"],
        location=data["location"],
        status=data.get("status", "available").lower()
    )

    db.session.add(booth)
    db.session.commit()
    return jsonify({"message": "Booth created successfully"})

# ================= UPDATE BOOTH =================
@booths_bp.route("/<string:booth_number>", methods=["PUT"])
def update_booth(booth_number):
    booth = Booth.query.filter_by(booth_number=booth_number).first_or_404()
    data = request.json

    booth.size = data.get("size", booth.size)
    booth.price = data.get("price", booth.price)
    booth.location = data.get("location", booth.location)

    if "status" in data:
        booth.status = data["status"].lower()

    db.session.commit()
    return jsonify({"message": "Booth updated successfully"})

# ================= DELETE BOOTH =================
@booths_bp.route("/<string:booth_number>", methods=["DELETE"])
def delete_booth(booth_number):
    booth = Booth.query.filter_by(booth_number=booth_number).first_or_404()
    db.session.delete(booth)
    db.session.commit()
    return jsonify({"message": "Booth deleted successfully"})
