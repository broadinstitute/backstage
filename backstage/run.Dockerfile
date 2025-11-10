FROM gcr.io/buildpacks/google-22/run@sha256:eb4154d55aaa09b53e0a974f2c16462de6298586bc8d6141030d43fae542b807
ENV PYTHON=/usr/bin/python3
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 python3-pip python3-venv g++ build-essential && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Install mkdocs-techdocs-core dependencies
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN pip3 install --upgrade setuptools
RUN pip3 install mkdocs-techdocs-core
USER cnb
