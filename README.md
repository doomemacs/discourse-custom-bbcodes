# discourse-custom-bbcodes

> Disclaimer: not only am I new to writing discourse plugins, this was written hastily with the intention to polish it later. Use at your own risk!

A Discourse Plugin (built on top of [discourse-awesome-bbcodes]) that adds
custom BBCode tags for [Doom Emacs' Discourse](//discourse.doomemacs.org). These
tags are:

- `[dump]...[/dump]` --- Useful for large text dumps that shouldn't be indexed
  by the search engine. Our github issue tracker had a serious issue with system
  information polluting the search results.
- `[float=left]...[/float]` or `[float=right]...[/float]` --- used to float
  content to the left or right.
- `[clear][/clear]` --- used to clear floated content.
- `[notice=TYPE]...[/notice]` --- creates a notice modal with an emoji icon based on TYPE. Out of the box `warning`, `note`, `idea`, and `info` are supported.
- `[tabs id=ID title=TITLE]...[/tabs]` --- Tabbed sections of content. Use `[tab=ID]...[/tab]` inside.

## Installation

* Add the plugin's repo url to your container's yml config file

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          # ...
          - git clone https://github.com/doomemacs/discourse-custom-bbcodes.git
```

* Rebuild the container

```
cd /var/discourse
git pull
./launcher rebuild app
```

## Credits

+ [discourse-awesome-bbcodes] was used as a basis for this plugin (by David Montoya and Charles-Pierre Astolfi)


[discourse-awesome-bbcodes]: https://github.com/rux-pizza/discourse-awesome-bbcodes
