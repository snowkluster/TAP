FROM alpine:latest

RUN apk update && apk add tor

COPY torrc /etc/tor/torrc

RUN chown -R tor /etc/tor

USER tor

EXPOSE 9050

ENTRYPOINT ["tor"]

CMD ["-f", "/etc/tor/torrc"]