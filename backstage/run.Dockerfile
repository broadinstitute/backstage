FROM gcr.io/buildpacks/google-22/run@sha256:28c712d28b3fc6f3ae817f1b1f49fd56d64e5cbd8a27aa53cc61ca398b92b4d3
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
RUN pip3 install mkdocs-techdocs-core
