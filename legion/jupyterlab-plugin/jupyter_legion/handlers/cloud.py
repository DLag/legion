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
import json
import typing

from tornado.web import HTTPError

from legion.sdk.clients.training import ModelTrainingClient, ModelTraining
from legion.sdk.clients.deployment import ModelDeploymentClient, ModelDeployment
from legion.sdk.containers.definitions import ModelDeploymentDescription, ModelBuildInformation

from .base import BaseLegionHandler

LEGION_CLOUD_CREDENTIALS_EDI = 'X-Legion-Cloud-Endpoint'
LEGION_CLOUD_CREDENTIALS_TOKEN = 'X-Legion-Cloud-Token'


class BaseCloudLegionHandler(BaseLegionHandler):
    def initialize(self, **kwargs):
        """
        Initialize base handler
        :param kwargs: args
        :return: None
        """
        super().initialize(**kwargs)

    @staticmethod
    def transform_cloud_training(training: ModelTraining) -> dict:
        """
        Transform cloud training information object to dict
        :type training: ModelTraining
        :param training: cloud training information object
        :return: dict
        """
        return training.to_json()

    @staticmethod
    def transform_cloud_deployment(deployment: ModelDeployment) -> dict:
        """
        Transform cloud deployment object to dict
        :type deployment: ModelDeploymentDescription
        :param deployment: deployment object
        :return: dict
        """
        return deployment.to_json()

    def build_cloud_client(self, target_client_class):
        edi_url = self.request.headers.get(LEGION_CLOUD_CREDENTIALS_EDI, '')
        edi_token = self.request.headers.get(LEGION_CLOUD_CREDENTIALS_TOKEN, '')

        if not edi_url:
            raise HTTPError(log_message='Credentials are corrupted')

        return target_client_class(edi_url, edi_token)

    def get_cloud_trainings(self) -> typing.List[dict]:
        """
        Get cloud trainings status
        :return: typing.List[dict] -- list of trainings
        """
        client = self.build_cloud_client(ModelTrainingClient)
        return [
            self.transform_cloud_training(training)
            for training in client.get_all()
        ]

    def get_cloud_deployments(self) -> typing.List[dict]:
        """
        Get cloud deployments status
        :return: typing.List[dict] -- list of deployments
        """
        client = self.build_cloud_client(ModelDeploymentClient)
        return [
            self.transform_cloud_deployment(deployment)
            for deployment in client.get_all()
        ]


class CloudTrainingsHandler(BaseCloudLegionHandler):
    """
    This handler controls cloud trainings
    """
    def get(self):
        try:
            self.finish(json.dumps(self.get_cloud_trainings()))
        except Exception as query_exception:
            raise HTTPError(log_message='Can not query cloud trainings') from query_exception


class CloudDeploymentsHandler(BaseCloudLegionHandler):
    """
    This handler controls cloud deployments
    """

    def get(self):
        """
        Get information about cloud deployments
        :return: None
        """
        try:
            self.finish(json.dumps(self.get_cloud_deployments()))
        except Exception as query_exception:
            raise HTTPError(log_message='Can not query cloud deployments') from query_exception


class CloudAllEntitiesHandler(BaseCloudLegionHandler):
    """
    This handler return all information for cloud mode
    """
    def get(self):
        self.finish(json.dumps({
            'trainings': self.get_cloud_trainings(),
            'deployments': self.get_cloud_deployments()
        }))
