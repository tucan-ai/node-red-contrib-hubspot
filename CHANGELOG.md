# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

uibuilder adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

----

## [Unreleased](https://github.com/tucan-ai/node-red-contrib-hubspot/compare/v0.2.0...main)

### Changed

* improve node error logs

## [0.6.0](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.6.0)

### Added

* oauth flow for app tokens

### Changed

* callback to load hubspot client with potential refresh

### fixed

* contact association delete node registration

## [0.5.0](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.5.0)

### Added

* access token authentication
* developer api key authentication

## [0.4.3](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.4.3)

### fixed

* fix plural conversion

## [0.4.2](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.4.2)

### fixed

* association type is not taken from configuration

## [0.4.1](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.4.1)

### fixed

* search did not complete
* api requests did contain response object instead of body

## [0.4.0](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.4.0)

### Added

* company create association node
* company delete association node
* contact create association node
* contact delete association node

### Changed

* switch all api calls to V3 with @hubspot/api-client

## [0.3.0](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.3.0)

### Added

* contact create node
* contact get by id node
* contact update node

## [0.2.0](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.2.0)

### Added

* company create node
* company update node
* deal create node
* deal get by id node
* deal update node
* deal association create node
* deal association delete node

### Changed

* file structure of nodes
* company get by id config for inputId

## [0.1.0](https://github.com/tucan-ai/node-red-contrib-hubspot/releases/tag/v0.1.0)

### Added

* api request node
* company get by id node
* search node
