1. add `nvm` to server
2. add



### Setup VM & AWS EC2
### Setup Python
### Setup Supervisor
1. `pip install gunicorn`
2. `sudo apt-get install supervisor`

`sudo vim /etc/supervisor/conf.d/gunicorn.conf` then paste:

``` 
[program:gunicorn]
directory=/home/ubuntu/dev.agoragaming.gg
command=/home/ubuntu/dev.agoragaming.gg/.venv/bin/gunicorn --workers 3 --bind unix:/home/ubuntu/dev.agoragaming.gg/app.sock kernel.wsgi:application  
autostart=true
autorestart=true
stderr_logfile=/var/log/gunicorn/gunicorn.err.log
stdout_logfile=/var/log/gunicorn/gunicorn.out.log

[group:guni]
programs:gunicorn
```
```
sudo supervisorctl reread
sudo supervisorct update
sudo supervisorctl status
```


troubleshoot: /var/log/gunicorn/gunicorn.err.log



Update `/etc/nginx/nginx.conf` and change user `www-data` to `root`


Create a file called `domainname_com.conf` in `/etc/nginx/sites-available` directory and add:
```
server{

	listen 80;
	server_name 18.226.170.241;

	
	location / {

		include proxy_params;
		proxy_pass http://unix:/home/ubuntu/dev.agoragaming.gg/app.sock;

	}

}
```

Then activate new nginx config by running
```bash
sudo nginx -t # verify syntax is okay
sudo ln domainname_com.conf /etc/nginx/sites-enabled/ # activate newly create nginx config
sudo service nginx restart # restart service
```


Certbot
