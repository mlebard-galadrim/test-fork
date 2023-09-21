export type TopBarElementType = {
  type: "text" | "title" | "buttonText" | "logo" | "buttonIcon" | "progressbar" | "buttonImage" | "rawtext";
  title?: string;
  value?: number;
  function?: () => void;
  source?: any;
};
