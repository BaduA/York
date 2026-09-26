import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "iconify-icon": {
        icon?: string;
        width?: string | number;
        height?: string | number;
        className?: string;
        style?: string | Record<string, string | number>;
        [key: string]: unknown;
      };
    }
  }
}
