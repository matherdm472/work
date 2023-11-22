from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///puzzle_db.db'
db = SQLAlchemy(app)

@app.before_request
def before_request():
    # Check if the request URL doesn't start with 'www.'
    if request.url.startswith('http://thetweedle.com'):
        # Redirect to the same path but with 'www.'
        return redirect(request.url.replace('http://', 'http://www.', 1), code=301)

@app.route('/')
def index():
    return render_template('index.html')

# Route to serve robots.txt
@app.route('/robots.txt')
def serve_robots():
    return send_from_directory('/Users/dylanmather/Desktop/work/', 'robots.txt')

class Puzzle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

class PuzzleAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    puzzle_id = db.Column(db.Integer, db.ForeignKey('puzzle.id'), nullable=False)
    one_attempt = db.Column(db.Integer, default=0)
    two_attempts = db.Column(db.Integer, default=0)
    three_attempts = db.Column(db.Integer, default=0)
    four_attempts = db.Column(db.Integer, default=0)
    five_attempts = db.Column(db.Integer, default=0)
    wrong_attempts = db.Column(db.Integer, default=0)

@app.route('/update_analytics/<puzzle_name>/<result>', methods=['POST'])
def update_analytics(puzzle_name, result):
    puzzle = Puzzle.query.filter_by(name=puzzle_name).first()

    if not puzzle:
        puzzle = Puzzle(name=puzzle_name)
        db.session.add(puzzle)
        db.session.commit()

    puzzle_attempt = PuzzleAttempt.query.filter_by(puzzle_id=puzzle.id).first()

    if not puzzle_attempt:
        print(f'No PuzzleAttempt found for Puzzle ID {puzzle.id}')
        puzzle_attempt = PuzzleAttempt(puzzle_id=puzzle.id)
        db.session.add(puzzle_attempt)
        db.session.commit()  # Commit the new PuzzleAttempt to the database
    else:
        print(f'Found PuzzleAttempt: {puzzle_attempt}')

    if result == 'one':
        puzzle_attempt.one_attempt += 1
    elif result == 'two':
        puzzle_attempt.two_attempts += 1
    elif result == 'three':
        puzzle_attempt.three_attempts += 1
    elif result == 'four':
        puzzle_attempt.four_attempts += 1
    elif result == 'five':
        puzzle_attempt.five_attempts += 1
    elif result == 'wrong':
        puzzle_attempt.wrong_attempts += 1

    print(f'Result: {result}')
    print(f'Updated counts: {puzzle_attempt.one_attempt}, {puzzle_attempt.two_attempts}, ...')

    db.session.add(puzzle_attempt)
    db.session.commit()

    # Return a JSON response with puzzle attempt details
    return jsonify({
        'puzzle_name': puzzle.name,
        'attempts': {
            'one': puzzle_attempt.one_attempt,
            'two': puzzle_attempt.two_attempts,
            'three': puzzle_attempt.three_attempts,
            'four': puzzle_attempt.four_attempts,
            'five': puzzle_attempt.five_attempts,
            'wrong': puzzle_attempt.wrong_attempts
        }
    })

@app.route('/get_analytics/<puzzle_name>', methods=['GET'])
def get_analytics(puzzle_name):
    puzzle = Puzzle.query.filter_by(name=puzzle_name).first()

    if not puzzle:
        return

    puzzle_attempt = PuzzleAttempt.query.filter_by(puzzle_id=puzzle.id).first()

    if not puzzle_attempt:
        print(f'No PuzzleAttempt found for Puzzle ID {puzzle.id}')
        return
    else:
        print(f'Found PuzzleAttempt: {puzzle_attempt}')

    print(f'Updated counts: {puzzle_attempt.one_attempt}, {puzzle_attempt.two_attempts}, ...')

    # Return a JSON response with puzzle attempt details
    return jsonify({
        'puzzle_name': puzzle.name,
        'attempts': {
            'one': puzzle_attempt.one_attempt,
            'two': puzzle_attempt.two_attempts,
            'three': puzzle_attempt.three_attempts,
            'four': puzzle_attempt.four_attempts,
            'five': puzzle_attempt.five_attempts,
            'wrong': puzzle_attempt.wrong_attempts
        }
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)
