export function setup(helper) {
  helper.registerOptions((opts, siteSettings) => {
    opts.features["custom-bbcodes"] = !!siteSettings.custom_bbcodes_enable;
    opts.customBBCodes = {
      enabledTags: (siteSettings.custom_bbcodes_list || '').split('|'),
      defaultRepo: (siteSettings.custom_bbcodes_default_repo || '').split('/'),
      referencesEnabled: siteSettings.custom_bbcodes_resolve_references
    };
  });

  helper.allowList([
    'div.float-left',
    'div.float-right',
    'div.clear',
    'pre.dump',
    'div.tabs',
    'div.tab',
    'div[data-tab]',
    'code[data-encoded]',
    'blockquote[class]',
    'span.keyseq',
    'span[data-command]',
    'span[data-alt-key]',
    'span[data-ref]',
    'a[href]',
    'a.ref-package',
    'a.ref-module',
    'a.ref-fn',
    'a.ref-var',
    'a.ref-face',
    'a.ref-issue'
  ]);

  helper.registerPlugin(window.markdownitAbbr);

  helper.registerPlugin(md => {
    let opts = helper.getOptions().customBBCodes;

    if (opts.enabledTags.indexOf('notice') > -1) {
      md.block.bbcode.ruler.push('notice', {
        tag: 'notice',
        wrap: 'blockquote.notice'
      });
    }

    if (opts.referencesEnabled) {
      // TODO Make these configurable via config/settings.yml
      const refTypes = {
        '^(?::([\\w-]+)(?: ([\\w-]+))(?: \\+([\\w-]+))?|\\+([\\w-]+))(?:::(.*))?$': m => {
          let [_, cat, mod, flag, loneflag, extra] = m;
          if (loneflag) {
            flag = loneflag;
            [_, cat, mod] = window.location.pathname.match(/\/modules\/([^\/]+)(?:\/([^\/]+)\/)?/) || [];
          }
          if (cat) {
            const url = `${cat}/${mod}` + (flag ? `/#/description/module-flags/${flag}` : "");
            const moduleLabel = cat ? [`:${cat}`, mod, flag].join(' ').trim() : null;
            return {
              class: 'ref-module',
              href:  `https://docs.doomemacs.org/latest/modules/${url}${extra || ''}`,
              text:  moduleLabel,
              title: `Doom module documentation for ${moduleLabel}`
            };
          }
          console.err(`Couldn't resolve current module for [[${flag}]] link`);
          return {
            class: 'ref-module',
            href:  '#',
            text:  "(couldn't find module)",
            title: "Couldn't find module"
          };
        },
        '^p(?:ackage|kg)?:(.+?)(?:::(.*))?$': m => ({
          class: 'ref-package',
          href:  `https://docs.doomemacs.org/-/package/#/${m[1]}${m[2] || ''}`,
          text:  m[1],
          title: `Package documentation for ${m[1]}`
        }),
        '^fn:(.+?)(?:::(.*))?$': m => ({
          class: 'ref-fn',
          href:  `https://docs.doomemacs.org/-/function/${m[1]}${m[2] || ''}`,
          text:  m[1],
          title: `Function documentation for ${m[1]}`
        }),
        '^var:(.+?)(?:::(.*))?$': m => ({
          class: 'ref-var',
          href:  `https://docs.doomemacs.org/-/var/${m[1]}${m[2] || ''}`,
          text:  m[1],
          title: `Variable documentation for ${m[1]}`
        }),
        '^face:(.+?)(?:::(.*))?$': m => ({
          class: 'ref-face',
          href:  `https://docs.doomemacs.org/-/face/${m[1]}${m[2] || ''}`,
          text:  m[1],
          title: `Face documentation for ${m[1]}`
        }),
        '^(?:(?:([^/ ]+)/)?([^# ]+))?#([0-9]+)([#?].*)?$': m => {
          let [user, repo] = opts.defaultRepo;
          user = m[1] || user;
          repo = m[2] || repo;
          return {
            class: 'ref-issue',
            href:  `https://github.com/${user}/${repo}/issues/${m[3]}${m[4] || ''}`,
            text:  m[0],
            title: `Link to Github issue: ${user}/${repo}#${m[3]}${m[4] || ''}`
          };
        }
      };
      md.core.textPostProcess.ruler.push('references', {
        matcher: /\[\[([^\]\n]+)\](?:\[([^\]\n]+)(?: "([^"]+)")\])?\]/,
        onMatch: (buffer, matches, state) => {
          let result;
          Object.keys(refTypes).find(re => {
            const m = matches[1].match(new RegExp(re));
            if (m) {
              result = refTypes[re](m);
              result.text = result.text || matches[2];
              result.title = result.title || matches[3] || result.text;
              return !!result.href;
            }
          });
          if (result) {
            let token = new state.Token('link_open', 'a', 1);
            token.attrs = [['class', result.class],
                           ['href',  result.href],
                           ['title', result.title]];
            buffer.push(token);

            token = new state.Token('text', '', 0);
            token.content = result.text;
            buffer.push(token);

            token = new state.Token('link_close', 'a', -1);
            buffer.push(token);
          }
        }
      });
    }

    if (opts.enabledTags.indexOf('kbd') > -1) {
      md.inline.bbcode.ruler.push('kbd', {
        tag: 'kbd',
        replace: (state, tag, content) => {
          let attrs = [['class', 'keyseq']];
          if (tag.attrs.command)
            attrs.push(['data-command', tag.attrs.command]);
          if (tag.attrs.altkey)
            attrs.push(['data-alt-key', tag.attrs.altkey]);
          state.push('span_open', 'span', 1).attrs = attrs;
          content.split(' ').forEach(key => {
            state.push('kbd_open', 'kbd', 1);
            state.push('text', '', 0).content = key;
            state.push('kbd_close', 'kbd', -1);
          });
          state.push('span_close', 'span', -1);
          return true;
        }
      });
    }

    if (opts.enabledTags.indexOf('clear') > -1) {
      md.block.bbcode.ruler.push('clear', {
        tag: 'clear',
        wrap: 'div.clear'
      });
    }

    if (opts.enabledTags.indexOf('float') > -1) {
      md.block.bbcode.ruler.push('float', {
        tag: 'float',
        wrap: (state, tag) => {
          state.attrs = [['class', `float-${tag.attrs._default}`]];
          return true;
        }
      });
    }

    if (opts.enabledTags.indexOf('dump') > -1) {
      md.block.bbcode.ruler.push('dump', {
        tag: 'dump',
        replace: (state, tag, content) => {
          state.push('div_open', 'div', 1)
               .attrs = [['class', 'dump']
                         ['data-encoded', content]];
          state.push('text', '', 0).content = "Loading data dump...";
          state.push('div_close', 'div', -1)
          return true;
        }
      });
    }

    if (opts.enabledTags.indexOf('tabs') > -1) {
      md.block.bbcode.ruler.push('tabs', {
        tag: 'tabs',
        // wrap: 'div.tabs'
        wrap: (token, tag) => {
          token.attrs = [['class', 'tabs']];
          if (tag.attrs._default) {
            tokens.attrs.push(['data-id', tag.attrs._default]);
          }
          return true;
        }
      });
      md.block.bbcode.ruler.push('tab', {
        tag: 'tab',
        // wrap: 'div.tab'
        wrap: (token, tag) => {
          token.attrs = [['class', 'tab']];
          let id = tag.attrs.id || tag.attrs._default || "untitled";
          let title = tag.attrs.title || id;
          token.attrs.push(['data-tab-id', id]);
          if (title) {
            token.attrs.push(['data-tab-title', title]);
          }
          return true;
        }
      });
    }
  });
}
