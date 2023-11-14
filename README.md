# Agora Gaming Club MVP

## Running Locally

This should be enough to get started for dev/testing

```
# pull repo
git clone <repo_url>
cd agora_mvp

# install and activate virtualenv
python3 -m pip virtualenv .venv
source .venv/bin/activate

# install dependancies
pip install -r requirements.txt

# Setup and Run server
cp kernel/local_settings.py.example kernel/local_settings.py
./manage.py makemigrations
./manage.py migrate
./manage.py runserver
```

## Todo

<!-- - Integrate Inertia -->
- Be able to accept challenges
- Be able to complete challenges
<!-- - Editable profile -->
- Expanded profile fields (firstname/lastname/location etc)
- password change page
- better login/logout