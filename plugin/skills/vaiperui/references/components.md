# vaiperui components (44)

Version 1.0.0. One file per component with props, examples and accessibility.

## Forms
- [Button](button.md): All the native <button> props, plus variant, color, size, radius, hover and ready-made animations.
- [Input](input.md): All the native <input> props, plus the library's differentiator: Brazilian masks (cpf, cnpj, cei, cep) and global ones (phone, creditCard, cardExpiry, date, time).
- [Select](select.md): Accessible combobox with keyboard navigation, type-to-search and a detailed style with an icon/description per option.
- [Textarea](textarea.md): Multi-line text field with label, helper and error text, and the same focus styles as Input.
- [Checkbox](checkbox.md): Accessible checkbox with label, helper and error text, an indeterminate state and colors.
- [Radio](radio.md): RadioGroup renders a set of options from an array; Radio is the single native radio.
- [Switch](switch.md): On/off toggle with role="switch", label, helper and error text and colors.
- [Slider](slider.md): Pick a number or an interval by dragging a thumb or using the keyboard.
- [Upload](upload.md): Area to pick files by clicking or dragging them in, with an accept filter.
- [Calendar](calendar.md): One-month calendar to pick a day or a range, with full keyboard navigation.
- [DatePicker](date-picker.md): Field that opens a Calendar to choose a day.
- [DateRangePicker](date-range-picker.md): Field that opens a Calendar to choose a start and an end, with shortcut presets.
- [TimePicker](time-picker.md): Field that opens hour and minute columns to choose a time of day.
- [DateTimePicker](date-time-picker.md): Field that opens a Calendar and time columns to choose a day and a time.

## Data display
- [Avatar](avatar.md): Round user picture that falls back to initials when there is no image or it fails to load.
- [Badge](badge.md): Small status label with semantic colors and an optional dot.
- [Tag](tag.md): Label for categories or filters, with an optional remove button.
- [Card](card.md): Elevated surface that groups related content, with optional header, body and footer.
- [List](list.md): Semantic list of items with title, description, leading and trailing elements.
- [Table](table.md): Styled native table parts for comparable data across columns.
- [Accordion](accordion.md): Stack of sections that expand and collapse, with keyboard navigation.

## Feedback
- [Alert](alert.md): Inline message with a title, description, icon, optional action and a close button.
- [Banner](banner.md): Full-width page-level message, with an optional action and close button.
- [Toast](toast.md): Transient notifications fired from anywhere with toast(), rendered by a single Toaster.
- [Skeleton](skeleton.md): Loading placeholder shaped like the content: text lines, title, avatar, rectangle or card.

## Navigation
- [Tabs](tabs.md): Switch between distinct sections of content, following the WAI-ARIA tabs pattern.
- [SegmentedControl](segmented-control.md): A single choice among a few options, to switch between views of the same content.
- [Breadcrumb](breadcrumb.md): Shows where the current page sits in the hierarchy, with a link back to each level.
- [Pagination](pagination.md): Moves between pages of results; the parent owns the page and fetches the data.
- [Stepper](stepper.md): Shows progress through a sequential flow such as a checkout or onboarding.

## Overlays
- [Modal](modal.md): Dialog over a backdrop with focus trap, scroll lock, Escape/backdrop close and role="dialog".
- [Drawer](drawer.md): Side panel that slides from any edge, with the same dialog behavior as Modal.
- [Popover](popover.md): Click-triggered panel anchored to an element, with flip/shift and outside click or Escape to close.
- [Menu](menu.md): Dropdown menu button with arrow-key navigation, typeahead, icons, separators and danger items.
- [Tooltip](tooltip.md): Short description on hover and keyboard focus, with delay, arrow and role="tooltip".

## Layout
- [Container](container.md): Centered wrapper with a max width and responsive side padding.
- [Grid](grid.md): CSS grid with responsive columns, gap and items that span columns or rows.
- [Stack](stack.md): Flex layout in one direction with gap, alignment and an optional divider.
- [Divider](divider.md): Horizontal or vertical separator, with optional text inside.

## Media
- [AudioPlayer](audio-player.md): Accessible audio player with play/pause, seek bar, time, speed and volume.
- [VideoPlayer](video-player.md): Video player with custom controls, fullscreen, captions and keyboard shortcuts.
- [Gallery](gallery.md): Responsive grid of thumbnails that opens a full-screen viewer.
- [Lightbox](lightbox.md): Full-screen image viewer with navigation, counter and captions.
- [Carousel](carousel.md): Slides with arrows, dots, keyboard, optional autoplay and loop.
