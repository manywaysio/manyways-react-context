import { merge } from "lodash";

export const slugify = (str) =>
  !!str
    ? str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

export const mergeNodetoLocaleNoSubNode = (node, locale) => {
  let _node = {
    ...node,
  };
  if (!!node?.translations?.[locale]) {
    let _langNode = {
      ...node?.translations?.[locale],
    };
    _node = merge(_node, _langNode);
  }
  return _node;
};
