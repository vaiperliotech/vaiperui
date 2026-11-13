# Recipes

Complete, compiled-against-the-library examples for common screens. Each block is a whole module: copy it and adapt the data. They use `useState` and handlers, so in Next.js put them in a `"use client"` file.

## 1. Form with masks, validation and a toast

`errorMessage` alone turns on the error state. Inputs with a `mask` give `event.target.value` already masked.

```tsx
import { useState } from "react";
import { Button, Checkbox, Input, Stack, Textarea, toast } from "vaiperui";

type Field = "name" | "phone" | "terms";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!name.trim()) next.name = "Enter your name";
    if (phone.length < 19) next.phone = "Enter a valid phone";
    if (!terms) next.terms = "You must accept the terms";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      toast({ variantColor: "success", title: "Account created", description: name });
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <Stack gap={4}>
        <Input
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          errorMessage={errors.name}
        />
        <Input
          label="Phone"
          mask="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          helperText="With country code"
          errorMessage={errors.phone}
        />
        <Textarea label="About you" rows={4} value={bio} onChange={(event) => setBio(event.target.value)} />
        <Checkbox
          label="I accept the terms"
          checked={terms}
          onChange={(event) => setTerms(event.target.checked)}
          errorMessage={errors.terms}
        />
        <Button type="submit">Create account</Button>
      </Stack>
    </form>
  );
}
```

## 2. Select with remote data: infinite scroll and server-side search

`loading` shows the spinner row, `onReachEnd` asks for the next page, `hasMore={false}` stops asking, and `onSearchChange` (with `searchable`) turns the local filter off: `options` must already be the matches. Debounce the search yourself.

```tsx
import { useEffect, useRef, useState } from "react";
import { Select } from "vaiperui";

type Option = { value: string; label: string };

// Replace with your API: 20 items per page, filtered by `query`.
async function fetchUsers(query: string, page: number): Promise<{ items: Option[]; hasMore: boolean }> {
  const all = Array.from({ length: 95 }, (_, i) => ({ value: String(i), label: `User ${i + 1}` }));
  const matches = all.filter((user) => user.label.toLowerCase().includes(query.toLowerCase()));
  return { items: matches.slice(page * 20, page * 20 + 20), hasMore: (page + 1) * 20 < matches.length };
}

export function UserSelect({ onChange }: { onChange: (userId: string) => void }) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const query = useRef("");
  const page = useRef(0);
  const request = useRef(0);

  async function load(reset: boolean) {
    const id = ++request.current;
    if (reset) page.current = 0;
    setLoading(true);
    const result = await fetchUsers(query.current, page.current);
    if (id !== request.current) return; // a newer request is in flight
    page.current += 1;
    setOptions((current) => (reset ? result.items : [...current, ...result.items]));
    setHasMore(result.hasMore);
    setLoading(false);
  }

  useEffect(() => {
    void load(true);
  }, []);

  return (
    <Select
      label="Assignee"
      searchable
      options={options}
      loading={loading}
      hasMore={hasMore}
      onReachEnd={() => void load(false)}
      onSearchChange={(text) => {
        query.current = text;
        void load(true);
      }}
      onValueChange={onChange}
    />
  );
}
```

## 3. Confirm dialog, controlled, with a toast

Give `Modal` a `title`. Without `trigger`, drive it with `open` and `onOpenChange`. `ModalClose` closes it around any element.

```tsx
import { useState } from "react";
import { Button, Modal, ModalClose, toast } from "vaiperui";

export function DeleteProject({ name, onDelete }: { name: string; onDelete: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await onDelete();
      setOpen(false);
      toast({ variantColor: "success", description: `${name} deleted` });
    } catch {
      toast({ variantColor: "danger", title: "Could not delete", description: "Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variantColor="danger" variant="outlined" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={`Delete ${name}?`}
        footer={
          <>
            <ModalClose>
              <Button variant="outlined">Cancel</Button>
            </ModalClose>
            <Button variantColor="danger" onClick={() => void confirm()} disabled={busy}>
              Delete
            </Button>
          </>
        }
      >
        This action cannot be undone.
      </Modal>
    </>
  );
}
```

## 4. Filter bar, table and pagination

`DateRangePicker` calls `onValueChange` with only `from` first, then with `from` and `to`: filter when both exist. `Table` has no sorting or paging of its own.

```tsx
import { useMemo, useState } from "react";
import {
  Badge,
  DateRangePicker,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type DateRange,
} from "vaiperui";

type Order = { id: number; customer: string; status: "paid" | "pending"; total: number; date: Date };

const PAGE_SIZE = 10;

export function Orders({ orders }: { orders: Order[] }) {
  const [period, setPeriod] = useState<DateRange>({});
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      orders.filter(
        (order) =>
          (status === "all" || order.status === status) &&
          (!period.from || !period.to || (order.date >= period.from && order.date <= period.to)),
      ),
    [orders, period, status],
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Stack gap={4}>
      <Stack direction="horizontal" gap={3} align="end" wrap>
        <DateRangePicker
          label="Period"
          presets
          value={period}
          onValueChange={(range) => {
            setPeriod(range);
            setPage(1);
          }}
        />
        <Select
          label="Status"
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
          ]}
        />
      </Stack>
      <Table striped>
        <TableCaption>{rows.length} orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge status={order.status === "paid" ? "success" : "pending"}>{order.status}</Badge>
              </TableCell>
              <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </Stack>
  );
}
```

## 5. Upload with validation and a file list

`Upload` only captures files. `onFilesChange` gets the files just chosen: you accumulate, validate size and show errors.

```tsx
import { useState } from "react";
import { Button, List, ListItem, Tag, Upload } from "vaiperui";

const MAX_BYTES = 5 * 1024 * 1024;

export function Attachments({ onSend }: { onSend: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>();

  function add(chosen: File[]) {
    const tooBig = chosen.filter((file) => file.size > MAX_BYTES);
    setError(tooBig.length ? `${tooBig.map((file) => file.name).join(", ")} is larger than 5 MB` : undefined);
    setFiles((current) => [...current, ...chosen.filter((file) => file.size <= MAX_BYTES)]);
  }

  return (
    <div>
      <Upload
        multiple
        accept=".pdf,image/*"
        label="Attachments"
        description="PDF or image, up to 5 MB"
        errorMessage={error}
        onFilesChange={add}
      />
      <List divided>
        {files.map((file, index) => (
          <ListItem
            key={`${file.name}-${index}`}
            title={file.name}
            description={`${Math.ceil(file.size / 1024)} KB`}
            trailing={<Tag onDismiss={() => setFiles((current) => current.filter((_, i) => i !== index))}>Remove</Tag>}
          />
        ))}
      </List>
      <Button disabled={files.length === 0} onClick={() => onSend(files)}>
        Send {files.length} files
      </Button>
    </div>
  );
}
```

## 6. Settings screen: tabs, switch, slider, radios

`Slider` values are arrays. `Switch` and `Checkbox` use the native `checked` / `onChange(event)`. `RadioGroup` and `Tabs` give the value, not an event.

```tsx
import { useState } from "react";
import { Card, CardBody, CardHeader, RadioGroup, Slider, Stack, Switch, Tab, TabList, TabPanel, Tabs } from "vaiperui";

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState([40]);
  const [theme, setTheme] = useState("system");

  return (
    <Tabs defaultValue="general">
      <TabList aria-label="Settings sections">
        <Tab value="general">General</Tab>
        <Tab value="sound">Sound</Tab>
      </TabList>
      <TabPanel value="general">
        <Card>
          <CardHeader>Preferences</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Switch
                label="Email notifications"
                helperText="One email per day"
                checked={notifications}
                onChange={(event) => setNotifications(event.target.checked)}
              />
              <RadioGroup
                label="Theme"
                value={theme}
                onValueChange={setTheme}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                  { value: "system", label: "System", description: "Follows your device" },
                ]}
              />
            </Stack>
          </CardBody>
        </Card>
      </TabPanel>
      <TabPanel value="sound">
        <p>Volume: {volume[0]}%</p>
        <Slider aria-label="Volume" value={volume} onValueChange={setVolume} />
      </TabPanel>
    </Tabs>
  );
}
```

## 7. App shell: toasts, dark mode and layout

`<Toaster />` goes once near the root. Dark mode is the `dark` class on `<html>`.

```tsx
import { useEffect, useState } from "react";
import { Button, Container, Divider, Grid, GridItem, Stack, Toaster, toast } from "vaiperui";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <Toaster position="top-right" />
      <Container size="xl" as="main">
        <Stack direction="horizontal" align="center" justify="between" gap={3}>
          <h1>Dashboard</h1>
          <Button variant="outlined" onClick={() => setDark((value) => !value)}>
            {dark ? "Light" : "Dark"} mode
          </Button>
        </Stack>
        <Divider spacing="md" />
        <Grid columns={{ base: 1, md: 3 }} gap={4}>
          <GridItem colSpan={2}>{children}</GridItem>
          <GridItem>
            <Button onClick={() => toast({ description: "Hello" })}>Say hello</Button>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
```
