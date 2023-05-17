FROM httpd
RUN apt-get update -y && apt-get upgrade -y

COPY ./dist/soasec-blog /soasec-blog
COPY ./soasec-blog-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./soasec-blog-httpd-vhosts.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf