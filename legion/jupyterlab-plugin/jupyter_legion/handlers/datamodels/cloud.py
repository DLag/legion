#
#    Copyright 2019 EPAM Systems
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
import typing
from pydantic import BaseModel

from legion.sdk.clients.training import ModelTraining
from legion.sdk.clients.deployment import ModelDeployment


class BasicNameRequest(BaseModel):
    name: str


class TrainingCreateRequest(BaseModel):
    name: str
    entrypoint: str
    image: str
    vcsName: str
    toolchain: str
    args: typing.List[str] = []
    reference: str = ''
    resources: typing.Mapping[str, typing.Any] = {}
    workDir: str = ''

    def convert_to_training(self) -> ModelTraining:
        return ModelTraining(
            name=self.name,
            toolchain_type=self.toolchain,
            entrypoint=self.entrypoint,
            args=self.args,
            resources=self.resources,
            vcs_name=self.vcsName,
            work_dir=self.workDir,
            reference=self.reference,
        )


class DeploymentCreateRequest(BaseModel):
    name: str
    image: str
    livenessProbeInitialDelay: int=5
    readinessProbeInitialDelay: int=5
    replicas: int = 1
    resources: typing.Mapping[str, typing.Any] = {}
    annotations: typing.Mapping[str, str] = {}

    def convert_to_deployment(self) -> ModelDeployment:
        return ModelDeployment(
            name=self.name,
            image=self.image,
            resources=self.resources,
            annotations=self.annotations,
            replicas=self.replicas,
            liveness_probe_initial_delay=self.livenessProbeInitialDelay,
            readiness_probe_initial_delay=self.livenessProbeInitialDelay
        )


class ScaleRequest(BaseModel):
    name: str
    newScale: int


class IssueTokenRequest(BaseModel):
    model_id: str
    model_version: str
