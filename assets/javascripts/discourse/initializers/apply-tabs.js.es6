import { withPluginApi } from "discourse/lib/plugin-api";
import ComposerController from 'discourse/controllers/composer';

function initializeTabs(api) {
  const enabledTags = api.container.lookup('site-settings:main').custom_bbcodes_list.split('|');
  if (enabledTags.indexOf('tabs') === -1) return;

  api.decorateCooked($elem => {
    // Create tabbed panels out of [tabs]...[/tabs] codes
    let tabbed = $elem.find(`.tabs`).addClass('processed');
    let detachedTabs = $elem.find(`.tab`);
    detachedTabs.find(`:first-child`).addClass("selected");
    tabbed.each(function() {
      let tabLine = $(`<ul class="tab-line"></ul>`);
      let node = $(this);
      let id = node.attr('data-id');
      let tabs = node.find(`.tab`);
      tabs.each(function() {
        let node = $(this);
        let name = node.attr('data-tab-id');
        let title = node.attr('data-tab-title') || name;
        let link = $(`<a data-target="${name}">${title}</a>`);
        link.click(function() {
          tabLine.find('a.selected').removeClass('selected');
          link.addClass('selected')
          if (id) {
            detachedTabs.filter(`[data-id="${id}"]`).each(function() {
              let node = $(this);
              node.find(`.tab`).removeClass('selected');
              node.find(`.tab[data-tab-id=${name}]`).addClass('selected');
            });
          } else {
            tabs.removeClass('selected');
            node.addClass('selected');
          }
        });
        tabLine.append($('<li></li>').append(link));
      });
      tabLine.find('a').first().addClass('selected');
      tabs.first().addClass('selected');
      node.prepend(tabLine);
    });
  }, { id: "discourse-custom-bbcodes-tabbed" });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: 'insertTabs',
      icon:   'folder',
      label:  'tabs.title'
    };
  });

  ComposerController.reopen({
    actions: {
      insertNotice() {
        this.get("toolbarEvent").applySurround(
          "[tabs=ID title=TITLE]",
          "[/tabs]",
          "insert_tabs"
        );
      }
    }
  });
}

// function initializeGlobalTabs(api) {
// }

export default {
  name: "custom-bbcodes-apply-tabs",

  initialize() {
    withPluginApi("0.8.7", initializeTabs);
    // withPluginApi("0.8.7", initializeGlobalTabs);
  }
};
