FROM denoland/deno:ubuntu

# install git
RUN \
  apt update && \
  apt install -y git

# clone server code
WORKDIR /home/server
RUN git clone https://github.com/anteater333/email-verifier.git
WORKDIR /home/server/email-verifier

COPY .env .env

EXPOSE $SMTP_PORT
EXPOSE $SERVER_PROT

ENTRYPOINT [ "deno", "task", "serve" ]