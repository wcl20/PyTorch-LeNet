import base64
import flask
import io
from model import LeNet
from PIL import Image, ImageFilter
import re
import torch
from torchvision import transforms

# Create Flask App
app = flask.Flask(__name__)

# Load prediction model
device = torch.device('cpu')
model = LeNet()
model.load_state_dict(torch.load("model.pt", map_location=device))
model.eval()

@app.route("/")
def index():
    return flask.render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    request = flask.request.get_json()
    # Get image from request
    image = request["image"]
    # Remove metadata prefix
    image = re.sub('^data:image/.+;base64,', '', image)
    # Decode image
    image = base64.b64decode(image)
    # Read image
    image = Image.open(io.BytesIO(image))
    # Preprocess image (Grayscale, Blur, Resize and Normalize)
    image = image.convert("L")
    image = image.filter(ImageFilter.GaussianBlur(radius=5))
    transform = transforms.Compose([
        transforms.Resize(28, interpolation=Image.NEAREST),
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))
    ])
    image = transform(image).unsqueeze(0)
    # Make prediction
    with torch.no_grad():
        output = model.forward(image)
        output = output.squeeze(0).tolist()
    return flask.make_response(flask.jsonify({ "predictions": output }), 200)
