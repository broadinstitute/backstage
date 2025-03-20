FROM gcr.io/buildpacks/google-22/run@sha256:71f6b4ce91e78418e3845f5b13529d6637737221b2d2b4b715a9458db8e1cde0
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
