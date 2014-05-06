ThinXdebug
==========

Firefox add-on for switching Xdebug remote debugging session.

This extension adds two buttons to the Firefox navigation toolbar: one for starting a debugging session, and another button for starting xdebug profiling.

## Requirements

This add-on requires Firefox 29+.

## Installation

* Clone the repository
* Simply drag the file from **build/thin-xdebug.xpi** into your browser window and confirm the installation.

## Repackaging the add-on
To rebuild the add-on, you need to [install the current Firefox SDK first](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation).
The add-on can be rebuilt by:

```bash
git clone https://github.com/rlaffers/thinxdebug.git
cd thinxdebug.git
cfx xpi
```
