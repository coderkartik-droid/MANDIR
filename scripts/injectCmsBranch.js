/**
 * scripts/injectCmsBranch.js
 *
 * Vite plugin: at build time, replaces the __CMS_BRANCH__ sentinel in
 * public/admin/index.html with the actual Git branch name from env vars.
 *
 * Branch resolution order:
 *   GIT_BRANCH          — set manually or by CI
 *   RENDER_GIT_BRANCH   — injected automatically by Render.com
 *   CF_PAGES_BRANCH     — injected automatically by Cloudflare Pages
 *   GITHUB_REF_NAME     — injected automatically by GitHub Actions
 *   BRANCH              — generic Netlify / Railway / Fly.io env
 *   "main"              — universal fallback
 *
 * Usage: imported in vite.config.js as a plugin.
 */

export function injectCmsBranchPlugin() {
  let resolvedBranch = 'main';

  return {
    name: 'inject-cms-branch',
    enforce: 'post',

    buildStart() {
      resolvedBranch =
        process.env.GIT_BRANCH        ||
        process.env.RENDER_GIT_BRANCH ||
        process.env.CF_PAGES_BRANCH   ||
        process.env.GITHUB_REF_NAME   ||
        process.env.BRANCH            ||
        'main';

      // Strip the full ref path if GitHub Actions provides "refs/heads/main"
      resolvedBranch = resolvedBranch.replace(/^refs\/heads\//, '');

      console.log(`[injectCmsBranch] CMS branch → "${resolvedBranch}"`);
    },

    // Transform the admin HTML file (served from public/) during dev and build
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        // Only apply to the admin panel, not the main app index.html
        if (!ctx.filename || !ctx.filename.includes('admin')) return html;
        return html.replace(/__CMS_BRANCH__/g, resolvedBranch);
      },
    },

    // During build Vite copies public/ as-is without running transformIndexHtml
    // on non-root HTML files, so we also need a generateBundle hook.
    generateBundle(_, bundle) {
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (fileName === 'admin/index.html' && asset.type === 'asset') {
          asset.source = String(asset.source).replace(/__CMS_BRANCH__/g, resolvedBranch);
        }
      }
    },
  };
}
