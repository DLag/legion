from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join, to_os_path, exists, to_api_path
from tornado import web
from slugify import slugify
from contextlib import contextmanager
from tornado.escape import json_decode

from .api_state import ApiState
from .handlers import register_all_handlers

LEGION_API_ROOT = 'legion', 'api'


def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.
    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """

    web_app = nb_server_app.web_app
    logger = nb_server_app.log

    host_pattern = '.*$'
    base_url = web_app.settings['base_url']

    root_api = url_path_join(base_url, *LEGION_API_ROOT)
    logger.info('Using %r as root for Legion plugin API', root_api)

    state = ApiState()

    init_args = {
        'logger': logger,
        'state': state
    }

    register_all_handlers(logger, web_app, host_pattern, init_args, root_api)
