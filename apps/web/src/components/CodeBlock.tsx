"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

const KEYWORDS = new Set([
    "import",
    "from",
    "const",
    "function",
    "return",
    "export",
    "default",
    "new",
    "true",
    "false",
    "null",
    "void",
]);

type Token = {
    text: string;
    kind: "keyword" | "string" | "tag" | "attr" | "punct" | "comment" | "plain";
};

function tokenize(line: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const push = (text: string, kind: Token["kind"]) => tokens.push({ text, kind });

    while (i < line.length) {
        const rest = line.slice(i);

        const comment = rest.match(/^\/\/.*/);
        if (comment) {
            push(comment[0], "comment");
            i += comment[0].length;
            continue;
        }

        const str = rest.match(/^("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/);
        if (str) {
            push(str[0], "string");
            i += str[0].length;
            continue;
        }

        const tag = rest.match(/^(<\/?)([A-Za-z][\w.]*)/);
        if (tag) {
            push(tag[1] ?? "", "punct");
            push(tag[2] ?? "", "tag");
            i += tag[0].length;
            continue;
        }

        const attr = rest.match(/^\s([a-zA-Z][\w-]*)(?==)/);
        if (attr) {
            push(attr[0].slice(0, 1), "plain");
            push(attr[1] ?? "", "attr");
            i += attr[0].length;
            continue;
        }

        const word = rest.match(/^[A-Za-z_$][\w$]*/);
        if (word) {
            push(word[0], KEYWORDS.has(word[0]) ? "keyword" : "plain");
            i += word[0].length;
            continue;
        }

        const punct = rest.match(/^(\/?>|[{}()[\]=;:,.])/);
        if (punct) {
            push(punct[0], "punct");
            i += punct[0].length;
            continue;
        }

        push(line[i] ?? "", "plain");
        i += 1;
    }

    return tokens;
}

const TOKEN_CLASS: Record<Token["kind"], string> = {
    keyword: "text-accent-purple",
    string: "text-accent-purple",
    tag: "text-accent-blue",
    attr: "text-ink",
    punct: "text-ink-faint",
    comment: "text-ink-faint italic",
    plain: "text-ink",
};

export function CodeBlock({ code, className = "" }: { code: string; className?: string }) {
    const [copied, setCopied] = useState(false);
    const lines = code.replace(/\n$/, "").split("\n");

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            // Clipboard API unavailable — the code is still selectable/copyable by hand.
        }
    }

    return (
        <div className="group/code relative">
            <button
                type="button"
                onClick={handleCopy}
                aria-label="Copiar código"
                className={`code-copy-btn absolute top-0 right-0 flex items-center gap-1.5 rounded-md border border-line-strong bg-bg-2 px-2 py-1 font-mono text-xs text-ink-faint transition-opacity duration-150 hover:border-accent-blue hover:text-ink ${copied ? "is-copied text-accent-blue" : ""}`}
            >
                {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                {copied ? "copiado" : "copiar"}
            </button>
            <pre className={`overflow-x-auto font-mono text-[13px] leading-6 ${className}`}>
                <code>
                    {lines.map((line, lineIndex) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static code sample, line order never changes
                        <div key={lineIndex}>
                            {line.length === 0
                                ? " "
                                : tokenize(line).map((token, tokenIndex) => (
                                      // biome-ignore lint/suspicious/noArrayIndexKey: static code sample, token order never changes
                                      <span key={tokenIndex} className={TOKEN_CLASS[token.kind]}>
                                          {token.text}
                                      </span>
                                  ))}
                        </div>
                    ))}
                </code>
            </pre>
        </div>
    );
}
