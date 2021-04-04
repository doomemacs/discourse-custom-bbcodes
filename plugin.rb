# name: discourse-custom-bbcodes
# about: Custom BBCode tags for Doom Emacs' discourse
# version: 1.0.0
# authors: Henrik Lissner
# url: https://github.com/doomemacs/discourse-custom-bbcodes

# Details Stylesheet
register_asset 'stylesheets/dumps.scss'
register_asset 'stylesheets/floats.scss'
register_asset 'stylesheets/notices.scss'
register_asset 'stylesheets/tabs.scss'

register_asset "javascripts/vendor/markdownItDefList.js", :vendored_pretty_text
register_asset "javascripts/vendor/markdownItAbbr.js", :vendored_pretty_text
