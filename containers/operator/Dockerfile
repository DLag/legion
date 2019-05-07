#
#    Copyright 2019 EPAM Systems
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
#

FROM golang:1.11.6-alpine3.9 as builder

RUN wget https://github.com/golang/dep/releases/download/v0.5.1/dep-linux-amd64 -O /usr/local/bin/dep && \
    chmod +x /usr/local/bin/dep

RUN apk add -u git gcc musl-dev

WORKDIR /go/src/github.com/legion-platform/legion/legion/operator

COPY legion/operator/Gopkg.toml legion/operator/Gopkg.lock ./
RUN dep ensure -vendor-only

COPY legion/operator/pkg/    pkg/
COPY legion/operator/cmd/    cmd/

RUN GOOS=linux GOARCH=amd64 go build -a -o operator github.com/legion-platform/legion/legion/operator/cmd/manager
RUN GOOS=linux GOARCH=amd64 go build -a -o builder github.com/legion-platform/legion/legion/operator/cmd/builder

#########################################################
#########################################################
#########################################################

FROM alpine:3.9 as operator

ENV LEGION_DIR="/opt/legion"

RUN apk add -u openssh-client

COPY --from=builder /go/src/github.com/legion-platform/legion/legion/operator/operator "${LEGION_DIR}/"
WORKDIR "${LEGION_DIR}"
CMD ["./operator"]

#########################################################
#########################################################
#########################################################

FROM python:3.6.8-alpine3.9 as model-builder

ENV LEGION_DIR="/opt/legion" \
    LC_ALL="C.UTF-8" \
    LANG="C.UTF-8" \
    LANGUAGE="C.UTF-8"

RUN pip install --disable-pip-version-check --upgrade pip==18.1 pipenv==2018.10.13 && \
    apk add -u openssh-client

COPY legion/sdk/Pipfile legion/sdk/Pipfile.lock "${LEGION_DIR}/sdk/"
RUN  cd "${LEGION_DIR}/sdk" && pipenv install --system --three
COPY legion/cli/Pipfile legion/cli/Pipfile.lock "${LEGION_DIR}/cli/"
RUN  cd "${LEGION_DIR}/cli" && pipenv install --system --three

COPY legion/sdk "${LEGION_DIR}/sdk"
COPY legion/cli "${LEGION_DIR}/cli"

RUN pip install --no-deps -e "${LEGION_DIR}/sdk" && \
    pip install --no-deps -e "${LEGION_DIR}/cli"

COPY --from=builder /go/src/github.com/legion-platform/legion/legion/operator/builder "${LEGION_DIR}/"
WORKDIR "${LEGION_DIR}"

CMD ["./builder"]

#########################################################
#########################################################
#########################################################

FROM golang:1.11.6-alpine3.9 as tests

RUN wget https://github.com/kubernetes-sigs/kubebuilder/releases/download/v1.0.8/kubebuilder_1.0.8_linux_amd64.tar.gz -O /tmp/kubebuilder.tar.gz && \
    tar -zxvf /tmp/kubebuilder.tar.gz -C /usr/local/ && mv /usr/local/kubebuilder_* /usr/local/kubebuilder
RUN apk add -u gcc musl-dev
COPY --from=builder /go/src/github.com/legion-platform/legion/legion/operator /go/src/github.com/legion-platform/legion/legion/operator
WORKDIR /go/src/github.com/legion-platform/legion/legion/operator
RUN go test ./pkg/... ./cmd/... -coverprofile cover.out