import json

from notebook.base.handlers import APIHandler
from tornado.web import HTTPError

from legion.sdk.clients.edi import LocalEdiClient
from legion.sdk.containers.docker import get_current_docker_container_id


class LocalBuildsHandler(APIHandler):
    def initialize(self, state, logger, **kwargs):
        self.state = state
        self.logger = logger
        self.client = LocalEdiClient()
        self.logger.debug('%s initialized', self.__class__.__name__)

    def get(self):
        self.finish(json.dumps([
            {
                'imageName': build.image_name,
                'modelName': build.model_id,
                'modelVersion': build.model_version
            }
            for build in self.client.get_builds()
        ]))

    def post(self):
        try:
            get_current_docker_container_id()
        except Exception:
            raise HTTPError(log_message='JupyterLab is run out of container')

        self.logger.debug('Start building of local container')
