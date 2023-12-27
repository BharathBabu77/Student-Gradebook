from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/gradebook'
db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float, nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    student = db.relationship('Student', backref=db.backref('grades', lazy=True))

@app.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([{'id': student.id, 'name': student.name} for student in students])

@app.route('/grades', methods=['GET'])
def get_grades():
    grades = Grade.query.all()
    return jsonify([{'id': grade.id, 'value': grade.value, 'student_id': grade.student_id} for grade in grades])

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    new_student = Student(name=data['name'])
    db.session.add(new_student)
    db.session.commit()
    return jsonify({'id': new_student.id, 'name': new_student.name})

@app.route('/grades', methods=['POST'])
def add_grade():
    data = request.json
    new_grade = Grade(value=data['value'], student_id=data['student_id'])
    db.session.add(new_grade)
    db.session.commit()
    return jsonify({'id': new_grade.id, 'value': new_grade.value, 'student_id': new_grade.student_id})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
