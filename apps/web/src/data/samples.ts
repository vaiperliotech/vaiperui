import type { Locale } from "@/i18n/config";

export type Samples = {
    button: string;
    click: string;
    remove: string;
    name: string;
    yourName: string;
    fullName: string;
    email: string;
    emailPlaceholder: string;
    emailError: string;
    country: string;
    pick: string;
    pickCountry: string;
    searchCountry: string;
    search: string;
    brazil: string;
    unitedStates: string;
    portugal: string;
    southAmerica: string;
    northAmerica: string;
    europe: string;
    orange: string;
    green: string;
    violet: string;
    ringFocus: string;
    outlineFocus: string;
    helperItem: string;
    errorItem: string;
    noSearch: string;
    disabledOption: string;
    phone: string;
    creditCard: string;
    expiry: string;
    date: string;
    time: string;
    zip: string;
};

export const samples: Record<Locale, Samples> = {
    en: {
        button: "Button",
        click: "Click here",
        remove: "Delete",
        name: "Name",
        yourName: "Type your name",
        fullName: "Full name",
        email: "Email",
        emailPlaceholder: "you@company.com",
        emailError: "Enter a valid email",
        country: "Country",
        pick: "Choose",
        pickCountry: "Choose a country",
        searchCountry: "Search for a country",
        search: "Search",
        brazil: "Brazil",
        unitedStates: "United States",
        portugal: "Portugal",
        southAmerica: "South America",
        northAmerica: "North America",
        europe: "Europe",
        orange: "Orange",
        green: "Green",
        violet: "Violet",
        ringFocus: "Ring focus",
        outlineFocus: "Outline-only focus",
        helperItem: "helper",
        errorItem: "error",
        noSearch: "no search",
        disabledOption: "disabled option",
        phone: "Phone",
        creditCard: "Credit card",
        expiry: "Expiry",
        date: "Date",
        time: "Time",
        zip: "ZIP",
    },
    pt: {
        button: "Botão",
        click: "Clique aqui",
        remove: "Excluir",
        name: "Nome",
        yourName: "Digite seu nome",
        fullName: "Nome completo",
        email: "E-mail",
        emailPlaceholder: "voce@empresa.com",
        emailError: "Informe um e-mail válido",
        country: "País",
        pick: "Escolha",
        pickCountry: "Escolha um país",
        searchCountry: "Busque um país",
        search: "Busca",
        brazil: "Brasil",
        unitedStates: "Estados Unidos",
        portugal: "Portugal",
        southAmerica: "América do Sul",
        northAmerica: "América do Norte",
        europe: "Europa",
        orange: "Laranja",
        green: "Verde",
        violet: "Violeta",
        ringFocus: "Foco com anel",
        outlineFocus: "Foco só com outline",
        helperItem: "helper",
        errorItem: "erro",
        noSearch: "sem busca",
        disabledOption: "opção desabilitada",
        phone: "Telefone",
        creditCard: "Cartão",
        expiry: "Validade",
        date: "Data",
        time: "Hora",
        zip: "CEP",
    },
    es: {
        button: "Botón",
        click: "Haz clic aquí",
        remove: "Eliminar",
        name: "Nombre",
        yourName: "Escribe tu nombre",
        fullName: "Nombre completo",
        email: "Correo",
        emailPlaceholder: "tu@empresa.com",
        emailError: "Ingresa un correo válido",
        country: "País",
        pick: "Elige",
        pickCountry: "Elige un país",
        searchCountry: "Busca un país",
        search: "Búsqueda",
        brazil: "Brasil",
        unitedStates: "Estados Unidos",
        portugal: "Portugal",
        southAmerica: "Sudamérica",
        northAmerica: "Norteamérica",
        europe: "Europa",
        orange: "Naranja",
        green: "Verde",
        violet: "Violeta",
        ringFocus: "Foco con anillo",
        outlineFocus: "Foco solo con outline",
        helperItem: "helper",
        errorItem: "error",
        noSearch: "sin búsqueda",
        disabledOption: "opción deshabilitada",
        phone: "Teléfono",
        creditCard: "Tarjeta",
        expiry: "Vencimiento",
        date: "Fecha",
        time: "Hora",
        zip: "Cód. postal",
    },
};

/** Picks one of the three translations of a string for `locale`. */
export function makeT(locale: Locale) {
    return (en: string, pt: string, es: string) => ({ en, pt, es })[locale];
}

/** Localized UI strings for the Select, spread into every demo (`<Select {...selectLabels(locale)} />`). */
export function selectLabels(locale: Locale) {
    const t = makeT(locale);
    const search = samples[locale].search;
    return {
        searchPlaceholder: `${search}...`,
        emptyMessage: t(
            "No options found",
            "Nenhuma opção encontrada",
            "No se encontraron opciones",
        ),
        clearSearchLabel: t("Clear search", "Limpar busca", "Borrar búsqueda"),
        noResultsMessage: (query: string) =>
            t(
                `No results for "${query}"`,
                `Nenhum resultado para "${query}"`,
                `Sin resultados para "${query}"`,
            ),
    };
}
