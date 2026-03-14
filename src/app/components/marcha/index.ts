/**
 * Librería de componentes Marcha — design system.
 * Importa desde aquí: import { MButton, MCard } from '@/components/marcha';
 */

// Primitivos
export { MIcon } from './m-icon/m-icon';

export { MButton } from './m-button/m-button';
export type { MButtonSeverity, MButtonVariant, MButtonSize } from './m-button/m-button';

export { MCard } from './m-card/m-card';
export type { MCardVariant } from './m-card/m-card';

export { MAvatar } from './m-avatar/m-avatar';
export type { MAvatarSize, MAvatarShape } from './m-avatar/m-avatar';

export { MBadge } from './m-badge/m-badge';
export type { MBadgeSeverity, MBadgeSize } from './m-badge/m-badge';

export { MDivider } from './m-divider/m-divider';

export { MOverlayBadge } from './m-overlay-badge/m-overlay-badge';

// Formularios
export { MInput } from './m-input/m-input';
export type { MInputType } from './m-input/m-input';

export { MPassword } from './m-password/m-password';

export { MTextarea } from './m-textarea/m-textarea';

export { MCheckbox } from './m-checkbox/m-checkbox';

export { MNumberInput } from './m-number-input/m-number-input';

export { MFloatLabel } from './m-float-label/m-float-label';

export { MSelect } from './m-select/m-select';
export type { MSelectOption } from './m-select/m-select';

export { MRadioGroup } from './m-radio-group/m-radio-group';
export type { MRadioOption } from './m-radio-group/m-radio-group';

export { MRangeSlider } from './m-range-slider/m-range-slider';

// Overlays y notificaciones
export { MMessage } from './m-message/m-message';
export type { MMessageSeverity } from './m-message/m-message';

export { MToast } from './m-toast/m-toast';
export { MNotificationService } from './m-toast/m-notification.service';
export type { MToastItem, MToastSeverity } from './m-toast/m-notification.service';

export { MDialog } from './m-dialog/m-dialog';
export type { MDialogSize } from './m-dialog/m-dialog';

export { MDrawer } from './m-drawer/m-drawer';
export type { MDrawerPosition } from './m-drawer/m-drawer';

// Layout y navegacion
export { MTabs, MTabPanel } from './m-tabs/m-tabs';
export type { MTabItem, MTabsVariant } from './m-tabs/m-tabs';

export { MAccordion } from './m-accordion/m-accordion';
export type { MAccordionItem } from './m-accordion/m-accordion';

export { MChip } from './m-chip/m-chip';
export type { MChipSeverity, MChipSize } from './m-chip/m-chip';

export { MTooltip } from './m-tooltip/m-tooltip';
export type { MTooltipPosition } from './m-tooltip/m-tooltip';

// Inputs avanzados
export { MCalendar } from './m-calendar/m-calendar';
export type { MCalendarMode, MDateRange } from './m-calendar/m-calendar';

export { MTable } from './m-table/m-table';
export type { MTableColumn, MTableVariant, MTableRow, MTableAction } from './m-table/m-table';

export { MColorPicker } from './m-color-picker/m-color-picker';

// Navegacion
export { MToggleButton } from './m-toggle-button/m-toggle-button';
export type { MToggleButtonSize, MToggleButtonSeverity } from './m-toggle-button/m-toggle-button';
export { MMenubar } from './m-menubar/m-menubar';
export type { MMenubarItem, MMenubarSubItem } from './m-menubar/m-menubar';

// Utilidades
export { MToggleSwitch } from './m-toggle-switch/m-toggle-switch';
export type { MToggleSize } from './m-toggle-switch/m-toggle-switch';
export { MCopy } from './m-copy/m-copy';
export { MSortable } from './m-sortable/m-sortable';
export type { MSortableItem } from './m-sortable/m-sortable';

// Visualización de datos
export { MDataview } from './m-dataview/m-dataview';
export type { MDataviewLayout, MDataviewSortOption } from './m-dataview/m-dataview';
