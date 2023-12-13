# Agora Gaming MVP

## Running Locally

This should be enough to get started for dev/testing the django portion of the app

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
cp kernel/settings_local.py.example kernel/local_settings.py
./manage.py makemigrations # python manage.py makemigrations
./manage.py migrate # python manage.py migrate
./bin/launch

# install cronjobs into crontab
./manage.py crontab add
./manage.py crontab show # confirm they were added
# If running on WSL, you will have to enable cron `sudo services cron start`
```

## Todo

- Complete the challenge flow
- Create cron jobs for challenges that timed out due to various reasons

<!-- - Integrate Inertia -->
- Be able to accept challenges
- Be able to complete challenges
<!-- - Editable profile -->
