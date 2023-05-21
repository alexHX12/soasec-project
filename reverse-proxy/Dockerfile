FROM httpd
RUN apt-get update -y && apt-get upgrade -y

COPY ./soasec-rp-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./soasec-rp-httpd-vhosts.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf
