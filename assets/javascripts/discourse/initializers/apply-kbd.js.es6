import { withPluginApi } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

function initializeKbd(api) {
  // TODO Dedicated tooltip?
  // api.decorateCooked(elem => {
  //   $elem.find('.keyseq').hover(function() {

  //   });
  // }, { id: "discourse-custom-bbcodes-kbd" });

  api.addToolbarPopupMenuOptionsCallback(() => ({
    action: 'insertKbd',
    icon: 'keyboard',
    label: 'kbd.title'
  }));

  ComposerController.reopen({
    actions: {
      insertNotice() {
        this.get("toolbarEvent").applySurround(
          "[kbd command=some-emacs-command]",
          "[/kbd]",
          "insert_kbd"
        );
      }
    }
  });
}

export default {
  name: "custom-bbcodes-apply-kbd",

  initialize() {
    withPluginApi('0.5', initializeKbd);
  }
};
