from flask import Flask, render_template, request, redirect, Response

app = Flask(__name__)
# Use SQLite URI for local development and Postgre for Production

# Configure PostgreSQL database
db_url = os.environ.get('DATABASE_URL')
if db_url:
    # Extract the database name from the DATABASE_URL
    db_name = db_url.split("/")[-1]
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
else:
    # If DATABASE_URL is not available, use a default local database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

# Silence the deprecation warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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

@app.route('/robots.txt')
def noindex():
    content = "User-Agent: *\nAllow: /\n"
    response = Response(response=content, status=200, mimetype="text/plain")
    response.headers["Content-Type"] = "text/plain; charset=utf-8"
    return response