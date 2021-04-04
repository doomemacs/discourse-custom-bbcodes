import { withPluginApi } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

function initializeNotice(api) {
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
