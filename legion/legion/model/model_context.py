#
#    Copyright 2018 EPAM Systems
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
"""
Model context
"""
import legion.pymodel.model
import legion.config
from legion.utils import normalize_name

MODEL_TYPES = [
    legion.pymodel.model.Model
]

_context = None


def get_context():
    """
    Get current model context

    :return:
    """
    return _context


def init(model_id, model_version, model_type):
    """
    Initialize new model context

    :param model_id: model name
    :type model_id: str
    :param model_version: model version
    :type model_version: str
    :param model_type: type of model, one of MODEL_TYPES names
    :type model_type: str
    :return: Model -- instance of Model class
    """
    global _context

    if _context:
        raise Exception('Context already has been defined')

    model_id = normalize_name(model_id)
    if not model_id:
        raise Exception('Model name string length should be greater that 1 (after normalization)')

    builder = [m_type for m_type in MODEL_TYPES if m_type.NAME == model_type]

    if not builder:
        raise Exception('Cannot find model builder for type {}'.format(model_type))

    if len(builder):
        raise Exception('More then 1 builder have been found for type {}'.format(model_type))

    _context = builder[0](model_id, model_version)


properties = lambda *args, **kwargs: _context.properties(*args, **kwargs)
define_property = lambda *args, **kwargs: _context.define_property(*args, **kwargs)
on_property_change = lambda *args, **kwargs: _context.on_property_change(*args, **kwargs)
send_metrics = lambda *args, **kwargs: _context.send_metrics(*args, **kwargs)
# TODO: Add all methods
