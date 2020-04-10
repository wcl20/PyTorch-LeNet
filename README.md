# PyTorch LeNet
Handwritten digits classification app using PyTorch and Flask.

## Setup
Generate Virtual environment
```bash
python3 -m venv ./venv
```
Enter environment
```bash
source venv/bin/activate
```
Install required libraries
```bash
pip install -r requirements.txt
```
Run program 
```bash
export FLASK_APP=app.py
flask run
```
The webpage should be running on [http://localhost:5000](http://localhost:5000).
Write digits on the canvas and click on "predict". 
