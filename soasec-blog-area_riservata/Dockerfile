FROM httpd
RUN apt-get update -y && apt-get upgrade -y

COPY ./dist/soasec-blog-area_riservata /soasec-blog-area_riservata
COPY ./soasec-blog-area_riservata-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./soasec-blog-area_riservata-httpd-vhosts.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf