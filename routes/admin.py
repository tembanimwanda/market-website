from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from models import db, Admin, Booth, Application

admin_bp = Blueprint("admin_bp", __name__)

# Admin login
@admin_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    admin = Admin.query.filter_by(username=data["username"]).first()
    if not admin or not check_password_hash(admin.password_hash, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful", "role": "admin"})

# Approve application
@admin_bp.route("/applications/<string:booth_number>/approve", methods=["POST"])
def approve_application(booth_number):
    app_obj = Application.query.filter_by(booth_number=booth_number).first_or_404()
    app_obj.status = "approved"
    booth = Booth.query.filter_by(booth_number=booth_number).first()
    booth.status = "allocated"
    db.session.commit()
    return jsonify({"message":"Application approved"})

# Reject application
@admin_bp.route("/applications/<string:booth_number>/reject", methods=["POST"])
def reject_application(booth_number):
    app_obj = Application.query.filter_by(booth_number=booth_number).first_or_404()
    app_obj.status = "rejected"
    booth = Booth.query.filter_by(booth_number=booth_number).first()
    booth.status = "available"
    db.session.commit()
    return jsonify({"message":"Application rejected"})
