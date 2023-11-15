from flask import Flask, render_template, request, redirect, url_for, send_from_directory

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
