import { Button } from "vaiperui";

export default function Home() {
    return (
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 p-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-semibold">vaiperui</h1>
                <p className="text-neutral-600">Playground da biblioteca de componentes.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="default">Default</Button>
                <Button variant="primary">Primary</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="danger">Danger</Button>
            </div>
        </main>
    );
}
