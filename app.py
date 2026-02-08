from flask import Flask
from flask_cors import CORS
from models import db

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Database config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize DB
    db.init_app(app)

    # Import and register blueprints
    from routes.booths import booths_bp
    from routes.applications import applications_bp
    from routes.admin import admin_bp
    from routes_vendor import vendors_bp  # if you still have a vendors_bp

    app.register_blueprint(booths_bp, url_prefix="/api/booths")
    app.register_blueprint(applications_bp, url_prefix="/api/applications")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(vendors_bp, url_prefix="/api/vendors")  # optional

    # Create tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
