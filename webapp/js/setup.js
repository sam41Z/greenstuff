/**
 * Created by samuel on 26.03.16.
 */

var Setup = function(data) {
    this.languages = data.languages;
    this.setupLanguage();

    this.regions = data.regions;
    this.setupRegions();

    this.labels = data.labels;
    this.types = data.types;
};

Setup.prototype.setupLanguage = function() {
    this.languageFile = this.languages[0].file;
    //localStorage.clear();
    if (localStorage.languageFile) {
        this.languageFile = localStorage.languageFile;
    } else {
        var language_code = window.navigator.language;
        for (var i = 0; i < this.languages.length; i++) {
            if (this.languages[i].file == language_code + '.json') {
                this.languageFile = this.languages[i].file;
                break;
            }
        }
    }
};

Setup.prototype.setLanguage = function(lang) {
    console.log('set lang ' + lang);
    this.languageFile = lang;
    localStorage.languageFile = this.languageFile;
    loadFiles();
};

Setup.prototype.setupRegions = function() {
    this.regionFile = this.regions[0].file;
    if (localStorage.regionFile) {
        this.regionFile = localStorage.regionFile;
    }
};

Setup.prototype.setRegion = function(reg) {
    this.regionFile = reg;
    localStorage.regionFile = this.regionFile;
    loadFiles();
};