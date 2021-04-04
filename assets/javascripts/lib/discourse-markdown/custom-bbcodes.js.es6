export function setup(helper) {
  helper.registerOptions((opts, siteSettings) => {
    opts.features["custom-bbcodes"] = !!siteSettings.custom_bbcodes_enable;
    opts.customBBCodes = {
      noticeTypes: (siteSettings.custom_bbcodes_notices_list || '').split('|'),
      enabledTags: (siteSettings.custom_bbcodes_list || '').split('|')
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
    'span[data-alt-key]'
  ]);

  helper.registerPlugin(window.markdownitDefList);
  helper.registerPlugin(window.markdownitAbbr);

  helper.registerPlugin(md => {
    let opts = helper.getOptions().customBBCodes;

    if (opts.enabledTags.indexOf('notice') > -1) {
      md.block.bbcode.ruler.push('notice', {
        tag: 'notice',
        wrap: 'blockquote.notice'
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
          state.push('div_open', 'pre', 1)
               .attrs = [['class', 'dump']];
          state.push('div_open', 'code', 1)
               .attrs = [['data-encoded', content]];
          state.push('text', '', 0).content = "Loading data dump...";
          state.push('div_close', 'code', -1);
          state.push('div_close', 'pre', -1)
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
