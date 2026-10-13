// Set NEXT_PUBLIC_SITE_URL in the deploy environment to the real production domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaiperui.vercel.app").replace(
    /\/$/,
    "",
);

export const SITE_NAME = "vaiperui";

export const GITHUB_URL = "https://github.com/vaiperliotech/vaiperui";
