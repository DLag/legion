import typing
import multiprocessing


class ApiState:
    def __init__(self):
        self._local_build_process = None

    def register_local_build(self, process: multiprocessing.Process):
        self._local_build_process = process

    @property
    def local_build_process(self) -> typing.Optional[multiprocessing.Process]:
        return self._local_build_process
