from notebook.utils import url_path_join

from .local import LocalBuildsHandler

ALL_HANDLERS = (
    (LocalBuildsHandler, ('local', 'build')),
)


def register_handler(logger, web_app, host_pattern, handler, init_args, root_api, *suburl):
    url = url_path_join(root_api, *suburl)
    logger.info('Installing handler for %s on %r', handler.__name__, url)
    web_app.add_handlers(host_pattern, [(url, handler, init_args)])


def register_all_handlers(logger, web_app, host_pattern, init_args, root_api):
    for handler, url_parts in ALL_HANDLERS:
        logger.info('Processing handler %r', handler.__name__)
        register_handler(logger, web_app, host_pattern, handler, init_args, root_api, *url_parts)
