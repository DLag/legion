__version__ = "0.1.9"

def _jupyter_server_extension_paths():
    return [{
        "module": "jupyter_legion.extension"
    }]