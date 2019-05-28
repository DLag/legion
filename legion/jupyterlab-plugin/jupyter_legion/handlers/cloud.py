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
import functools

from tornado.web import HTTPError

from legion.sdk.clients.edi import EDIConnectionException, IncorrectAuthorizationToken
from legion.sdk.clients.training import ModelTrainingClient, ModelTraining
from legion.sdk.clients.deployment import ModelDeploymentClient, ModelDeployment
from legion.sdk.clients.vcs import VcsClient, VCSCredential

from .base import BaseLegionHandler
from .datamodels.cloud import *

LEGION_CLOUD_CREDENTIALS_EDI = 'X-Legion-Cloud-Endpoint'
LEGION_CLOUD_CREDENTIALS_TOKEN = 'X-Legion-Cloud-Token'


def _decorate_handler_for_exception(function):
    """
    Wrap API handler to properly handle EDI client exceptions
    :param function: function to wrap
    :return: wrapped function
    """
    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        try:
            return function(*args, **kwargs)
        except IncorrectAuthorizationToken as base_exception:
            raise HTTPError(log_message=str(base_exception), status_code=403) from base_exception
        except EDIConnectionException as base_exception:
            raise HTTPError(log_message=str(base_exception)) from base_exception
    return wrapper


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
        return training.to_json(True)

    @staticmethod
    def transform_cloud_deployment(deployment: ModelDeployment) -> dict:
        """
        Transform cloud deployment object to dict
        :type deployment: ModelDeployment
        :param deployment: deployment object
        :return: dict
        """
        return deployment.to_json(True)

    @staticmethod
    def transform_vcs(vcs: VCSCredential) -> dict:
        """
        Transform VCS object to dict
        :type vcs: VCSCredential
        :param vcs: VCS object
        :return: dict
        """
        return vcs.to_json()

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

    def get_vcs_instances(self) -> typing.List[dict]:
        """
        Get VCS instances
        :return: typing.List[dict] -- list of VCSs
        """
        client = self.build_cloud_client(VcsClient)
        return [
            self.transform_vcs(vcs)
            for vcs in client.get_all()
        ]


class CloudTrainingsHandler(BaseCloudLegionHandler):
    """
    This handler controls cloud trainings
    """

    @_decorate_handler_for_exception
    def post(self):
        data = TrainingCreateRequest(**self.get_json_body())

        try:
            client = self.build_cloud_client(ModelTrainingClient)
            client.create(data.convert_to_training())
            self.finish_with_json()
        except Exception as query_exception:
            raise HTTPError(log_message='Can not create cluster training') from query_exception

    @_decorate_handler_for_exception
    def delete(self):
        """
        Remove cloud training
        :return:
        """
        data = BasicNameRequest(**self.get_json_body())

        try:
            client = self.build_cloud_client(ModelTrainingClient)
            client.delete(data.name)
            self.finish_with_json()
        except Exception as query_exception:
            raise HTTPError(log_message='Can not remove cluster model training') from query_exception


class CloudDeploymentsHandler(BaseCloudLegionHandler):
    """
    This handler controls cloud deployments
    """

    @_decorate_handler_for_exception
    def post(self):
        """
        Get information about cloud deployments
        :return: None
        """
        data = DeploymentCreateRequest(**self.get_json_body())

        try:
            client = self.build_cloud_client(ModelDeploymentClient)
            client.create(data.convert_to_deployment())
            self.finish_with_json()
        except Exception as query_exception:
            raise HTTPError(log_message='Can not query cloud deployments') from query_exception

    @_decorate_handler_for_exception
    def delete(self):
        """
        Remove local deployment
        :return:
        """
        data = BasicNameRequest(**self.get_json_body())

        try:
            client = self.build_cloud_client(ModelDeploymentClient)
            client.delete(data.name)
        except Exception as query_exception:
            raise HTTPError(log_message='Can not remove cluster model deployment') from query_exception

        self.finish_with_json()


class CloudDeploymentsScaleHandler(BaseCloudLegionHandler):
    """
    This handler controls cloud deployments
    """

    @_decorate_handler_for_exception
    def put(self):
        """
        Get information about cloud deployments
        :return: None
        """
        data = ScaleRequest(**self.get_json_body())
        
        try:
            client = self.build_cloud_client(ModelDeploymentClient)
            client.scale(data.name, data.newScale)
            self.finish_with_json()
        except Exception as query_exception:
            raise HTTPError(log_message='Can not query cloud deployments') from query_exception


class CloudAllEntitiesHandler(BaseCloudLegionHandler):
    """
    This handler return all information for cloud mode
    """
    @_decorate_handler_for_exception
    def get(self):
        self.finish_with_json({
            'trainings': self.get_cloud_trainings(),
            'deployments': self.get_cloud_deployments(),
            'vcss': self.get_vcs_instances()
        })
