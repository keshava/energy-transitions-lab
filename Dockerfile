FROM jupyter/minimal-notebook:1386e2046833 AS base

LABEL author="Xrathus <support@xrathus.com>"
LABEL maintainer="Xrathus <support@xrathus.com>"

# do stuff here
ENV JUPYTER_ENABLE_LAB=yes

CMD ["start-notebook.sh", "--watch"]

USER root

COPY docker/usr/local/bin/start-notebook.d /usr/local/bin/start-notebook.d
RUN fix-permissions /usr/local/bin/start-notebook.d/

USER $NB_UID
WORKDIR $HOME
