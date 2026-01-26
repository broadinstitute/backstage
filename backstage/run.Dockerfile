FROM gcr.io/buildpacks/google-22/run@sha256:8236293feb01d4aee4363bc52458d958a7501e6f928daa5d0376571c1bd5f73e
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv g++ build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install mkdocs-techdocs-core dependencies
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN pip3 install --upgrade setuptools mkdocs-techdocs-core mkdocstrings mkdocstrings-python
USER cnb
