'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.askForModuleName = function askForModuleName(params) {
  var done = this.async();

  this.prompt([{
    name: 'module',
    message: 'Which module is this for?',
    default: this.name,
    when: function () {
      return !(this.options && this.options.module);
    }.bind(this),
    validate: function (input) {
      return utils.moduleExists(this.config.path, input);
    }.bind(this)
  }, {
    name: 'url',
    message: 'What\'s the URL for this state?',
    default: function () {
      return '/' + utils.lowerCamel(this.name);
    }.bind(this),
    when: function() {
      return ( (params && params.url) && !(this.options && this.options.url) );
    }.bind(this)
  }, {
    name: 'templateUrl',
    message: 'What\'s the templateURL for this state?',
    default: function (answers) {
      var module = answers.module || this.options.module;
      return module + '/' + this.name + '.tpl.html';
    }.bind(this),
    when: function () {
      return ( (params && params.templateUrl) && !(this.options && this.options['template-url']) );
    }.bind(this)
  }], function (props) {
    this.module = props.module || this.options.module;
    this.url = props.url || this.options.url;
    this.templateUrl = props.templateUrl || this.options['template-url'];

    // prepend slash if missing
    if (this.url && (this.url.charAt(0) !== '/' && this.url.charAt(0) !== '\\')) {
      this.url = '/' + this.url;
    }

    // append .tpl.html if not existing
    if (!/[.]tpl[.]html$/.test(this.templateUrl)) {
      this.templateUrl = this.templateUrl + '.tpl.html';
    }

    done();
  }.bind(this));
};

Generator.prototype.getConfig = function getConfig() {
  var config = {
    markup: this.options.markup || this.config.get('markup'),
    appScript: this.options['app-script'] || this.config.get('appScript'),
    controllerAs: this.options['controller-as'] || this.config.get('controllerAs'),
    passFunc: this.options['pass-func'] || this.config.get('passFunc'),
    namedFunc: this.options['named-func'] || this.config.get('namedFunc'),
    testScript: this.options['test-script'] || this.config.get('testScript'),
    testDir: this.options['test-dir'] || this.config.get('testDir'),
    style: this.options.style || this.config.get('style'),

    appName: utils.getAppName(this.config.path),
    ctrlName: utils.ctrlName(this.name),
    humanName: utils.humanName(this.name),
    hyphenName: utils.hyphenName(this.name),
    lowerCamel: utils.lowerCamel(this.name),
    upperCamel: utils.upperCamel(this.name)
  };

  if (this.module) {
    utils.moduleExists(this.config.path, this.module);
    var modules = utils.extractModuleNames(this.module);
    config.modulePath = this.module.replace('.', '/');
    config.moduleName = modules[0];
    config.parentModuleName = modules[1];
  }

  return config;
};

Generator.extend = require('class-extend').extend;