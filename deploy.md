### Setup VM & AWS EC2
Follow Steps to Create Ec2 server: https://docs.aws.amazon.com/efs/latest/ug/gs-step-one-create-ec2-resources.html


### Install Nodejs via NVM
1. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash`
2. `export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm\n[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion`
3. `nvm install 18` to add Node18 (LTS)
4. `node -v` to verify node version

#### Create uwsgi parameters:
`sudo vim /home/uwsgi_params` and add

```text
uwsgi_param  QUERY_STRING       $query_string;
uwsgi_param  REQUEST_METHOD     $request_method;
uwsgi_param  CONTENT_TYPE       $content_type;
uwsgi_param  CONTENT_LENGTH     $content_length;
uwsgi_param  REQUEST_URI        $request_uri;
uwsgi_param  PATH_INFO          $document_uri;
uwsgi_param  DOCUMENT_ROOT      $document_root;
uwsgi_param  SERVER_PROTOCOL    $server_protocol;
uwsgi_param  REQUEST_SCHEME     $scheme;
uwsgi_param  HTTPS              $https if_not_empty;
uwsgi_param  REMOTE_ADDR        $remote_addr;
uwsgi_param  REMOTE_PORT        $remote_port;
uwsgi_param  SERVER_PORT        $server_port;
uwsgi_param  SERVER_NAME        $server_name;
```

`sudo mkdir /run/uwsgi/`

`sudo chown ubuntu:ubuntu /run/uwsgi/`


### Setup Python
1. `sudo apt update`
2. `sudo apt upgrade`
3. `sudo add-apt-repository ppa:deadsnakes/ppa -y`
4. `sudo apt install python3.8`
5. `sudo apt install python3.8-dbg`
6. `sudo apt install python3.8-dev`
7. `sudo apt install python3.8-venv`
8. `sudo apt install python3.8-distutils`
9. `sudo apt install python3.8-lib2to3`
10. `sudo apt install python3.8-gdbm`
11. `sudo apt install python3.8-tk`
12. `sudo apt install python3.8-full`
13. `sudo apt-get install python3-pip`
14. `pip install virtualenv`
15. `sudo apt-get install python-virtualenv`
16. `python3 -m pip install virtualenv`
17. `sudo apt-get install python3-mysqldb`

### Install Git Repo
`git clone https://github.com/Agora-Gaming-Club/agora_mvp`

and follow steps in the README

### Setup Supervisor + Gunicorn
1. `pip install gunicorn`
2. `sudo apt-get install supervisor`

`sudo vim /etc/supervisor/conf.d/gunicorn.conf` then paste:

``` 
[program:gunicorn]
directory=/home/ubuntu/agoragaming.gg
command=/home/ubuntu/agoragaming.gg/.venv/bin/gunicorn --workers 3 --bind unix:/home/ubuntu/agoragaming.gg/app.sock kernel.wsgi:application  
autostart=true
autorestart=true
stderr_logfile=/var/log/gunicorn/gunicorn.err.log
stdout_logfile=/var/log/gunicorn/gunicorn.out.log

[group:guni]
programs:gunicorn
```
Then run
```
sudo mkdir /var/log/gunicorn
sudo touch /var/log/gunicorn/gunicorn.err.log
sudo touch /var/log/gunicorn/gunicorn.out.log
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status
```


troubleshoot: /var/log/gunicorn/gunicorn.err.log



Update `/etc/nginx/nginx.conf` and change user `www-data` to `root`


Create a file called `domainname_com.conf` in `/etc/nginx/sites-available` directory and add:
```
server{

	listen 80;
	server_name 3.139.60.203;

	# Static files
    # Ensure this alias points to the directory where your Django static files are collected
    location /static {
            alias /home/ubuntu/agoragaming.gg/static/;
    }
	location / {

		include proxy_params;
		proxy_pass http://unix:/home/ubuntu/agoragaming.gg/app.sock;

	}

}
```

Then activate new nginx config by running
```bash
sudo nginx -t # verify syntax is okay
sudo ln domainname_com.conf /etc/nginx/sites-enabled/ # activate newly create nginx config
sudo service nginx restart # restart service
```

`sudo ufw allow 800`

sudo service supervisor restart
### Certbot SSL
https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/

## Database
Because we use RDS, we only need to install the mysql client
`sudo apt-get install mysql-client`

## Crontab
Run `crontab -e`
Run `python manage.py crontab add`

then add: 
``` 
0 0 1 * * /usr/bin/certbot renew --quiet
```


```

```
