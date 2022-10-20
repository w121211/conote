FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:slim

COPY . /workspace/
WORKDIR /workspace


# Install Postgresql client (version: 14)
RUN apt-get update -y && apt-get install wget; \
        echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list; \
        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -;\
        apt-get update && apt-get install postgresql-client-14 -y


# Unccomment for dev. Prevent container stop
ENTRYPOINT ["tail", "-f", "/dev/null"]
