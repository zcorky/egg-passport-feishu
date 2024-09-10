'use strict';

/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  const profile = {};
  profile.id = json.union_id || json.open_id || json.user_id;
  profile.name = json.name;
  profile.avatar = {
    icon: json.avatar_url,
    thumb: json.avatar_thumb,
    middle: json.avatar_middle,
    big: json.avatar_big,
  };

  if (json.email) {
    profile.email = json.email;
  }

  if (json.mobile) {
    profile.mobile = json.mobile;
  }

  return profile;
};
