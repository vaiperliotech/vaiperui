"use client";

import { Button, Input } from "vaiperui";

export function ButtonDemo() {
    return <Button variantColor="primary">Salvar</Button>;
}

export function ButtonVariants() {
    return (
        <div className="flex flex-wrap gap-3">
            <Button variantColor="success" radius="full">
                Confirmar
            </Button>
            <Button variant="outlined" variantColor="warning">
                Revisar
            </Button>
            <Button variantColor="danger" hover="lift">
                Excluir
            </Button>
        </div>
    );
}

export function InputDemo() {
    return <Input label="CPF" mask="cpf" />;
}
