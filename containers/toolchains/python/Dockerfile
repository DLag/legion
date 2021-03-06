#
#    Copyright 2018 EPAM Systems
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
#
FROM python:3.6.8-stretch

ENV WORK_DIR="/opt/legion"
WORKDIR "${WORK_DIR}/"

RUN wget https://github.com/krallin/tini/releases/download/v0.18.0/tini-amd64 -qO /bin/tiny && \
    chmod a+x /bin/tiny

RUN pip3 install --disable-pip-version-check --upgrade pip==18.1 pipenv==2018.10.13 ptvsd==4.2.2 jupyterlab==0.35.6

COPY legion/sdk/Pipfile legion/sdk/Pipfile.lock "${WORK_DIR}/legion/sdk/"
RUN  cd legion/sdk && pipenv install --system --three
COPY legion/toolchains/python/Pipfile legion/toolchains/python/Pipfile.lock "${WORK_DIR}/legion/toolchains/python/"
RUN  cd legion/toolchains/python && pipenv install --system --three
COPY legion/cli/Pipfile legion/cli/Pipfile.lock "${WORK_DIR}/legion/cli/"
RUN  cd legion/cli && pipenv install --system --three

COPY containers/toolchains/python/legion-doc.txt /opt/legion/
COPY containers/toolchains/python/jupyter_notebook_config.py /etc/jupyter/

COPY legion/sdk "${WORK_DIR}/legion/sdk"
COPY legion/toolchains/python "${WORK_DIR}/legion/toolchains/python"
COPY legion/cli "${WORK_DIR}/legion/cli"

RUN pip3 install --no-deps -e legion/sdk && \
    pip3 install --no-deps -e legion/toolchains/python && \
    pip3 install --no-deps -e legion/cli && \
    echo '[ ! -z "$TERM" -a -r /etc/motd ] && cat /etc/motd' >> /etc/bash.bashrc && \
    cat /opt/legion/legion-doc.txt > /etc/motd