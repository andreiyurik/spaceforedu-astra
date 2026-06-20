// The exact set of strings the consultation dialog renders. Resolving these
// once (server-side) and handing them to the dialog island keeps each island's
// serialized props to ~11 short strings instead of the whole i18n bundle.
export interface ConsultationStrings {
  title: string;
  desc: string;
  duration: string;
  items: string[];
  spots: string;
  waButton: string;
  waMessage: string;
  waHint: string;
  successTitle: string;
  successDesc: string;
}

const CONSULTATION_ITEM_KEYS = [
  "consultation_dialog_item_1",
  "consultation_dialog_item_2",
  "consultation_dialog_item_3",
  "consultation_dialog_item_4",
] as const;

// The consultation copy is service-agnostic — it always lives under
// `public.homologacion.consultation_dialog_*`, whichever page opens the dialog.
const PREFIX = "public.homologacion";

export function buildConsultationStrings(
  t: (key: string) => string,
): ConsultationStrings {
  return {
    title: t(`${PREFIX}.consultation_dialog_title`),
    desc: t(`${PREFIX}.consultation_dialog_desc`),
    duration: t(`${PREFIX}.consultation_dialog_duration`),
    items: CONSULTATION_ITEM_KEYS.map((k) => t(`${PREFIX}.${k}`)),
    spots: t(`${PREFIX}.consultation_dialog_spots`),
    waButton: t(`${PREFIX}.consultation_dialog_wa_button`),
    waMessage: t(`${PREFIX}.consultation_dialog_wa_message`),
    waHint: t(`${PREFIX}.consultation_dialog_wa_hint`),
    successTitle: t("public.consultation_success.title"),
    successDesc: t("public.consultation_success.desc"),
  };
}
