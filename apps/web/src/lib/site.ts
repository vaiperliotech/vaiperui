// Set NEXT_PUBLIC_SITE_URL in the deploy environment to the real production domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaiperui.vercel.app").replace(
    /\/$/,
    "",
);

export const SITE_NAME = "vaiperui";

export const SITE_TITLE = "vaiperui · Biblioteca de componentes React com Tailwind CSS";

export const SITE_DESCRIPTION =
    "Biblioteca de componentes React para Tailwind CSS: Button, Input e Select tipados e acessíveis, com máscaras (CPF, CNPJ, CEP, telefone, cartão), ripple e uma única prop de cor para customizar toda a interface.";

export const SITE_KEYWORDS = [
    "vaiperui",
    "biblioteca de componentes React",
    "componentes React",
    "React UI library",
    "Tailwind CSS",
    "componentes Tailwind",
    "design system",
    "TypeScript",
    "componentes acessíveis",
    "Input com máscara",
    "máscara CPF CNPJ React",
    "máscara de telefone React",
    "máscara de CEP",
    "React Select",
    "React Button",
    "customColor",
    "dark mode",
    "ripple effect",
    "npm",
];

export const GITHUB_URL = "https://github.com/vaiperliotech/vaiperui";
