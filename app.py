from flask import Flask, render_template, request, redirect, Response

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

@app.route('/robots.txt')
def noindex():
    content = "User-Agent: *\nDisallow: /\n"
    response = Response(response=content, status=200, mimetype="text/plain")
    response.headers["Content-Type"] = "text/plain; charset=utf-8"
    return response

if __name__ == '__main__':
    app.run(debug=True)
