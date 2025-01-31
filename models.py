from . import db

class StudyWeek(db.Model):
    __tablename__ = 'study_weeks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<StudyWeek {self.name}>'

