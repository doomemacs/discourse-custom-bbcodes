# discourse-custom-bbcodes

> Disclaimer: not only am I new to writing discourse plugins, this was written hastily with the intention to polish it later. Use at your own risk!

A Discourse Plugin (built on top of [discourse-awesome-bbcodes]) that adds
custom BBCode tags for [Doom Emacs' Discourse](//discourse.doomemacs.org). These
tags are:

- [X] `[dump]...[/dump]` --- Useful for large text dumps that shouldn't be
      indexed by the search engine. Our github issue tracker had a serious issue
      with system information polluting the search results.
- [X] `[float=left]...[/float]` or `[float=right]...[/float]` --- used to float
      content to the left or right.
- [X] `[clear][/clear]` --- used to clear floated content.
- [X] `[kbd command=+ivy/switch-workspace-buffer alt="C-x C-b,SPC b B]SPC b
      b[/kbd]` --- syntax sugar for key sequences. Will later be improved to
      display commands and alternative key sequences on mouseover.
- [X] `[notice]...[/notice]` --- creates a notice modal (a blockquote). Uses the
      first emoji in the first element as the notice's icon, and appends a
      `notice-EMOJINAME` class to the enclosing blockquote.
- [X] `[tabs id=ID title=TITLE]...[/tabs]` --- Tabbed sections of content. Use
      `[tab=ID]...[/tab]` inside.
- [X] `[[...]]` syntax for auto-linking:
  - [X] Github issue references: `[[#123]]`, `[[doom-emacs/#1234]]`, `[[hlissner/doom-emacs#1234]]`
  - [X] Links to Doom module docs or a particular module flag's docs: `[[:lang]]`, `[[:lang rust]]`, `[[:lang rust +lsp]]`
  - [ ] Packages: `[[package:evil]]`, `[[p:evil]]`, `[[p:rustic-mode]]`
  - [ ] Functions/Macros: `[[fn:evil-join]]`, `[[fn:after!]]`, `[[fn:add-hook]]`
  - [ ] Variables: `[[var:evil-join]]`, `[[var:after!]]`, `[[var:add-hook]]`
  - [ ] Faces: `[[face:org-level-2]]`, `[[face:font-lock-comment-face]]` 


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
