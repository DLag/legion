import json
import typing
import multiprocessing
import time

from tornado.web import HTTPError

from legion.sdk.clients.edi import LocalEdiClient
from legion.sdk.containers.docker import get_current_docker_container_id
from legion.sdk.containers.definitions import ModelDeploymentDescription, ModelBuildInformation

from .base import BaseLegionHandler


BUILD_LOCK = multiprocessing.Lock()


def start_legion_build():
    """
    Start building (legionctl build)
    TODO: Replace to real call
    :return: None
    """
    time.sleep(20)


class BaseLocalLegionHandler(BaseLegionHandler):
    def initialize(self, **kwargs):
        """
        Initialize base handler, create local client
        :param kwargs: args
        :return: None
        """
        super().initialize(**kwargs)
        self.client = LocalEdiClient()

    @staticmethod
    def transform_local_build(build: ModelBuildInformation) -> dict:
        """
        Transform build information object to dict
        :type build: ModelBuildInformation
        :param build: build information object
        :return: dict
        """
        return {
            'imageName': build.image_name,
            'modelName': build.model_id,
            'modelVersion': build.model_version
        }

    @staticmethod
    def transform_local_deployment(deployment: ModelDeploymentDescription) -> dict:
        """
        Transform local deployment object to dict
        :type deployment: ModelDeploymentDescription
        :param deployment: deployment object
        :return: dict
        """
        return {
            'name': deployment.deployment_name,
            'image': deployment.image,
            'port': deployment.local_port
        }

    def get_local_builds(self) -> typing.List[dict]:
        """
        Get local builds status
        :return: typing.List[dict] -- list of builds
        """
        return [
            self.transform_local_build(build)
            for build in self.client.get_builds()
        ]

    def get_local_deployments(self) -> typing.List[dict]:
        """
        Get local deployments status
        :return: typing.List[dict] -- list of deployments
        """
        return [
            self.transform_local_deployment(deployment)
            for deployment in self.client.inspect()
        ]

    def start_build(self) -> None:
        """
        Start new build
        :return: None
        """
        with BUILD_LOCK:
            self.logger.debug('Trying to start building of local container')
            process = self.state.local_build_process  # type: typing.Optional[multiprocessing.Process]

            if process and process.is_alive():
                self.logger.warning('Building process already alive. Ignoring...')
                return

            new_process = multiprocessing.Process(target=start_legion_build, args=tuple())
            new_process.start()
            self.state.register_local_build(new_process)

    def get_build_status(self) -> dict:
        """
        Get status of build process
        :return: dict -- build status
        """
        with BUILD_LOCK:
            process = self.state.local_build_process  # type: multiprocessing.Process

        if process:
            return {
                'started': True,
                'finished': not process.is_alive()
            }
        else:
            return {
                'started': False,
                'finished': False
            }


class LocalBuildsHandler(BaseLocalLegionHandler):
    """
    This handler controls local builds (it can show information about current build and start a new one)
    """
    def get(self):
        try:
            self.finish(json.dumps(self.get_local_builds()))
        except Exception as query_exception:
            raise HTTPError(log_message='Can not query local builds') from query_exception

    def post(self):
        try:
            pass
            #get_current_docker_container_id()
        except Exception:
            raise HTTPError(log_message='JupyterLab is run out of container (container ID is unavailable)')

        self.start_build()



class LocalDeploymentsHandler(BaseLocalLegionHandler):
    """
    This handler controls all local deployments
    """

    def get(self):
        """
        Get information about local deployments
        :return:
        """
        try:
            self.finish(json.dumps(self.get_local_deployments()))
        except Exception as query_exception:
            raise HTTPError(log_message='Can not query local deployments') from query_exception

    def post(self):
        """
        Deploy new model locally
        :return: new deployment information
        """
        try:
            data = self.get_json_body()
            name = data.get('name')
            image = data.get('image')
            port = int(data.get('port', 0))
        except Exception as parsing_exception:
            raise HTTPError(log_message='Invalid data from client') from parsing_exception

        try:
            deployments = self.client.deploy(name, image, port)
        except Exception as query_exception:
            raise HTTPError(log_message='Can not deploy model locally') from query_exception

        if deployments:
            return self.transform_local_deployment(deployments[0])
        else:
            raise HTTPError(log_message='Back-end did not return information about created deployment')


class LocalBuildStatusHandler(BaseLocalLegionHandler):
    """
    This handler returns information about local build
    """

    def get(self):
        """
        Get information about local build status
        :return:
        """
        self.finish(json.dumps(self.get_build_status()))


class LocalAllEntitiesHandler(BaseLocalLegionHandler):
    """
    This handler return all information for local mode
    """
    def get(self):
        self.finish(json.dumps({
            'builds': self.get_local_builds(),
            'deployments': self.get_local_deployments(),
            'buildStatus': self.get_build_status()
        }))
