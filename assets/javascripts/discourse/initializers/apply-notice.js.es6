import { withPluginApi } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

function initializeNotice(api) {
  api.decorateCooked($elem => {
    $elem.find('blockquote.notice').each(function() {
      let notice = $(this);
      let emoji = notice.children(0).children(0);
      if (emoji.is('img.emoji')) {
        let type = emoji.attr('title');
        type = type.substring(1, type.length - 1);
        notice.removeClass(`only-emoji`);
        notice.removeClass(`notice-${type}`);
        notice.addClass(`notice-${type}`);
        emoji.addClass(`notice-icon`);
      }
    });
  }, { id: "discourse-custom-bbcodes-notice" });

  api.addToolbarPopupMenuOptionsCallback(() => ({
    action: 'insertNotice',
    icon: 'caret-right',
    label: 'notice.title'
  }));

  ComposerController.reopen({
    actions: {
      insertNotice() {
        this.get("toolbarEvent").applySurround(
          "[notice]",
          "[/notice]",
          "insert_notice"
        );
      }
    }
  });
}

export default {
  name: "custom-bbcodes-apply-notice",

  initialize() {
    withPluginApi('0.5', initializeNotice);
  }
};
