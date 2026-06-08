FROM gcr.io/buildpacks/google-24/run@sha256:9f7ccca92fa8912709dd73552011c8a536afca797aefe5f72b6a8227a48351ab
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
