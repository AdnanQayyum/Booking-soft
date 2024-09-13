from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    capacity_adults = db.Column(db.Integer, nullable=False)
    capacity_children = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'price': self.price,
            'capacity': {
                'adults': self.capacity_adults,
                'children': self.capacity_children
            }
        }
