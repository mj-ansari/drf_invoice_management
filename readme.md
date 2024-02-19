Copy repository and paste all files inside your folder

Create a new virtual environment for this project
python -m venv env 

activate env using this command
.\env\Scripts\activate

install dependencies using requirements.txt
pip install -r .\requirements.txt

run initial migrations using this command
python.exe .\manage.py makemigrations
python.exe .\manage.py migrate 

run django project using this command
python.exe .\manage.py runserver

you can check api endpoints here
http://127.0.0.1:8000/api/