import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Chevron(
  props: ComponentProps<"svg"> & {
    readonly open: boolean;
  },
) {
  const { open, className, ...rest } = props;
  return (
    <svg
      {...rest}
      className={twMerge(
        "mt-0.5 flex-none transition text-gray-700",
        open && "rotate-180",
        className,
      )}
      height={5}
      viewBox="0 0 8 5"
      width={8}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M0.4609 0.593871C0.64835 0.406421 0.95227 0.406421 1.13972 0.593871L4.00031 3.45446L6.8609 0.593871C7.0484 0.406421 7.3523 0.406421 7.5397 0.593871C7.7272 0.781321 7.7272 1.08524 7.5397 1.27269L4.33972 4.4727C4.24971 4.5627 4.12762 4.6133 4.00031 4.6133C3.87301 4.6133 3.75092 4.5627 3.6609 4.4727L0.4609 1.27269C0.27345 1.08524 0.27345 0.781321 0.4609 0.593871Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
