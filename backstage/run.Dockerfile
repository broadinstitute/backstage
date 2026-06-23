FROM gcr.io/buildpacks/google-24/run@sha256:12bed5ea5b9a9e40abe9ed3d78416019b9fa4879cd89d57340ce95c2a800035a
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
USER www-data
