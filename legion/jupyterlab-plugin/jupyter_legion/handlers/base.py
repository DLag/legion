from notebook.base.handlers import APIHandler


class BaseLegionHandler(APIHandler):
    def initialize(self, state, logger, **kwargs):
        self.state = state
        self.logger = logger
        self.logger.debug('%s initialized', self.__class__.__name__)
