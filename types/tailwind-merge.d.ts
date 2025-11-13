declare module "tailwind-merge" {
  export type ClassValue =
    | string
    | number
    | null
    | undefined
    | ClassValue[]
    | { [key: string]: boolean | string | number | undefined | null };

  export function twMerge(...inputs: ClassValue[]): string;
}
