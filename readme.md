Copy repository and paste all files inside your folder

Create a new virtual environment for this project <br />
python -m venv env <br /><br />

activate env using this command <br />
.\env\Scripts\activate  <br /><br />

install dependencies using requirements.txt  <br />
pip install -r .\requirements.txt  <br /><br />

run initial migrations using this command <br />
python.exe .\manage.py makemigrations <br />
python.exe .\manage.py migrate <br /><br />

run django project using this command <br />
python.exe .\manage.py runserver  <br /><br />

you can check api endpoints here <br />
http://127.0.0.1:8000/api/

