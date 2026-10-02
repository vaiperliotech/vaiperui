import { Button } from "vaiperui";

export default function Home() {
    return (
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 p-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-semibold">vaiperui</h1>
                <p className="text-neutral-600">Playground da biblioteca de componentes.</p>
            </div>
            <section className="[&>div]:mb-4">
                <h2 className="text-base font-semibold mb-4">Button</h2>
                <div>
                    <h3 className="text-sm font-medium">Solid</h3>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button variantColor="primary">Primary</Button>
                        <Button variantColor="success">Success</Button>
                        <Button variantColor="warning">Warning</Button>
                        <Button variantColor="danger">Danger</Button>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium">Solid inverse</h3>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="solid-inverse" variantColor="primary">
                            Primary
                        </Button>
                        <Button variant="solid-inverse" variantColor="success">
                            Success
                        </Button>
                        <Button variant="solid-inverse" variantColor="warning">
                            Warning
                        </Button>
                        <Button variant="solid-inverse" variantColor="danger">
                            Danger
                        </Button>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium">Outlined</h3>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="outlined" variantColor="primary">
                            Primary
                        </Button>
                        <Button variant="outlined" variantColor="success">
                            Success
                        </Button>
                        <Button variant="outlined" variantColor="warning">
                            Warning
                        </Button>
                        <Button variant="outlined" variantColor="danger">
                            Danger
                        </Button>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium">Outlined2</h3>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="outlined2" variantColor="primary">
                            Primary
                        </Button>
                        <Button variant="outlined2" variantColor="success">
                            Success
                        </Button>
                        <Button variant="outlined2" variantColor="warning">
                            Warning
                        </Button>
                        <Button variant="outlined2" variantColor="danger">
                            Danger
                        </Button>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium">Transparent</h3>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="transparent" variantColor="primary">
                            Primary
                        </Button>
                        <Button variant="transparent" variantColor="success">
                            Success
                        </Button>
                        <Button variant="transparent" variantColor="warning">
                            Warning
                        </Button>
                        <Button variant="transparent" variantColor="danger">
                            Danger
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
