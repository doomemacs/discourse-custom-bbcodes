import { withPluginApi } from "discourse/lib/plugin-api";
import ComposerController from 'discourse/controllers/composer';

function initializeDumps(api) {
  const enabledTags = api.container.lookup('site-settings:main').custom_bbcodes_list.split('|');
  if (enabledTags.indexOf('dump') === -1) return;

  api.decorateCooked($elem => {
    // Our github had a problem with 'M-x doom/info' polluting search
    // results. To prevent this, users will paste in their doom/infos
    // encoded, which will be decoded live via javascript.
    $elem.find(`pre.dump > code`).replaceWith(function() {
      try {
        let data = $(this).attr('data-encoded');
        return $(this).text(data || "{empty}");
      } catch (e) {
        console.log(`doom/info decoding error: ${e}`);
        return $(this).text(`Cannot display this data dump because of an unexpected error`)
                      .addClass('error');
      }
    });
  }, { id: "discourse-custom-bbcodes-dumps" });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: 'insertDump',
      icon:   'dumpster',
      label:  'dump.title'
    };
  });

  ComposerController.reopen({
    actions: {
      insertNotice() {
        this.get("toolbarEvent").applySurround(
          "[dump]",
          "[/dump]",
          "insert_dump"
        );
      }
    }
  });
}

export default {
  name: "custom-bbcodes-apply-dumps",

  initialize() {
    withPluginApi("0.8.7", initializeDumps);
  }
};
