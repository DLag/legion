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
from notebook.utils import url_path_join

from .local import LocalBuildsHandler, LocalBuildStatusHandler, LocalDeploymentsHandler, LocalAllEntitiesHandler
from .cloud import CloudTrainingsHandler, CloudDeploymentsHandler, \
    CloudAllEntitiesHandler, CloudDeploymentsScaleHandler, CloudTokenIssueHandler, CloudTrainingsFromFileHandler

ALL_HANDLERS = (
    # Local
    (LocalBuildStatusHandler, ('local', 'builds', 'status')),
    (LocalBuildsHandler, ('local', 'builds')),
    (LocalDeploymentsHandler, ('local', 'deployments')),
    (LocalAllEntitiesHandler, ('local',)),
    # Cloud
    (CloudTrainingsHandler, ('cloud', 'trainings')),
    (CloudTrainingsFromFileHandler, ('cloud', 'local-file')),
    (CloudDeploymentsHandler, ('cloud', 'deployments')),
    (CloudDeploymentsScaleHandler, ('cloud', 'deployments', 'scale')),
    (CloudAllEntitiesHandler, ('cloud',)),
    (CloudTokenIssueHandler, ('cloud', 'security', 'token')),
)


def register_handler(logger, web_app, host_pattern, handler, init_args, root_api, *suburl):
    url = url_path_join(root_api, *suburl)
    logger.info('Installing handler for %s on %r', handler.__name__, url)
    web_app.add_handlers(host_pattern, [(url, handler, init_args)])


def register_all_handlers(logger, web_app, host_pattern, init_args, root_api):
    for handler, url_parts in ALL_HANDLERS:
        logger.info('Processing handler %r', handler.__name__)
        register_handler(logger, web_app, host_pattern, handler, init_args, root_api, *url_parts)
