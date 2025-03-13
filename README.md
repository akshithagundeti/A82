centOS 9 Streamx64
Basic Regular $12/mo

ssh root@<ip-address>

sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

node -v
npm -v

yum install git -y

git clone https://github.com/akshithagundeti/A82.git
cd A82

cd Backend
npm install

copy .env file first
node index.js

cd ../frontend
npm install
npm run build
yum install nginx -y

systemctl start nginx
systemctl enable nginx

vi /etc/nginx/nginx.conf

path: /root/A82/frontend/build

root /root/A82/frontend/build
index index.html index.htm;


server {
    listen 80;
    server_name your_droplet_ip;

    root /root/A82/frontend/build;
    index index.html index.htm;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


nginx -t
systemctl restart nginx
npm install -g pm2

Backend:
pm2 start index.js --name backend

pm2 startup
pm2 save

yum install firewalld -y
systemctl start firewalld
systemctl enable firewalld

systemctl status firewalld


firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --zone=public --add-port=3000/tcp --permanent
firewall-cmd --reload


cp -r /root/A82/frontend/build/* /usr/share/nginx/html/
systemctl restart nginx

nginx -t
systemctl restart nginx

chown -R nginx:nginx build
chmod -R 755 build


sudo chmod 755 /usr/share/nginx/html/index.html

sudo chown -R nginx:nginx /usr/share/nginx/html
sudo chmod -R 755 /usr/share/nginx/html
sudo systemctl restart nginx
sudo nginx -t
sudo chown -R nginx:nginx /usr/share/nginx/html
sudo chmod -R 755 /usr/share/nginx/html
sudo systemctl restart nginx

sudo mv /root/A82 /var/www/A82
sudo mkdir -p /var/www
sudo mv /root/A82 /var/www/A82
sudo chown -R nginx:nginx /var/www/A82/frontend/build
sudo chmod -R 755 /var/www/A82/frontend/build


vi /etc/nginx/nginx.conf

server {
    listen 80;
    server_name _;

    root /var/www/A82/frontend/build;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}


sudo systemctl restart nginx
sudo chown -R nginx:nginx /var/www/A82
sudo chown -R www-data:www-data /var/www/A82
sudo chmod -R 755 /var/www/A82
sudo nginx -s reload
ls -l /var/www/A82/frontend/build
sudo chown -R nginx:nginx /var/www/A82
sudo chown -R www-data:www-data /var/www/A82
sudo chmod -R 755 /var/www/A82
sudo -u nginx cat /var/www/A82/frontend/build/index.html
sudo nginx -s reload


vi /etc/nginx/nginx.conf

change server_name with ip-address


sudo nginx -t
sudo nginx -s reload
sestatus
sudo chcon -R -t httpd_sys_content_t /var/www/A82/frontend/build
sudo setenforce 0

If base url is not changed do these again


npm run build
scp -r ./build/ root@<Your-Server-IP>:/var/www/A82/frontend/
scp -r ./build/ root@143.198.141.52:/var/www/A82/frontend/
scp -r ./build/ /var/www/A82/frontend/

sudo chown -R nginx:nginx /var/www/A82/frontend/build
sudo chmod -R 755 /var/www/A82/frontend/build
sudo chcon -R -t httpd_sys_content_t /var/www/A82/frontend/build

sudo nginx -s reload
