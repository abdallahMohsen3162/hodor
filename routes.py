from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from datetime import datetime

# ... other imports ...

@main_routes.route('/attendance', methods=['POST'])
@jwt_required()
@cross_origin(origins="*")
def handle_attendance():
    data = request.get_json()
    print(f"Received attendance data: {data}")
    try:
        action = data.get('action')
        group_id = data.get('group_id')
        week_id = data.get('week_id')
        student_id = data.get('student_id')
        excuse_reason = data.get('excuse_reason')
        date_str = data.get('date')
        ignore_group_mismatch = data.get('ignore_group_mismatch', False)

        print(f"Processing attendance: action={action}, group_id={group_id}, week_id={week_id}, student_id={student_id}, date={date_str}, ignore_group_mismatch={ignore_group_mismatch}")

        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.now().date()

        if action == 'start_recording':
            return _start_recording(group_id, week_id, date_obj)
        elif action == 'mark_attended':
            return _mark_attended(student_id, group_id, week_id, date_obj, ignore_group_mismatch)
        elif action == 'mark_excused':
            return _mark_excused(student_id, group_id, week_id, excuse_reason, date_obj)
        elif action == 'end_recording':
            return _end_recording(group_id, week_id, date_obj)
        else:
            print(f"Invalid action: {action}")
            return jsonify({'error': 'Invalid action.'}), 400

    except Exception as e:
        db.session.rollback()
        error_message = f"Error in handle_attendance: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500

def _mark_attended(student_id, group_id, week_id, date_obj, ignore_group_mismatch=False):
    print(f"Marking attendance: student_id={student_id}, group_id={group_id}, week_id={week_id}, date={date_obj}, ignore_group_mismatch={ignore_group_mismatch}")
    if not student_id or not group_id or not week_id:
        print("Missing required parameters")
        return jsonify({'error': 'Student ID, Group ID, and Week ID are required.'}), 400

    try:
        student = Student.query.get(student_id)
        if not student:
            print(f"Student not found: {student_id}")
            return jsonify({'error': f'Student with ID {student_id} not found.'}), 404

        if str(student.group_id) != str(group_id) and not ignore_group_mismatch:
            print(f"Student {student_id} does not belong to group {group_id}")
            return jsonify({'error': f'Student {student.id} does not belong to group {group_id}.', 'warning': True}), 400

        attendance = Attendance.query.filter_by(
            student_id=student.id,
            week_id=week_id,
            date=date_obj
        ).first()

        if not attendance:
            print(f"Creating new attendance record for student {student_id}")
            attendance = Attendance(
                student_id=student.id,
                week_id=week_id,
                status='attended',
                arrival_time=datetime.now().time(),
                date=date_obj
            )
            db.session.add(attendance)
        elif attendance.status == 'pending':
            print(f"Updating existing attendance record for student {student_id}")
            attendance.status = 'attended'
            attendance.arrival_time = datetime.now().time()
        else:
            print(f"Student {student_id} already has a non-pending record for this date")
            return jsonify({'error': f'Student {student.id} already has a non-pending record for this date.'}), 400

        db.session.commit()
        print(f"Attendance marked successfully for student {student_id}")
        
        try:
            send_message(
                recipient_phones=[parent.phone for parent in student.parents],
                title="Attendance Recorded",
                body=f"{student.name} has been marked as attended at {attendance.arrival_time}."
            )
        except Exception as msg_error:
            print(f"Error sending message: {str(msg_error)}")
            # Continue execution even if message sending fails

        return jsonify({'message': f'Student {student.id} marked as attended.'}), 200

    except Exception as e:
        db.session.rollback()
        error_message = f"Error in _mark_attended: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500

@main_routes.route('/health-check', methods=['GET'])
@cross_origin(origins="*")
def health_check():
    return jsonify({'status': 'OK'}), 200

