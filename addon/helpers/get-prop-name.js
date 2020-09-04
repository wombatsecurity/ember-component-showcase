import { helper } from "@ember/component/helper";

export default helper(function getPropName(params) {
  const p = params[0].find((p) => p.title === "property");
  const title = params[1];

  return p?.name || title;
});
