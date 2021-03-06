#!/usr/bin/env python
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
Legion-template cli
"""
import argparse
import logging
import signal
from enum import IntEnum

from legion.services.template.engine import LegionTemplateEngine


def main():
    """
    Legion-template entrypoint
    """
    signals = {sig_name: getattr(signal, sig_name).value
               for sig_name in dir(signal)
               if sig_name.startswith('SIG') and not sig_name.startswith('SIG_')
               if isinstance(getattr(signal, sig_name), IntEnum)}

    parser = argparse.ArgumentParser(description='Legion Template Engine is a command line interface '
                                                 'for rendering Jinja2 templates based on File content '
                                                 'or Enclaves details. \n'
                                                 'It watches for any changes in sources and regenerates output.',
                                     epilog='Copyright 2018 EPAM Systems',
                                     formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument('template', type=str, help='Template file path')
    parser.add_argument('output', type=str, help='Output file path')
    parser.add_argument('--command', '-c', type=str, help='System command on refresh')
    parser.add_argument('--signal', '-s', type=str, choices=signals.keys(),
                        help='Signal to send')
    parser.add_argument('--pid', '-p', type=int, help='PID to send the signal')
    parser.add_argument('--pid-file', '-f', type=str, help='Target process .pid file')
    parser.add_argument('--verbose',
                        help='verbose log output',
                        action='store_true')

    args = parser.parse_args()
    target_signal = signals[args.signal] if args.signal else None

    if args.verbose:
        log_level = logging.DEBUG
    else:
        log_level = logging.ERROR

    logging.basicConfig(level=log_level, format='%(asctime)s - %(levelname)s - %(message)s')

    template_system = LegionTemplateEngine(args.template, args.output, command=args.command,
                                           pid=args.pid, pid_file=args.pid_file, signal=target_signal)
    template_system.render_loop()
