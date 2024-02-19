Copy repository and paste all files inside your folder

Create a new virtual environment for this project \n
python -m venv env 

activate env using this command \n
.\env\Scripts\activate

install dependencies using requirements.txt
pip install -r .\requirements.txt

run initial migrations using this command \n
python.exe .\manage.py makemigrations \n
python.exe .\manage.py migrate 

run django project using this command \n
python.exe .\manage.py runserver

you can check api endpoints here \n
http://127.0.0.1:8000/api/
